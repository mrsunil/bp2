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
    public class ArbitrationsCommandsHandler :
        IRequestHandler<ArbitrationsUpdateCommands>
    {

        private readonly ILogger<ArbitrationsCommandsHandler> _logger;
        private readonly IIdentityService _identityService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IArbitrationRepository _arbitrationsRepository;

        public ArbitrationsCommandsHandler(
            ILogger<ArbitrationsCommandsHandler> logger,
            IIdentityService identityService,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IArbitrationRepository arbitrationConfigurationRepository)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _arbitrationsRepository = arbitrationConfigurationRepository ?? throw new ArgumentNullException(nameof(arbitrationConfigurationRepository));
        }

        /// <summary>
        /// Handling the "update" event of a Price unit configuration
        /// </summary>
        /// <param name="request">The command object that contains all the properties to update Price unit and related objects.</param>
        /// <param name="cancellationToken">Token to cancel the operation.</param>
        public async Task<Unit> Handle(ArbitrationsUpdateCommands request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                await _arbitrationsRepository.UpdateArbitration(request.MasterDataList);

                _logger.LogInformation("Arbitration updated.");

                _unitOfWork.Commit();

                return Unit.Value;
            }
            catch
            {
                _logger.LogInformation("Arbitration update failed.");
                _unitOfWork.Rollback();
                throw;
            }
        }

        /// <summary>
        /// Handling the "create" event of a commodity configuration
        /// </summary>
        /// <param name="request">The command object that contains all the properties to create commodities and related objects.</param>
        /// <param name="cancellationToken">Token to cancel the operation.</param>
        public async Task<Unit> Handle(ArbitrationsCreateCommands request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                await _arbitrationsRepository.CreateArbitration(request.MasterDataList);

                _logger.LogInformation("Arbitrations created.");

                _unitOfWork.Commit();

                return Unit.Value;
            }
            catch
            {
                _logger.LogInformation("Arbitrations create failed.");
                _unitOfWork.Rollback();
                throw;
            }
        }
    }
}
