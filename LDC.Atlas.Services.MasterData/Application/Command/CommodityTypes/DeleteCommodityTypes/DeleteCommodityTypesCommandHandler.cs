using AutoMapper;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.MasterData.Entities;
using LDC.Atlas.Services.MasterData.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Application.Command.CommodityTypes.DeleteCommodityTypes
{
    public class DeleteCommodityTypesCommandHandler :
        IRequestHandler<DeleteCommodityTypesCommand, ICollection<MasterDataDeletionResult>>
    {
        private readonly ILogger<DeleteCommodityTypesCommandHandler> _logger;
        private readonly IIdentityService _identityService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ICommodityTypeRepository _commodityTypeRepository;

        public DeleteCommodityTypesCommandHandler(
            ILogger<DeleteCommodityTypesCommandHandler> logger,
            IIdentityService identityService,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            ICommodityTypeRepository commodityConfigurationRepository)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _commodityTypeRepository = commodityConfigurationRepository ?? throw new ArgumentNullException(nameof(commodityConfigurationRepository));
        }

        /// <summary>
        /// Handling the "delete" event of a commodity configuration
        /// </summary>
        /// <param name="request">The command object that contains the id of commodities.</param>
        /// <param name="cancellationToken">Token to cancel the operation.</param>
        public async Task<ICollection<MasterDataDeletionResult>> Handle(DeleteCommodityTypesCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                var deleteResults = await _commodityTypeRepository.DeleteCommodityType(request.MasterDataList);

                _unitOfWork.Commit();

                var result = deleteResults.Select(item => new MasterDataDeletionResult
                {
                    Id = item.MasterDataId,
                    Code = item.MasterDataCode,
                    MasterDataOperationStatus = item.GetMasterDataOperationStatus()
                }).ToList();

                return result;
            }
            catch
            {
                _logger.LogError("Commodity types delete failed.");
                _unitOfWork.Rollback();
                throw;
            }
        }
    }
}
