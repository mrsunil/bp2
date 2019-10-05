using AutoMapper;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
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
    public class CompanyConfigurationCommandHandler :
        IRequestHandler<UpdateCompanyConfigurationCommand>,
        IRequestHandler<DeleteCompanyCommand>, IRequestHandler<UpdateIsFrozenForCompanyCommand>
    {
        private readonly ILogger<CompanyConfigurationCommandHandler> _logger;
        private readonly IIdentityService _identityService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ICompanyConfigurationRepository _companyConfigurationRepository;
        private readonly ICompanyCreationRepository _companyCreationRepository;

        public CompanyConfigurationCommandHandler(
            ILogger<CompanyConfigurationCommandHandler> logger,
            IIdentityService identityService,
            IUnitOfWork unitOfWork,
              IMapper mapper,
            ICompanyConfigurationRepository companyConfigurationRepository,
            ICompanyCreationRepository companyCreationRepository)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _companyConfigurationRepository = companyConfigurationRepository ?? throw new ArgumentNullException(nameof(companyConfigurationRepository));
            _companyCreationRepository = companyCreationRepository ?? throw new ArgumentNullException(nameof(companyCreationRepository));
        }

        /// <summary>
        /// Handling the "update" event of a company configuration
        /// </summary>
        /// <param name="request">The command object that contains all the properties to update cash and related objects.</param>
        /// <param name="cancellationToken">Token to cancel the operation.</param>
        public async Task<Unit> Handle(UpdateCompanyConfigurationCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var companyConfiguration = _mapper.Map<CompanyConfiguration>(request);

                // TO DO
                //  var previllages = await CheckAccessRights();

                // For all the below repo call . access rights need to be checked n than allowed to call the update method
                // update companysetup
                if (companyConfiguration.CompanySetup != null)
                {
                    await _companyConfigurationRepository.UpdateCompanySetupAsync(companyConfiguration.CompanyId, companyConfiguration.CompanySetup);
                }

                // update invoicesetup
                if (companyConfiguration.InvoiceSetup != null)
                {
                    await _companyConfigurationRepository.UpdateInvoiceSetupAsync(companyConfiguration.CompanyId, companyConfiguration.InvoiceSetup);
                }

                // update interfacesetup
                if (companyConfiguration.InterfaceSetup != null && companyConfiguration.InterfaceSetup.Count() > 0)
                {
                    IEnumerable<InterfaceSetup> interfaceSetup = companyConfiguration.InterfaceSetup.Where(item => item.InterfaceTypeId != null).ToList();
                    if (interfaceSetup != null && interfaceSetup.Count() > 0)
                    {
                        IEnumerable<InterfaceSetup> interfaceSetupToUpdate = interfaceSetup.Where(item => item.InterfaceSetUpId != null).ToList();
                        IEnumerable<InterfaceSetup> interfaceSetupToCreate = interfaceSetup.Where(item => item.InterfaceSetUpId == null).ToList();

                        if (interfaceSetupToUpdate != null && interfaceSetupToUpdate.Count() > 0)
                        {
                            await _companyConfigurationRepository.UpdateInterfaceSetupAsync(companyConfiguration.CompanyId, interfaceSetupToUpdate);
                        }

                        if (interfaceSetupToCreate != null && interfaceSetupToCreate.Count() > 0)
                        {
                            await _companyCreationRepository.CreateInterfaceSetup(companyConfiguration.CompanyId, interfaceSetupToCreate);
                        }
                    }
                }

                // update allocationsetup
                if (companyConfiguration.AllocationSetUp != null)
                {
                    IEnumerable<AllocationSetUp> allocationSetUpToUpdate = companyConfiguration.AllocationSetUp.Where(item => item.AllocationFieldSetupId != null);
                    IEnumerable<AllocationSetUp> allocationSetUpToCreate = companyConfiguration.AllocationSetUp.Where(item => item.AllocationFieldSetupId == null);

                    if (allocationSetUpToCreate != null && allocationSetUpToCreate.Count() > 0)
                    {
                        await _companyCreationRepository.CreateAllocationSetUpAsync(companyConfiguration.CompanyId, allocationSetUpToCreate, companyConfiguration.TradeConfiguration.TradeSetupId);
                    }

                    if (allocationSetUpToUpdate != null && allocationSetUpToUpdate.Count() > 0)
                    {
                        await _companyConfigurationRepository.UpdateAllocationSetUpAsync(companyConfiguration.CompanyId, allocationSetUpToUpdate);
                    }
                }

                // update tradesetup
                if (companyConfiguration.TradeConfiguration != null)
                {
                    await _companyConfigurationRepository.UpdateTradeSetupAsync(companyConfiguration.CompanyId, companyConfiguration.TradeConfiguration);
                }

                // update intercoemailsetup
                if (companyConfiguration.InterCoNoInterCoEmailSetup != null)
                {
                    await _companyConfigurationRepository.AddUpdateIntercoEmailAsync(companyConfiguration.CompanyId, companyConfiguration.InterCoNoInterCoEmailSetup);
                }

                if (companyConfiguration.DefaultAccountingSetup != null)
                {
                    await _companyConfigurationRepository.UpdateAccountingSetup(companyConfiguration.CompanyId, companyConfiguration.DefaultAccountingSetup);
                }

                // update main accounting field setup
                if (companyConfiguration.MainAccountingFieldSetup != null && companyConfiguration.MainAccountingFieldSetup.Count() > 0)
                {
                    await _companyConfigurationRepository.UpdateMainAccountingFieldSetupAsync(companyConfiguration.CompanyId, companyConfiguration.MainAccountingFieldSetup);
                }

                // update mandatory trade approaval
                if (companyConfiguration.MandatoryTradeApprovalImageSetup != null)
                {
                    await _companyConfigurationRepository.UpdateTradeFieldSetupAsync(companyConfiguration.CompanyId, companyConfiguration.MandatoryTradeApprovalImageSetup);

                    await _companyConfigurationRepository.UpdateTradeImageFieldSetupAsync(companyConfiguration.CompanyId, companyConfiguration.MandatoryTradeApprovalImageSetup);

                    await _companyConfigurationRepository.UpdateTradeUnapprovedStatusFieldsSetup(companyConfiguration.CompanyId, companyConfiguration.MandatoryTradeApprovalImageSetup);
                }

                if (companyConfiguration.RetentionPolicy != null)
                {
                    await _companyConfigurationRepository.UpdateRetentionPolicyAsync(companyConfiguration.CompanyId, companyConfiguration.RetentionPolicy);
                }

                if (companyConfiguration.AccountingParameters != null && companyConfiguration.AccountingParameters.Any())
                {
                    IEnumerable<AccountingParameter> existingAccountDetails = companyConfiguration.AccountingParameters.Where(item => item.TransactionDocumentTypeCompanySetupId != null);
                    IEnumerable<AccountingParameter> newAccountDetails = companyConfiguration.AccountingParameters.Where(item => item.TransactionDocumentTypeCompanySetupId == null);

                    if (existingAccountDetails != null && existingAccountDetails.Count() > 0)
                    {
                        await _companyConfigurationRepository.UpdateAccountingParameterSetUpAsync(companyConfiguration.CompanyId, existingAccountDetails);
                    }

                    if (newAccountDetails != null && newAccountDetails.Count() > 0)
                    {
                        await _companyCreationRepository.CreateAccountingParameterSetUpAsync(companyConfiguration.CompanyId, newAccountDetails);
                    }

                }

                if (companyConfiguration.TradeParameters != null && companyConfiguration.TradeParameters.Any())
                {
                    await _companyConfigurationRepository.UpdateTradeParameterSetUpAsync(companyConfiguration.CompanyId, companyConfiguration.TradeParameters);
                }

                _unitOfWork.Commit();

                _logger.LogInformation("Company with id {Atlas_CompanyId} updated.", request.CompanyId);

                return Unit.Value;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        /// <param name="request">The command object that contains all the properties to update cash and related objects.</param>
        /// <param name="cancellationToken">Token to cancel the operation.</param>
        public async Task<Unit> Handle(DeleteCompanyCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var company = request.CompanyId;

                if (company != null)
                {
                    await _companyConfigurationRepository.DeleteCompanyAsync(company);

                }

                _unitOfWork.Commit();

                _logger.LogInformation("Company with id {Atlas_CompanyId} deleted.", request.CompanyId);

                return Unit.Value;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }
        /// <param name="request">The command object that contains all the properties to freeze or unfreeze company related objects.</param>
        /// <param name="cancellationToken">Token to cancel the operation.</param>
        public async Task<Unit> Handle(UpdateIsFrozenForCompanyCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var company = request.CompanyId;
                var isFrozen = request.IsFrozen;

                if (company != null)
                {
                    await _companyConfigurationRepository.UpdateIsFrozenForCompanyAsync(company,isFrozen);

                }

                _unitOfWork.Commit();

                _logger.LogInformation("Company with id {Atlas_CompanyId} freezed.", request.CompanyId);

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