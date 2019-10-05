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

namespace LDC.Atlas.Services.MasterData.Application.Command.PricesUnits.DeletePricesUnits
{
    public class DeletePricesUnitsCommandHandler :
        IRequestHandler<DeletePricesUnitsCommand, ICollection<MasterDataDeletionResult>>
    {
        private readonly ILogger<DeletePricesUnitsCommandHandler> _logger;
        private readonly IIdentityService _identityService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IPriceUnitRepository _priceUnitRepository;

        public DeletePricesUnitsCommandHandler(
            ILogger<DeletePricesUnitsCommandHandler> logger,
            IIdentityService identityService,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IPriceUnitRepository pricesUnitsConfigurationRepository)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _priceUnitRepository = pricesUnitsConfigurationRepository ?? throw new ArgumentNullException(nameof(pricesUnitsConfigurationRepository));
        }

        /// <summary>
        /// Handling the "delete" event of a price unit configuration
        /// </summary>
        /// <param name="request">The command object that contains the list id of price unit.</param>
        /// <param name="cancellationToken">Token to cancel the operation.</param>
        public async Task<ICollection<MasterDataDeletionResult>> Handle(DeletePricesUnitsCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                var deleteResults = await _priceUnitRepository.DeleteAsync(request.MasterDataList);

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
                _logger.LogError("Prices Units delete failed.");
                _unitOfWork.Rollback();
                throw;
            }
        }
    }
}
