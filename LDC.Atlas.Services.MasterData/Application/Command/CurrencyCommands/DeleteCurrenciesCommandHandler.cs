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

namespace LDC.Atlas.Services.MasterData.Application.Command.CurrencyCommands
{
    public class DeleteCurrenciesCommandHandler :
        IRequestHandler<DeleteCurrenciesCommand, ICollection<MasterDataDeletionResult>>
    {

        private readonly ILogger<DeleteCurrenciesCommandHandler> _logger;
        private readonly IIdentityService _identityService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ICurrencyRepository _currencyRepository;

        public DeleteCurrenciesCommandHandler(
            ILogger<DeleteCurrenciesCommandHandler> logger,
            IIdentityService identityService,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            ICurrencyRepository commodityConfigurationRepository)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _currencyRepository = commodityConfigurationRepository ?? throw new ArgumentNullException(nameof(commodityConfigurationRepository));
        }

        public async Task<ICollection<MasterDataDeletionResult>> Handle(DeleteCurrenciesCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                var deleteResults = await _currencyRepository.DeleteCurrencies(request.MasterDataList.Select(m => m.CurrencyCode));

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
                _logger.LogError("Currency delete failed.");
                _unitOfWork.Rollback();
                throw;
            }
        }
    }
}
