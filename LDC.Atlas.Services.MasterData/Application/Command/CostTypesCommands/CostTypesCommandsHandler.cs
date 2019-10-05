using AutoMapper;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.Services;
using LDC.Atlas.Services.MasterData.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Application.Command
{
    public class CostTypesCommandsHandler :
        IRequestHandler<CostTypesUpdateCommands>
    {

        private readonly ILogger<CostTypesCommandsHandler> _logger;
        private readonly IIdentityService _identityService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ICostTypesRepository _costTypesRepository;

        public CostTypesCommandsHandler(
            ILogger<CostTypesCommandsHandler> logger,
            IIdentityService identityService,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            ICostTypesRepository costTypesConfigurationRepository)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _costTypesRepository = costTypesConfigurationRepository ?? throw new ArgumentNullException(nameof(costTypesConfigurationRepository));
        }

        /// <summary>
        /// Handling the "update" event of a Price unit configuration
        /// </summary>
        /// <param name="request">The command object that contains all the properties to update Price unit and related objects.</param>
        /// <param name="cancellationToken">Token to cancel the operation.</param>
        public async Task<Unit> Handle(CostTypesUpdateCommands request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                // Added Check to validate nominal account is required if it is Trade Cost
                var lstWithNullCost = request.MasterDataList.Where(costType => costType.IsATradeCost && costType.NominalAccountId == null);

                if (lstWithNullCost.ToList().Count > 0)
                {
                    string errorMessage = string.Empty;

                    errorMessage = string.Join(", ", lstWithNullCost.Select(x => x.CostTypeCode).ToArray());
                    if (errorMessage.Length > 0)
                    {
                        errorMessage = "Nominal account is mandatory for cost type " + errorMessage + " since you have selected Trade Cost for these cost.";

                        throw new Exception(errorMessage);
                    }
                }

                await _costTypesRepository.UpdateCostTypes(request.MasterDataList);

                _logger.LogInformation("Cost Type updated.");

                _unitOfWork.Commit();

                return Unit.Value;
            }
            catch
            {
                _logger.LogInformation("Cost Type update failed.");
                _unitOfWork.Rollback();
                throw;
            }
        }

    }
}
