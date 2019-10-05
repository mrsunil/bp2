using AutoMapper;
using LDC.Atlas.Application.Core.Entities;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.Services;
using LDC.Atlas.MasterData.Common;
using LDC.Atlas.Services.PreAccounting.Application.Queries;
using LDC.Atlas.Services.PreAccounting.Application.Queries.Dto;
using LDC.Atlas.Services.PreAccounting.Entities;
using LDC.Atlas.Services.PreAccounting.Repositories;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Application.Commands
{
    public partial class ProcessHeldAndMappingErrorDocumentCommandHandler : IRequestHandler<ProcessHeldAndMappingErrorDocumentCommand, Unit>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IIdentityService _identityService;
        private readonly ILogger _logger;
        private readonly IMapper _mapper;
        private readonly IAuthorizationService _authorizationService;
        private readonly IAccountingDocumentQueries _accountingQueries;
        private readonly IAccountingDocumentRepository _accountingDocumentRepository;
        private readonly ISystemDateTimeService _systemDateTimeService;
        private readonly IProcessMessageService _processMessageService;
        private readonly IForeignExchangeRateService _foreignExchangeRateService;

        public ProcessHeldAndMappingErrorDocumentCommandHandler(
          ILogger<ProcessHeldAndMappingErrorDocumentCommandHandler> logger,
          IUnitOfWork unitOfWork,
          IIdentityService identityService,
          IMapper mapper,
          IAuthorizationService authorizationService,
          IAccountingDocumentQueries accountingQueries,
          ISystemDateTimeService systemDateTimeService,
          IProcessMessageService processMessageService,
          IAccountingDocumentRepository accountingDocumentRepository,
          IForeignExchangeRateService foreignExchangeRateService)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
            _mapper = mapper;
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _authorizationService = authorizationService ?? throw new ArgumentNullException(nameof(authorizationService));
            _systemDateTimeService = systemDateTimeService ?? throw new ArgumentNullException(nameof(systemDateTimeService));
            _processMessageService = processMessageService ?? throw new ArgumentNullException(nameof(processMessageService));
            _accountingQueries = accountingQueries;
            _accountingDocumentRepository = accountingDocumentRepository;
            _foreignExchangeRateService = foreignExchangeRateService;
        }

        public async Task<Unit> Handle(ProcessHeldAndMappingErrorDocumentCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var companyDate = await _systemDateTimeService.GetCompanyDate(request.Company);

                IEnumerable<AccountingDocument> accountingDocuments = await _accountingQueries.GetAccountingDocumentInHeldAndMappingErrorState(request.Company);

                foreach (AccountingDocument accountingDocument in accountingDocuments)
                {
                    await CommonRules.CalculateFunctionalAndStatutoryCurrencyAccountingLine(_foreignExchangeRateService, accountingDocument);

                    AccountingSetupDto accountingSetup = await _accountingQueries.GetAccountingSetup((int)accountingDocument.TransactionDocumentTypeId, request.Company);
                    
                    accountingDocument.StatusId = await ReturnAccountingDocumentStatus(accountingDocument, companyDate, request.Company, accountingSetup);

                    await _accountingDocumentRepository.UpdateAccountingDocument(accountingDocument, request.Company);

                    if (accountingDocument.StatusId == PostingStatus.Authorised)
                    {
                        bool postOpClosedPolicy = await CommonRules.CheckPrivileges(_authorizationService, _identityService);

                        await EnqueuePostingProcessorMessage(accountingDocument.AccountingId, request.Company, postOpClosedPolicy);
                    }
                }

                _unitOfWork.Commit();
            }
            catch
            {
                _unitOfWork.Rollback();

                throw;
            }

            return Unit.Value;
        }

        private async Task<PostingStatus> ReturnAccountingDocumentStatus(AccountingDocument accountingDocument, DateTime companyDate, string company, AccountingSetupDto accountingSetup)
        {
            accountingDocument.ErrorMessage = string.Empty;

            // Sanity Check
            bool isLegSumValid = CommonRules.CheckSanityCheck(accountingDocument);
            MappingErrorMessages messages;

            if (isLegSumValid)
            {
                if (CommonRules.CheckFxRateConverted(accountingDocument))
                {
                    bool ifInterface = await CommonRules.CheckIfInterface(_accountingQueries, accountingDocument.TransactionDocumentId, company);

                    messages = await CommonRules.CheckMappingError(_accountingQueries, accountingDocument.AccountingDocumentLines, company, accountingDocument.TransactionDocumentTypeId);

                    if (ifInterface)
                    {
                        if (messages.C2CCode == null)
                        {
                            accountingDocument.ErrorMessage = "C2C Code Is NULL ;";
                        }

                        if (!messages.CostAlternativeCode)
                        {
                            accountingDocument.ErrorMessage += "Cost Alternative Code  Is NULL ;";
                        }

                        if (!messages.TaxInterfaceCode)
                        {
                            accountingDocument.ErrorMessage += "Tax Interface Code Is NULL ;";
                        }

                        if (messages.DepartmentAlternativeCode == null)
                        {
                            accountingDocument.ErrorMessage += "Department Alternative Code Is NULL ;";
                        }

                        if (!messages.NominalAlternativeAccount)
                        {
                            accountingDocument.ErrorMessage += "Nominal Alternative Code Is NULL ;";
                        }

                        if (!string.IsNullOrEmpty(accountingDocument.ErrorMessage))
                        {
                            return PostingStatus.MappingError;
                        }
                    }

                    if (CommonRules.MandatoryFieldValidation(accountingDocument))
                    {
                        accountingDocument.ErrorMessage = "Mandatory Field Missing";

                        return PostingStatus.Held;
                    }

                    if (accountingDocument.DocumentDate.Date > companyDate.Date)
                    {
                        accountingDocument.ErrorMessage = "Future document date";
                        return PostingStatus.Held;
                    }

                    if (!CommonRules.IsLastMonthForAccountingOpen(accountingSetup.LastMonthClosed, accountingDocument.AccountingDate, accountingSetup.NumberOfOpenPeriod))
                    {
                        accountingDocument.ErrorMessage = "Month is not yet open for accounting period";
                        return PostingStatus.Held;
                    }

                    return PostingStatus.Authorised;
                }
                else
                {
                    accountingDocument.ErrorMessage = "No Fxrates Found";
                    return PostingStatus.Held;
                }
            }
            else
            {
                accountingDocument.ErrorMessage = "Unbalanced document";
                return PostingStatus.Held;
            }
        }

        private async Task EnqueuePostingProcessorMessage(long docId, string company, bool postOpClosedPolicy)
        {
            var content = new JObject();
            content.Add(new JProperty("docId", docId));
            content.Add(new JProperty("postOpClosedPolicy", postOpClosedPolicy));

            await _processMessageService.SendMessage(new ProcessMessage
            {
                ProcessTypeId = (long)ProcessType.AtlasPostingProcessor,
                CompanyId = company,
                Content = content.ToString()
            });
        }
    }
}