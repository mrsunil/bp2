using AutoMapper;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.Services;
using LDC.Atlas.Services.Configuration.Entities;
using LDC.Atlas.Services.Configuration.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Application.Commands
{
    public class CompanyCreationCommandHandler : IRequestHandler<CreateCompanyConfigurationCommand>, IRequestHandler<CopyCompanyCommand>
    {
        private readonly ILogger<CompanyCreationCommandHandler> _logger;
        private readonly IIdentityService _identityService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ICompanyCreationRepository _companyCreationRepository;

        public CompanyCreationCommandHandler(
            ILogger<CompanyCreationCommandHandler> logger,
            IIdentityService identityService,
            IUnitOfWork unitOfWork,
              IMapper mapper,
            ICompanyCreationRepository companyCreationRepository)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _companyCreationRepository = companyCreationRepository ?? throw new ArgumentNullException(nameof(companyCreationRepository));
        }

        /// <summary>
        /// Creates a new company from scratch
        /// </summary>
        /// <param name="request">The command object that contains all the properties to create a company from scratch and related objects.</param>
        /// <param name="cancellationToken">Token to cancel the operation.</param>
        public async Task<Unit> Handle(CreateCompanyConfigurationCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var companyCreation = _mapper.Map<CompanyConfiguration>(request);

                var companyId = request.CompanyId;
                if (companyCreation.CompanySetup != null)
                {
                    int newCompanyId = await CreateCompanyConfiguration(companyId, companyCreation);
                }

                _unitOfWork.Commit();

                _logger.LogInformation("Company created successfully.");

                return Unit.Value;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        private async Task<int> CreateCompanyConfiguration(string companyId, CompanyConfiguration companyCreation)
        {
            int newCompanyId;

            newCompanyId = await _companyCreationRepository.CreateCompanySetup(companyId, companyCreation.CompanySetup);

            if (companyCreation.InvoiceSetup != null)
            {
                await _companyCreationRepository.CreateInvoiceSetup(companyId, companyCreation.InvoiceSetup);
            }

            if (companyCreation.InterfaceSetup != null && companyCreation.InterfaceSetup.Count() > 0)
            {
                IEnumerable<InterfaceSetup> interfaceSetup = companyCreation.InterfaceSetup.Where(item => item.InterfaceTypeId != null).ToList();

                if (interfaceSetup != null && interfaceSetup.Count() > 0)
                {
                    await _companyCreationRepository.CreateInterfaceSetup(companyId, interfaceSetup);
                }
            }

            if (companyCreation.InterCoNoInterCoEmailSetup != null)
            {
                await _companyCreationRepository.AddUpdateIntercoEmailAsync(companyId, companyCreation.InterCoNoInterCoEmailSetup);
            }

            if (companyCreation.DefaultAccountingSetup != null)
            {
                await _companyCreationRepository.CreateAccountingSetup(companyId, companyCreation.DefaultAccountingSetup);
            }

            if (companyCreation.MainAccountingFieldSetup != null && companyCreation.MainAccountingFieldSetup.Count() > 0)
            {
                await _companyCreationRepository.CreateMainAccountingFieldSetupAsync(companyId, companyCreation.MainAccountingFieldSetup);
            }

            int tradeSetUpId = await _companyCreationRepository.CreateTradeSetUp(companyId, companyCreation.TradeConfiguration);

            if (companyCreation.AllocationSetUp != null)
            {
                await _companyCreationRepository.CreateAllocationSetUpAsync(companyId, companyCreation.AllocationSetUp, tradeSetUpId);
            }

            if (companyCreation.MandatoryTradeApprovalImageSetup != null)
            {
                await _companyCreationRepository.CreateTradeFieldSetupAsync(companyId, companyCreation.MandatoryTradeApprovalImageSetup);

                await _companyCreationRepository.CreateTradeImageFieldSetupAsync(companyId, companyCreation.MandatoryTradeApprovalImageSetup);

                await _companyCreationRepository.CreateTradeUnapprovedStatusFieldsSetup(companyId, companyCreation.MandatoryTradeApprovalImageSetup);
            }

            if (companyCreation.AccountingParameters != null && companyCreation.AccountingParameters.Any())
            {
                await _companyCreationRepository.CreateAccountingParameterSetUpAsync(companyId, companyCreation.AccountingParameters);
            }

            if (companyCreation.RetentionPolicy != null)
            {
                await _companyCreationRepository.CreateRetentionPolicyAsync(companyId, companyCreation.RetentionPolicy);
            }

            if (companyCreation.TradeParameters != null && companyCreation.TradeParameters.Any())
            {
                await _companyCreationRepository.CreateTradeParameterSetUpAsync(companyId, companyCreation.TradeParameters, tradeSetUpId);
            }

            await _companyCreationRepository.CreateGridConfiguration(companyId);

            return newCompanyId;
        }

        /// <summary>
        /// Creates a new company from another company
        /// </summary>
        /// <param name="request">The command object that contains all the properties to create a company from another company and related objects.</param>
        /// <param name="cancellationToken">Token to cancel the operation.</param>
        public async Task<Unit> Handle(CopyCompanyCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var companyCreation = _mapper.Map<CompanyCreation>(request);

                var companyId = companyCreation.CompanyConfiguration.CompanyId;

                companyCreation.IsTransactionDataSelected = false; // hard-coding for now, will change once DB changes are finalized

                if (companyCreation.CompanyConfiguration.CompanyId != null)
                {
                    int newCompanyId = await CreateCompanyConfiguration(companyId, companyCreation.CompanyConfiguration);

                    if (companyCreation.CompanyToCopy != null)
                    {
                        await _companyCreationRepository.CreateMasterDataforNewCompany(companyCreation.CompanyToCopy, companyCreation.IsCounterpartyRequired, newCompanyId);

                        await _companyCreationRepository.CreateUserProfile(newCompanyId, companyCreation);

                        if (companyCreation.IsTransactionDataSelected)
                        {
                            await _companyCreationRepository.CreateTransactionData(companyCreation.CompanyToCopy, newCompanyId);
                        }
                    }
                }

                _unitOfWork.Commit();

                _logger.LogInformation("Company created successfully.");

                return Unit.Value;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }
    }
}
