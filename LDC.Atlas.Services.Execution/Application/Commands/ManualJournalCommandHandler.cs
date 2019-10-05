using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.Services;
using LDC.Atlas.MasterData.Common;
using LDC.Atlas.MasterData.Common.Entities;
using LDC.Atlas.Services.Execution.Application.Queries;
using LDC.Atlas.Services.Execution.Application.Queries.Dto;
using LDC.Atlas.Services.Execution.Entities;
using LDC.Atlas.Services.Execution.Infrastructure.Policies;
using LDC.Atlas.Services.Execution.Repositories;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using System;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Application.Commands
{
    public class ManualJournalCommandHandler : IRequestHandler<CreateManualJournalDocumentCommand, ManualJournalResponse>
    {
        private readonly ILogger<ManualJournalCommandHandler> _logger;
        private readonly IIdentityService _identityService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IManualJournalRepository _manualJournalRepository;
        private readonly IManualJournalQueries _manualJournalQueries;
        private readonly IProcessMessageService _processMessageService;
        private readonly IAccountingSetUpQueries _accountingQueries;
        private readonly IAuthorizationService _authorizationService;
        private readonly IMasterDataService _masterDataService;

        public ManualJournalCommandHandler(
           ILogger<ManualJournalCommandHandler> logger,
           IIdentityService identityService,
           IUnitOfWork unitOfWork,
           IManualJournalRepository manualJournalRepository,
           IManualJournalQueries manualJournalQueries,
           IProcessMessageService processMessageService,
           IAccountingSetUpQueries accountingQueries,
           IAuthorizationService authorizationService,
           IMasterDataService masterDataService)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _manualJournalRepository = manualJournalRepository;
            _manualJournalQueries = manualJournalQueries;
            _processMessageService = processMessageService;
            _accountingQueries = accountingQueries;
            _authorizationService = authorizationService ?? throw new ArgumentNullException(nameof(authorizationService));
            _masterDataService = masterDataService ?? throw new ArgumentNullException(nameof(masterDataService));
        }
        
        public async Task<ManualJournalResponse> Handle(CreateManualJournalDocumentCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();
            AccountingSetupDto accountingSetup = null;
            Company company = null;
            try
            {
                string documentLabel = string.Empty;
                string year = string.Empty;
                int documentReferenceYear = 0;
                string documentReferenceYearValue = string.Empty;

                ManualJournalDocument manualJournalDocument = request.ManualJournal;
                company = await _masterDataService.GetCompanyByIdAsync(request.Company);
                CommonRules commonRules = new CommonRules(_accountingQueries,_authorizationService,_identityService);

                if (manualJournalDocument.AccountingPeriod.Year < manualJournalDocument.DocumentDate.Year
                    || (manualJournalDocument.AccountingPeriod.Year <= manualJournalDocument.DocumentDate.Year
                    && manualJournalDocument.AccountingPeriod.Month < manualJournalDocument.DocumentDate.Month))
                {
                    throw new AtlasBusinessException("A/c period should not be before doc. Date");
                }

                accountingSetup = await _accountingQueries.GetAccountingSetup(request.Company);

                if (accountingSetup != null)
                {
                    if (await CheckIfDocumentDateAccountingPeriodValid(manualJournalDocument, accountingSetup))
                    {
                        if (company.IsProvinceEnable)
                        {
                            foreach (var item in manualJournalDocument.ManualJournalLines)
                            {
                                item.ProvinceId = company.DefaultProvinceId;
                                item.BranchId = company.DefaultBranchId;
                            }
                        }
                        else
                        {
                            foreach (var item in manualJournalDocument.ManualJournalLines)
                            {
                                item.ProvinceId = item.BranchId = null;
                            }
                        }
                        if (manualJournalDocument.TransactionDocumentTypeId == (int)MasterDocumentType.TA
                            || manualJournalDocument.TransactionDocumentTypeId == (int)MasterDocumentType.JL)
                        {
                            documentLabel = Enum.GetName(typeof(MasterDocumentType), manualJournalDocument.TransactionDocumentTypeId);
                            year = manualJournalDocument.DocumentDate.Year.ToString(CultureInfo.InvariantCulture).Substring(2, 2);
                            documentReferenceYear = await commonRules.GetDocumentReferenceYear(manualJournalDocument.DocumentDate, request.Company);
                            documentReferenceYearValue = documentReferenceYear.ToString(System.Globalization.CultureInfo.InvariantCulture).Substring(2, 2);
                        }

                        if (manualJournalDocument.TransactionDocumentTypeId == (int)MasterDocumentType.JL)
                        {
                            manualJournalDocument.JLTypeId = (int)JLType.ManualRegularJournal;
                        }
                        else if (manualJournalDocument.TransactionDocumentTypeId == (int)MasterDocumentType.TA)
                        {
                            if (manualJournalDocument.TATypeId != null)
                            {
                                manualJournalDocument.TATypeId = (int)TAType.ManualMarkToMarket;
                            }
                            else
                            {
                                manualJournalDocument.TATypeId = (int)TAType.ManualTemporaryAdjustment;
                            }
                        }


                        int referencenumber = await _manualJournalQueries.GetManualDocumentReferenceValues(request.Company, (int)manualJournalDocument.TransactionDocumentTypeId, documentReferenceYear);

                        manualJournalDocument.YearNumber = referencenumber;

                        manualJournalDocument.Year = documentReferenceYear;

                        manualJournalDocument.DocumentReference = string.Concat(documentLabel, documentReferenceYearValue, string.Format(CultureInfo.InvariantCulture, "{0:D5}", referencenumber));

                        var objResponse = await _manualJournalRepository.CreateManualJournal(manualJournalDocument, request.Company);

                        var authorizationResult = await _authorizationService.AuthorizeAsync(_identityService.GetUser(), Policies.PostOpClosedPolicy);

                        var content = new JObject();
                        content.Add(new JProperty("docId", objResponse.TransactionDocumentId));
                        content.Add(new JProperty("postOpClosedPolicy", authorizationResult.Succeeded));

                        Atlas.Application.Core.Entities.ProcessMessage message = new Atlas.Application.Core.Entities.ProcessMessage​
                        {
                            ProcessTypeId = (long)Atlas.Application.Core.Entities.ProcessType.AtlasAccountingDocumentProcessor,
                            CompanyId = request.Company,
                            Content = content.ToString(),
                        };

                        await _processMessageService.SendMessage(message);

                        _unitOfWork.Commit();

                        return objResponse;
                    }
                    else
                    {
                        throw new AtlasSecurityException($"Please check the document date and accounting period");
                    }
                }
                else
                {
                    throw new AtlasSecurityException($"No Accounting Setup found");
                }
            }
            catch
            {
                _unitOfWork.Rollback();

                throw;
            }
        }

        private async Task<bool> CheckIfDocumentDateAccountingPeriodValid(ManualJournalDocument manualJournalDocument, AccountingSetupDto accountingSetup)
        {
            bool allChecksPassed = true;

            bool isPostOpClosedPrivilege = false;

            isPostOpClosedPrivilege = await CheckPrivileges();

            if (manualJournalDocument.TransactionDocumentTypeId == (int)MasterDocumentType.JL)
            {
                if (IsLastMonthForAccountingOpen(accountingSetup.LastMonthClosed, manualJournalDocument.AccountingPeriod, accountingSetup.NumberOfOpenPeriod, accountingSetup.LastMonthClosedForOperation))
                {
                    if (!isPostOpClosedPrivilege)
                    {
                        if (IsPeriodBeforeLastMonthForOperation(accountingSetup.LastMonthClosedForOperation, manualJournalDocument.AccountingPeriod))
                        {
                            allChecksPassed = false;
                        }
                    }
                }
                else
                {
                    allChecksPassed = false;
                }
            }
            else if (manualJournalDocument.TransactionDocumentTypeId == (int)MasterDocumentType.TA)
            {
                bool checkAccountingPeriod = IsLastMonthForAccountingOpen(accountingSetup.LastMonthClosed, manualJournalDocument.AccountingPeriod, accountingSetup.NumberOfOpenPeriod, accountingSetup.LastMonthClosedForOperation);
                bool checkDocumentDate = IsLastMonthForAccountingOpen(accountingSetup.LastMonthClosed, manualJournalDocument.DocumentDate, accountingSetup.NumberOfOpenPeriod, accountingSetup.LastMonthClosedForOperation);
                if (checkAccountingPeriod && checkDocumentDate)
                {
                    if (!isPostOpClosedPrivilege)
                    {
                        bool checkAccountingPeriodInlastMonthOperations = IsPeriodBeforeLastMonthForOperation(accountingSetup.LastMonthClosedForOperation, manualJournalDocument.AccountingPeriod);
                        bool checkDocumentDateInlastMonthOperations = IsPeriodBeforeLastMonthForOperation(accountingSetup.LastMonthClosedForOperation, manualJournalDocument.DocumentDate);
                        if (checkAccountingPeriodInlastMonthOperations || checkDocumentDateInlastMonthOperations)
                        {
                            allChecksPassed = false;
                        }
                    }
                }
                else
                {
                    allChecksPassed = false;
                }
            }

            return allChecksPassed;
        }

        private async Task<bool> CheckPrivileges()
        {
            var authorizationResult = await _authorizationService.AuthorizeAsync(_identityService.GetUser(), Policies.PostOpClosedPolicy);

            return authorizationResult.Succeeded;
        }

        private static bool IsPeriodBeforeLastMonthForOperation(DateTime lastMonthForOperation, DateTime documentDate)
        {
            if ((lastMonthForOperation.Year == documentDate.Year && lastMonthForOperation.Month >= documentDate.Month) || lastMonthForOperation.Year > documentDate.Year)
            {
                return true;
            }

            return false;
        }

        private static bool IsBeforeOperationLastClosedMonth(DateTime lastMonthForOperation, DateTime documentDate)
        {
            if ((lastMonthForOperation.Year == documentDate.Year && lastMonthForOperation.Month < documentDate.Month) || lastMonthForOperation.Year < documentDate.Year)
            {
                return true;
            }

            return false;
        }
        private static bool IsLastMonthForAccountingOpen(DateTime lastMonthForAccounting, DateTime documentDate, int numberOfOpenPeriod, DateTime lastMonthOperations)
        {
            if (IsBeforeOperationLastClosedMonth(lastMonthOperations, documentDate) && (lastMonthForAccounting.Year < documentDate.Year || (lastMonthForAccounting.Year == documentDate.Year && lastMonthForAccounting.Month < documentDate.Month)))
            {
                return true;
            }
            else
            {
                int[] openMonthsForAccounting = new int[numberOfOpenPeriod];
                for (int i = 1; i <= numberOfOpenPeriod; i++)
                {
                    openMonthsForAccounting[i - 1] = 0;

                    if (lastMonthForAccounting.Month + i > 12)
                    {
                        if (lastMonthForAccounting.Year + 1 == documentDate.Year)
                        {
                            openMonthsForAccounting[i - 1] = lastMonthForAccounting.Month + i - 12;
                        }
                    }
                    else
                    {
                        if (lastMonthForAccounting.Year == documentDate.Year)
                        {
                            openMonthsForAccounting[i - 1] = lastMonthForAccounting.Month + i;
                        }
                    }
                }

                if (openMonthsForAccounting.Contains(documentDate.Month))
                {
                    return true;
                }
            }

            return false;
        }
    }
}
