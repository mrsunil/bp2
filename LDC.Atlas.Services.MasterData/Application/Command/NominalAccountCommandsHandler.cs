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
    public class NominalAccountCommandsHandler :
        IRequestHandler<NominalAccountUpdateCommands>
    {

        private readonly ILogger<NominalAccountCommandsHandler> _logger;
        private readonly IIdentityService _identityService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly INominalAccountRepository _nominalAccountRepository;

        public NominalAccountCommandsHandler(
            ILogger<NominalAccountCommandsHandler> logger,
            IIdentityService identityService,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            INominalAccountRepository nominalAccountConfigurationRepository)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _nominalAccountRepository = nominalAccountConfigurationRepository ?? throw new ArgumentNullException(nameof(nominalAccountConfigurationRepository));
        }

        /// <summary>
        /// Handling the "update" event of a Price unit configuration
        /// </summary>
        /// <param name="request">The command object that contains all the properties to update Price unit and related objects.</param>
        /// <param name="cancellationToken">Token to cancel the operation.</param>
        public async Task<Unit> Handle(NominalAccountUpdateCommands request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                await _nominalAccountRepository.UpdateNominalAccount(request.MasterDataList);

                _logger.LogInformation("NominalAccount updated.");

                _unitOfWork.Commit();

                return Unit.Value;
            }
            catch
            {
                _logger.LogInformation("NominalAccount update failed.");
                _unitOfWork.Rollback();
                throw;
            }
        }

    }
}
