using AutoMapper;
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
using LDC.Atlas.Application.Core.Services;

namespace LDC.Atlas.Services.MasterData.Application.Command
{
    public class PortsCommandsHandler :
        IRequestHandler<PortsUpdateCommands>
    {

        private readonly ILogger<PortsCommandsHandler> _logger;
        private readonly IIdentityService _identityService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IPortRepository _portsRepository;

        public PortsCommandsHandler(
            ILogger<PortsCommandsHandler> logger,
            IIdentityService identityService,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IPortRepository PortsUnitConfigurationRepository)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _portsRepository = PortsUnitConfigurationRepository ?? throw new ArgumentNullException(nameof(PortsUnitConfigurationRepository));
        }

        /// <summary>
        /// Handling the "update" event of a Ports unit configuration
        /// </summary>
        /// <param name="request">The command object that contains all the properties to update Ports unit and related objects.</param>
        /// <param name="cancellationToken">Token to cancel the operation.</param>
        public async Task<Unit> Handle(PortsUpdateCommands request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                await _portsRepository.UpdatePortsUnit(request.MasterDataList);

                _logger.LogInformation("Port updated.");

                _unitOfWork.Commit();

                return Unit.Value;
            }
            catch
            {
                _logger.LogInformation("Port update failed.");
                _unitOfWork.Rollback();
                throw;
            }
        }

    }
}
