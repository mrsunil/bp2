using AutoMapper;
using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.Services;
using LDC.Atlas.Services.MasterData.Entities;
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
    public class ContractTermsCommandsHandler : IRequestHandler<ContractTermsUpdateCommands>
    {
        private readonly ILogger<ContractTermsCommandsHandler> _logger;
        private readonly IIdentityService _identityService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IContractTermsRepository _contractTermsRepository;

        public ContractTermsCommandsHandler(
            ILogger<ContractTermsCommandsHandler> logger,
            IIdentityService identityService,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IContractTermsRepository contractTermsConfigurationRepository)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _contractTermsRepository = contractTermsConfigurationRepository ?? throw new ArgumentNullException(nameof(contractTermsConfigurationRepository));
        }

        /// <summary>
        /// Handling the "update" event of a contract term configuration
        /// </summary>
        /// <param name="request">The command object that contains all the properties to update contractTerms and related objects.</param>
        /// <param name="cancellationToken">Token to cancel the operation.</param>
        public async Task<Unit> Handle(ContractTermsUpdateCommands request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                await _contractTermsRepository.UpdateContractTerm(request.MasterDataList);

                _logger.LogInformation("Contract Terms updated.");

                _unitOfWork.Commit();

                return Unit.Value;
            }
            catch (Exception ex)
            {
                _logger.LogError("Contract Terms update failed. Error : " + ex.Message);
                _unitOfWork.Rollback();
                throw;
            }
        }
    }
}