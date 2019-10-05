using AutoMapper;
using LDC.Atlas.Application.Core.Entities;
using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.Services;
using LDC.Atlas.Services.Execution.Entities;
using LDC.Atlas.Services.Execution.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Application.Commands
{
    public class AllocateSectionCommandHandler :
        IRequestHandler<AllocateSectionCommand, long>,
         IRequestHandler<AllocateSectionListCommand, long>
    {
        private readonly ILogger<CharterCommandsHandler> _logger;
        private readonly IIdentityService _identityService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ITradeAllocationRepository _tradeAllocationRepository;
        private readonly IFreezeRepository _freezeRepository;
        private readonly IMapper _mapper;
        private readonly IProcessMessageService _processMessageService;

        public AllocateSectionCommandHandler(
            ILogger<CharterCommandsHandler> logger,
            IIdentityService identityService,
            IUnitOfWork unitOfWork,
            ITradeAllocationRepository tradeAllocationRepository,
            IFreezeRepository freezeRepository,
            IMapper mapper,
            IProcessMessageService processMessageService)
        {
            _tradeAllocationRepository = tradeAllocationRepository ?? throw new ArgumentNullException(nameof(tradeAllocationRepository));
            _freezeRepository = freezeRepository ?? throw new ArgumentNullException(nameof(freezeRepository));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper;
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _processMessageService = processMessageService ?? throw new ArgumentNullException(nameof(processMessageService));
        }

        public async Task<long> Handle(AllocateSectionCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var allocationOperation = _mapper.Map<AllocationOperation>(request);

                if (request.DataVersionId != null)
                {
                    var freezeDate = await _freezeRepository.GetFreezeNotClosedAsync(request.Company, request.DataVersionId.Value);

                    if (freezeDate == null)
                    {
                        throw new AtlasBusinessException($"Contracts cannot be allocated in a freeze if the month is closed.");
                    }
                }

                var response = await _tradeAllocationRepository.AllocateAsync(allocationOperation);

                if (request.DataVersionId != null)
                {
                    await InsertFreezeRecalcProcessQueue(request.SectionId, request.DataVersionId, request.Company);
                    await InsertFreezeRecalcProcessQueue(request.AllocatedSectionId, request.DataVersionId, request.Company);
                }

                _unitOfWork.Commit();

                _logger.LogInformation("Section {Atlas_SectionId} allocated with section {Atlas_AllocatedSectionId}.", request.SectionId, request.AllocatedSectionId);

                return response;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<long> Handle(AllocateSectionListCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var allocationOperation = _mapper.Map<IEnumerable<AllocationOperation>>(request.AllocateSections);
                long response = 0;
                if (request.DataVersionId != null)
                {
                    var freezeDate = await _freezeRepository.GetFreezeNotClosedAsync(request.Company, request.DataVersionId.Value);

                    if (freezeDate == null)
                    {
                        throw new AtlasBusinessException($"Contracts cannot be updated in a freeze if the month is closed.");
                    }
                }

                if (request.IsImageAllocation == true)
                {
                     response = await _tradeAllocationRepository.AllocateImageSectionListAsync(allocationOperation, request.Company, request.DataVersionId);
                }
                else
                {
                     response = await _tradeAllocationRepository.AllocateSectionListAsync(allocationOperation, request.Company, request.DataVersionId);
                }

                if (request.DataVersionId != null)
                {
                    // seems like you can allocate multiple couples at the same time
                    foreach (var section in request.AllocateSections)
                    {
                        await InsertFreezeRecalcProcessQueue(section.SectionId, request.DataVersionId, request.Company);
                        await InsertFreezeRecalcProcessQueue(section.AllocatedSectionId, request.DataVersionId, request.Company);
                    }
                }

                _unitOfWork.Commit();

                return response;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        /// <summary>
        /// This method will insert record into Process message to call the recalc
        /// </summary>
        /// <param name="sectionId"> section command object</param>
        /// <param name="dataVersionId">dataversion being edited</param>
        /// <param name="companyId">company on which there is edition</param>
        private async Task InsertFreezeRecalcProcessQueue(long sectionId, long? dataVersionId, string companyId)
        {
            dynamic message = new JObject(
               new JProperty("userId", _identityService.GetUserName()),
               new JProperty("sectionId", sectionId),
               new JProperty("dataVersionId", dataVersionId));

            await _processMessageService.SendMessage(new ProcessMessage
            {
                ProcessTypeId = (int)ProcessType.AtlasRecalculationProcessor,
                CompanyId = companyId,
                Content = message.ToString()
            });
        }
    }
}
