using AutoMapper;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.MasterData.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Application.Command.CommodityTypes.UpdateCommodityTypes
{
    public class UpdateCommodityTypesCommandHandler :
        IRequestHandler<UpdateCommodityTypesCommand>
    {

        private readonly ILogger<UpdateCommodityTypesCommandHandler> _logger;
        private readonly IIdentityService _identityService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ICommodityTypeRepository _commodityTypeRepository;

        public UpdateCommodityTypesCommandHandler(
            ILogger<UpdateCommodityTypesCommandHandler> logger,
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
        /// Handling the "update" event of a commodity configuration
        /// </summary>
        /// <param name="request">The command object that contains all the properties to update commodities and related objects.</param>
        /// <param name="cancellationToken">Token to cancel the operation.</param>
        public async Task<Unit> Handle(UpdateCommodityTypesCommand request, CancellationToken cancellationToken)
        {
            // No need to request database for "Code" unicity. Database handle this with unique key constraint
            _unitOfWork.BeginTransaction();

            try
            {
                await _commodityTypeRepository.UpdateCommodityType(request.MasterDataList);
                _unitOfWork.Commit();
                _logger.LogInformation("Commodities type updated.");

                return Unit.Value;
            }
            catch
            {
                _logger.LogError("Commodities update failed.");
                _unitOfWork.Rollback();
                throw;
            }
        }
    }
}
