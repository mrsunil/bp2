using AutoMapper;
using LDC.Atlas.Application.Core.Entities;
using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.Services;
using LDC.Atlas.MasterData.Common;
using LDC.Atlas.MasterData.Common.Entities;
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
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Application.Commands
{
    public partial class CreateAccountingDocumentCommandHandler : IRequestHandler<CreateAccountingDocumentCommand, IEnumerable<long>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IIdentityService _identityService;
        private readonly ILogger _logger;
        private readonly IMapper _mapper;
        private readonly IAuthorizationService _authorizationService;
        private readonly IAccountingDocumentQueries _accountingQueries;
        private readonly IMasterDataService _masterDataService;
        private readonly IAccountingDocumentRepository _accountingDocumentRepository;
        private readonly IInvoicingRepository _invoicingRepository;
        private readonly ISystemDateTimeService _systemDateTimeService;
        private readonly IProcessMessageService _processMessageService;
        private readonly IForeignExchangeRateService _foreignExchangeRateService;

        public CreateAccountingDocumentCommandHandler(
          ILogger<CreateAccountingDocumentCommandHandler> logger,
          IUnitOfWork unitOfWork,
          IIdentityService identityService,
          IMapper mapper,
          IAuthorizationService authorizationService,
          IAccountingDocumentQueries accountingQueries,
          IMasterDataService masterDataService,
          ISystemDateTimeService systemDateTimeService,
          IProcessMessageService processMessageService,
          IAccountingDocumentRepository accountingDocumentRepository,
          IInvoicingRepository documentMatchingRepository,
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
            _masterDataService = masterDataService;
            _accountingDocumentRepository = accountingDocumentRepository;
            _invoicingRepository = documentMatchingRepository;
            _foreignExchangeRateService = foreignExchangeRateService;
        }

        /// <summary>
        /// Handling the creation of an accounting document
        /// </summary>
        /// <param name="request"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public async Task<IEnumerable<long>> Handle(CreateAccountingDocumentCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();
            IEnumerable<AccountingDocumentCreationStatus> accountingDocumentCreationStatusList = null;
            long accountingId = -1;
            IEnumerable<long> createdAccountingDocumentIds = null;

            Company company = null;
            try
            {
                TransactionDocumentDto transactionDocument = await _accountingQueries.GetTransactionDocumentTypeByDocId(request.DocId, request.Company);

                if (transactionDocument == null)
                {
                    throw new NotFoundException("TransactionDocument", request.DocId);
                }

                if (transactionDocument.TransactionDocumentTypeId == (int)DocumentType.CP ||
                    transactionDocument.TransactionDocumentTypeId == (int)DocumentType.CI)
                {
                    // Note: the "CreateAccounting" background process is called also for cash status updates, after a
                    // 'response' received from the TRAX system. In this context, the caller just sends a "creaete accounting doc" message
                    // Below, we are checking the existance of the acc doc for the cash (through the SP update).

                    // Updates the document date and the value date of the given cash
                    accountingId = await _accountingDocumentRepository.UpdateAccountingDocumentForTraxResponse(request.DocId, request.Company);

                    // If the doc accounting doc of the cash exists, then accountingId is >0...
                }

                if (accountingId > 0)
                {
                    // ... and in this case, we just queue the cash for posting. As a reminder, the TRAX-ed cash cannot have the “Authorized for posting” flag
                    // set by the user (the UI prevents it)
                    List<long> listOfDocId = new List<long>();
                    listOfDocId.Add(accountingId);
                    await AuthorizeForPosting(listOfDocId, request.Company, request.PostOpClosedPolicy);

                    _unitOfWork.Commit();
                }
                else
                {
                    List<AccountingDocument> accountingDocuments = new List<AccountingDocument>();
                    int docTypeId = transactionDocument.TransactionDocumentTypeId;
                    AccountingSetupDto accountingSetup = await _accountingQueries.GetAccountingSetup(docTypeId, request.Company);

                    var transactionIdOfReversedDoc = await _accountingQueries.GetTransactionDocumentIdByReversalId(request.DocId, request.Company);

                    if (transactionIdOfReversedDoc != null)
                    {
                       // We are in the situation of a reversal
                       var accountingCreationStatusList = await _accountingDocumentRepository.CreateAccountingDocumentForReversal(
                            request.DocId,                      // TransDocId of the Reversal
                            transactionIdOfReversedDoc.Value,   // TransDocId of the Reversed (original)
                            request.Company,
                            request.PostOpClosedPolicy);
                       await EnqueueBulkPostingProcessorMessage(
                            accountingCreationStatusList,
                           request.Company,
                            request.PostOpClosedPolicy);
                    }
                    else
                    {
                        // The document is a standard non-reversed document for which to generate the accounting document
                        company = await _masterDataService.GetCompanyByIdAsync(request.Company);
                        long transactionDocumentId = request.DocId;
                        var companyDate = await _systemDateTimeService.GetCompanyDate(request.Company);
                        switch (docTypeId)
                        {
                            case (int)DocumentType.PI:
                            case (int)DocumentType.SI:
                            case (int)DocumentType.CN:
                            case (int)DocumentType.DN:
                                accountingDocuments.Add(await GetInformationForInvoice(request.PostOpClosedPolicy, transactionDocumentId, docTypeId, accountingSetup, company, request.Company, companyDate));
                                break;
                            case (int)DocumentType.CP:
                            case (int)DocumentType.CI:
                                accountingDocuments.AddRange(await GetInformationForCash(request.PostOpClosedPolicy, transactionDocumentId, docTypeId, accountingSetup, company, companyDate));
                                /*CashForCounterpartyDto cashForCounterpartyDto = null;
                                cashForCounterpartyDto = await _accountingQueries.GetCashTypeIdForCounterParty(transactionDocumentId);
                                if (cashForCounterpartyDto != null && cashForCounterpartyDto.CashTypeId == (int)CashSelectionType.PaymentDifferentClient && cashForCounterpartyDto.JLTypeId == (int)JLType.CounterPartyTransfer)
                                {
                                    accountingDocuments.Add(await GetInformationForCounterParty(request.PostOpClosedPolicy, cashForCounterpartyDto.TransactionDocumentId, docTypeId, accountingSetup, company, companyDate, cashForCounterpartyDto));
                                }*/

                                break;
                            case (int)DocumentType.MJL:
                            case (int)DocumentType.MTA:
                                TransactionDocumentDto transactionDocumentDto = null;
                                transactionDocumentDto = await _accountingQueries.GetJLDocumentTypeByTransactionDocumentId(transactionDocumentId, company.CompanyId);
                                if (transactionDocumentDto != null && transactionDocumentDto.JLTypeId == 2) // JLType = 2 = Reval
                                {
                                    var revalInformation = await _accountingQueries.GetRevalInformationForAccountingDocument(
                                        transactionDocumentId, company.CompanyId);
                                    var revalAccountingDocument = await GetInformationForRevaluation(
                                        request.PostOpClosedPolicy, 
                                        transactionDocumentId,
                                        docTypeId, 
                                        accountingSetup, 
                                        company, 
                                        companyDate,
                                        revalInformation);
                                    if (revalAccountingDocument != null
                                        && revalAccountingDocument.AccountingDocumentLines != null
                                        && revalAccountingDocument.AccountingDocumentLines.Count() > 0)
                                    {
                                        // We create the accounting document for reval only if it contains non-0 records
                                        accountingDocuments.Add(revalAccountingDocument);
                                        // Stores a new document matching in the database, to link the revaluation record to it, so that
                                        // it appears as linked in the "delete match" screen
                                        await _invoicingRepository.CreateDocumentMatchingAsync(new DocumentMatching
                                        {
                                            CompanyId = company.CompanyId,
                                            MatchFlagId = revalInformation.MatchFlagId,
                                            TransactionDocumentId = transactionDocumentId,
                                            ValueDate = revalInformation.PaymentDocumentDate,
                                            DepartmentId = revalInformation.DepartmentId
                                        });

                                    }
                                    else
                                    {
                                        // We delete the Revaluation Transaction document if no accounting
                                        // document has to be associated to it
                                        await _invoicingRepository.DeleteManualJLOrRevaluationAsync(
                                            transactionDocumentId, request.Company);
                                    }
                                }
                                else
                                {
                                    (AccountingDocument adTAJL, MonthEndTADocumentDto MonthEnd) = await CreateAccountingForTAandJL(request.PostOpClosedPolicy, transactionDocument, transactionDocumentId, docTypeId, accountingSetup, company, companyDate);
                                    if (docTypeId == (int)DocumentType.MTA)
                                    {
                                        var accountingDocumentPerAccuralNumberTA = await CreateAccountingDocumentPerAccuralNumberTA(adTAJL, MonthEnd, request.Company, transactionDocumentId);
                                        accountingDocuments.AddRange(accountingDocumentPerAccuralNumberTA);
                                    }
                                    else
                                    {
                                        accountingDocuments.Add(adTAJL);
                                    }
                                }

                                break;
                            case (int)DocumentType.FJ:
                                accountingDocuments.Add(await CreateAccountingDocumentForFxDeal(request.PostOpClosedPolicy, transactionDocumentId, docTypeId, accountingSetup, company, request.Company, companyDate));
                                break;
                        }

                        var createdAccountingDocuments = await CreateAccountingDocumentsAndEnqueueForPosting(request.Company, accountingDocuments, request.PostOpClosedPolicy);
                        createdAccountingDocumentIds = createdAccountingDocuments.Select(a => a.AccountingId);
                    }

                    _unitOfWork.Commit();
                }

                if (transactionDocument.TransactionDocumentTypeId == (int)DocumentType.FJ && accountingDocumentCreationStatusList != null)
                {
                    long createdAccountingId = accountingDocumentCreationStatusList.ToList().FirstOrDefault().AccountingId;

                    await UpdateFxDealInformation(company.Id, request.DocId, createdAccountingId, request.Company);
                }

                _logger.LogInformation("Doc with id {Atlas_DocId}.", request.DocId);
            }
            catch (Exception ex)
            {
                _logger.LogError("Exception on Creating Accouting Document for {Atlas_DocId}.", request.DocId, ex);
                _unitOfWork.Rollback();

                throw;
            }

            return createdAccountingDocumentIds;
        }

        public async Task<IEnumerable<AccountingDocumentCreationStatus>> CreateAccountingDocumentsAndEnqueueForPosting(string company, List<AccountingDocument> accountingDocuments, bool postOpClosedPolicy)
        {
            // Saves the accounting document into the database and push them in the "posting" process
            // NOTE : this is true whichever we are working on a standard document or a reversal document
            var accountingCreationStatusList = await _accountingDocumentRepository.CreateAccountingDocument(
                company,
                accountingDocuments);
            var idsOfAccountingDocumentsAuthorizedForPosting = accountingCreationStatusList.
                Where(document => document.PostingStatusId == PostingStatus.Authorised).
                Select(x => x.AccountingId);
            await EnqueueBulkPostingProcessorMessage(
                idsOfAccountingDocumentsAuthorizedForPosting,
                company,
                postOpClosedPolicy);
            return accountingCreationStatusList;
        }

        public async Task AuthorizeForPosting(List<long> listOfDocId, string company, bool postOpClosedPolicy)
        {
            List<AccountingDocument> accountDocumentsDto = (await _accountingDocumentRepository.GetAccountingDocumentsByAccountingIdsAsync(listOfDocId, company)).ToList();

            var companyDate = await _systemDateTimeService.GetCompanyDate(company);

            foreach (AccountingDocument accountingDocumentDto in accountDocumentsDto)
            {
                await CommonRules.CalculateFunctionalAndStatutoryCurrencyAccountingLine(_foreignExchangeRateService, accountingDocumentDto);

                AccountingSetupDto accountingSetup = await _accountingQueries.GetAccountingSetup((int)accountingDocumentDto.TransactionDocumentTypeId, company);

                accountingDocumentDto.StatusId = await CommonRules.ReturnAccountingDocumentStatus(_accountingQueries, accountingDocumentDto, companyDate, company, accountingSetup);

                await _accountingDocumentRepository.UpdateAccountingDocumentStatutoryAndFunctionalCurrencyAmounts(company, accountingDocumentDto);
            }

            var listOfAuthorizedDocument = accountDocumentsDto.Where(x => x.StatusId == PostingStatus.Authorised).ToList();

            if (listOfAuthorizedDocument.Count > 0)
            {
                foreach (AccountingDocument accountingDocument in listOfAuthorizedDocument)
                {
                    await EnqueuePostingProcessorMessage(accountingDocument.AccountingId, company, postOpClosedPolicy);
                }
            }
        }


        private async Task<AccountingDocument> GetInformationForRevaluation(
            bool postOpClosedPrivilege, 
            long transactionDocumentId, 
            int docTypeId, 
            AccountingSetupDto accountingSetup, 
            Company company, 
            DateTime companyDate,
            RevaluationInformationDto revalInformation)
        {
            AccountingDocument accountingDocument = null;

            if (accountingSetup != null)
            {
                // Creating the accounting header
                accountingDocument = new AccountingDocument()
                {
                    UserCreator = _identityService.GetUserAtlasId(),
                    TransactionDocumentId = transactionDocumentId,
                    ProvinceId = null,
                    OriginalReferenceId = null,
                    Roe = 1,
                    RoeType = "D",
                    TransactionDocumentTypeId = docTypeId,
                    AcknowledgementDate = null,
                    CurrencyCode = revalInformation.CurrencyCode,
                    DocumentDate = revalInformation.PaymentDocumentDate,
                    ValueDate = revalInformation.PaymentDocumentDate,
                    GLDate = revalInformation.PaymentDocumentDate,
                    AccountingPeriod = CommonRules.CalculateAccountPeriod(accountingSetup, revalInformation.PaymentDocumentDate, postOpClosedPrivilege),
                    AccountingDate = CommonRules.CalculateAccountPeriod(accountingSetup, revalInformation.PaymentDocumentDate, postOpClosedPrivilege),
                    OriginalValueDate = revalInformation.PaymentDocumentDate
                };

                var documentReference = revalInformation.ExistingDocumentMatchingInfo.FirstOrDefault(b => b.TransactionDocumentId == transactionDocumentId).DocumentReference;

                // Creation of a copy of the document matching in which we will:
                // - update the roe of the values in all ccies
                // - sign the value in a "Accounting lines" oriented way
                List<InputInfoLinesForRevaluation> inputInfoLinesForRevaluationList = new List<InputInfoLinesForRevaluation>();
                foreach (var item in revalInformation.DocumentMatchingForMatchedDocuments)
                {
                    int inversionFactor = 1;
                    switch ((TransactionDocumentType)item.TransactionDocumentTypeId)
                    {
                        case TransactionDocumentType.CashReceipt:
                        case TransactionDocumentType.PurchaseInvoice:
                        case TransactionDocumentType.CreditNote:
                            inversionFactor = -1;
                            break;
                        case TransactionDocumentType.CashPay:
                        case TransactionDocumentType.SalesInvoice:
                        case TransactionDocumentType.DebitNote:
                        case TransactionDocumentType.ManualRegularJournal:
                            inversionFactor = 1;
                            break;
                    }

                    var inputInfoLinesForRevaluation = new InputInfoLinesForRevaluation()
                    {
                        DepartmentId = item.DepartmentId,
                        AccountingLineTypeId = item.AccountingLineTypeId,
                        Amount = item.Amount * inversionFactor,
                        FunctionalCcyAmount = item.FunctionalCcyAmount * inversionFactor,
                        StatutoryCcyAmount = item.StatutoryCcyAmount * inversionFactor,
                    };

                    // Rounding the converted values to 2 digits (only if currencies are not the same)
                    if (revalInformation.MatchingCurrency != company.FunctionalCurrencyCode)
                    {
                        inputInfoLinesForRevaluation.FunctionalCcyAmount = Math.Round(inputInfoLinesForRevaluation.FunctionalCcyAmount.Value, 2, MidpointRounding.AwayFromZero); // the default rounding option for .NET is MidPointRounding.ToEven, but that this option does not produce the desired result for some of values: -1119.965 was getting rounded to -1119.96 instead of -1119.97
                    }

                    if (revalInformation.MatchingCurrency != company.StatutoryCurrencyCode)
                    {
                        inputInfoLinesForRevaluation.StatutoryCcyAmount = Math.Round(inputInfoLinesForRevaluation.StatutoryCcyAmount.Value, 2, MidpointRounding.AwayFromZero); // the default rounding option for .NET is MidPointRounding.ToEven, but that this option does not produce the desired result for some of values: -1119.965 was getting rounded to -1119.96 instead of -1119.97
                    }

                    inputInfoLinesForRevaluationList.Add(inputInfoLinesForRevaluation);
                }

                // Summing by department and accountinglinetype
                var revaluationJournalClientListOne = inputInfoLinesForRevaluationList.GroupBy(d => new { d.DepartmentId, d.AccountingLineTypeId })
                    .Select(g => new
                    {
                        g.Key.DepartmentId,
                        g.Key.AccountingLineTypeId,
                        Amount = g.Sum(s => s.Amount),
                        FunctionalCcyAmount = g.Sum(s => s.FunctionalCcyAmount),
                        StatutoryCcyAmount = g.Sum(s => s.StatutoryCcyAmount),

                    }).ToList();

                // Creation of the lines
                List<AccountingDocumentLine> accountingDocumentLines = new List<AccountingDocumentLine>();
                int postingLineId = 1;
                foreach (var item in revaluationJournalClientListOne)
                {
                    if (item.FunctionalCcyAmount.Value == 0
                        && item.StatutoryCcyAmount.Value == 0)
                    {
                        // We dont create reval lines if there is no difference in the values
                        continue;
                    }

                    AccountingDocumentLine accountingDocLine = new AccountingDocumentLine();
                    accountingDocLine.AssociatedAccountId = revalInformation.CounterpartyId;
                    accountingDocLine.CostTypeCode = revalInformation.CostTypeCode;
                    accountingDocLine.CostTypeId = revalInformation.CostTypeId;
                    accountingDocLine.PaymentTermId = null;
                    accountingDocLine.PaymentTermCode = null;
                    accountingDocLine.DepartmentId = item.DepartmentId;
                    accountingDocLine.AccountReferenceId = null;
                    accountingDocLine.ClientAccountId = revalInformation.CounterpartyId;
                    accountingDocLine.AccountReference = accountingSetup.NominalCostTypeInfo.Where(x => x.CostTypeCode == revalInformation.CostTypeCode).FirstOrDefault().NominalAccountCode;
                    accountingDocLine.PostingLineId = postingLineId;
                    accountingDocLine.AccountingCategoryId = (int)AccountingCategory.C;
                    accountingDocLine.AccountLineTypeId = item.AccountingLineTypeId;
                    accountingDocLine.AccountReference = item.AccountingLineTypeId == (int)AccountLineType.V ? accountingSetup.PurchaseLedgerControlClientCreditors : accountingSetup.SalesLedgerControlClientDebtors;
                    accountingDocLine.ClientReference = null;
                    accountingDocLine.Narrative = "Revaluation For Match";
                    accountingDocLine.Amount = (-1) * item.Amount;
                    accountingDocLine.FunctionalCurrency = (-1) * item.FunctionalCcyAmount;
                    accountingDocLine.StatutoryCurrency = (-1) * item.StatutoryCcyAmount;

                    //Diff Client
                    if (revalInformation.DifferentClientMatchFlagId != null)
                    {
                        var secRef = revalInformation.DocumentMatchingForMatchedDocuments.FirstOrDefault(i => i.DocumentType == DocumentType.MJL)?.DocumentReference;
                        accountingDocLine.SecondaryDocumentReference = secRef ?? revalInformation.CashByPickingReference;
                    }
                    else
                    {
                        accountingDocLine.SecondaryDocumentReference = revalInformation.CashByPickingReference;
                    }

                    postingLineId++;
                    accountingDocumentLines.Add(accountingDocLine);
                }

                var accLinesOfTypeClient = revaluationJournalClientListOne.GroupBy(d => d.DepartmentId)
                    .Select(g => new
                    {
                        DepartmentId = g.Key,
                        Amount = (-1) * g.Sum(s => s.Amount),
                        FunctionalCcyAmount = (-1) * g.Sum(s => s.FunctionalCcyAmount),
                        StatutoryCcyAmount = (-1) * g.Sum(s => s.StatutoryCcyAmount),
                    }).ToList();

                foreach (var accLineOfTypeClient in accLinesOfTypeClient)
                {
                    if (accLineOfTypeClient.FunctionalCcyAmount.Value == 0
                        && accLineOfTypeClient.StatutoryCcyAmount.Value == 0)
                    {
                        // We dont create reval lines if there is no difference in the values
                        continue;
                    }

                    AccountingDocumentLine accountingDocumentLineFormanualDocumentMatching = new AccountingDocumentLine();
                    accountingDocumentLineFormanualDocumentMatching.CostTypeCode = revalInformation.CostTypeCode;
                    accountingDocumentLineFormanualDocumentMatching.CostTypeId = revalInformation.CostTypeId;
                    accountingDocumentLineFormanualDocumentMatching.PaymentTermId = null;
                    accountingDocumentLineFormanualDocumentMatching.PaymentTermCode = null;
                    accountingDocumentLineFormanualDocumentMatching.DepartmentId = accLineOfTypeClient.DepartmentId;
                    accountingDocumentLineFormanualDocumentMatching.PostingLineId = postingLineId;
                    accountingDocumentLineFormanualDocumentMatching.AccountingCategoryId = (int)AccountingCategory.N;
                    accountingDocumentLineFormanualDocumentMatching.AssociatedAccountId = revalInformation.CounterpartyId;
                    accountingDocumentLineFormanualDocumentMatching.AccountLineTypeId = (int)AccountLineType.L;
                    accountingDocumentLineFormanualDocumentMatching.ClientReference = null;
                    accountingDocumentLineFormanualDocumentMatching.Narrative = "Revaluation For Match";
                    accountingDocumentLineFormanualDocumentMatching.Amount = 0;
                    accountingDocumentLineFormanualDocumentMatching.FunctionalCurrency = -accLineOfTypeClient.FunctionalCcyAmount;
                    accountingDocumentLineFormanualDocumentMatching.StatutoryCurrency = -accLineOfTypeClient.StatutoryCcyAmount;

                    //Diff Client
                    if (revalInformation.DifferentClientMatchFlagId != null)
                    {
                        var secRef = revalInformation.DocumentMatchingForMatchedDocuments.FirstOrDefault(i => i.DocumentType == DocumentType.MJL)?.DocumentReference;
                        accountingDocumentLineFormanualDocumentMatching.SecondaryDocumentReference = secRef ?? revalInformation.CashByPickingReference;
                    }
                    else
                    {
                        accountingDocumentLineFormanualDocumentMatching.SecondaryDocumentReference = revalInformation.CashByPickingReference;
                    }

                    accountingDocumentLineFormanualDocumentMatching.AccountReference = revalInformation.AccountNumber;
                    accountingDocumentLineFormanualDocumentMatching.ClientReference = null;
                    accountingDocumentLineFormanualDocumentMatching.AssociatedAccountCode = revalInformation.CounterpartyCode;

                    postingLineId++;
                    accountingDocumentLines.Add(accountingDocumentLineFormanualDocumentMatching);
                }

                accountingDocument.AccountingDocumentLines = accountingDocumentLines;
                accountingDocument.StatusId = PostingStatus.Authorised;
            }

            return accountingDocument;
        }

        private async Task<IEnumerable<AccountingDocumentLine>> CreateAccountingDocumentLines(
           int docTypeId, Company company, AccountingSetupDto accountingSetup, FxRateInformation fxRates,
           IEnumerable<Vat> vats = null, InvoiceInformationDto invoiceInformation = null,
           IEnumerable<SectionsInformationDto> sectionsInformation = null, CashInformationDto cashInformation = null,
           ManualJournalDocumentDto manualJournal = null, RevaluationInformationDto revalInformation = null,
           MonthEndTADocumentDto monthEndTADocument = null,
           FxSettlementDocumentDto fxSettlementDocument = null)
        {
            List<AccountingDocumentLine> accountingDocumentLines = new List<AccountingDocumentLine>();

            AccountingDocumentLine accountingDocumentLine;

            int postingLineId = 1;

            switch (docTypeId)
            {
                case (int)DocumentType.PI:
                case (int)DocumentType.SI:
                case (int)DocumentType.CN:
                case (int)DocumentType.DN:

                    // Nominal
                    InvoiceFunction invoiceFunction = CommonRules.CheckInvoiceType(invoiceInformation.InvoiceType);
                    for (int index = 0; index < invoiceInformation.InvoiceLines.Count(); index++)
                    {
                        if (invoiceFunction == InvoiceFunction.Washout)
                        {
                            if (invoiceInformation.InvoiceLines.ToList()[index].Type == (int)Entities.ContractType.CommercialSale)
                            {
                                // [WASHOUT_E6] For washout E6, we expect to have only one 1 to 1 washout (ie we must have only one line for a purchase
                                // contract, and one line for a sales contract)
                                // This rule is also implemented in UpdateAccountingDocumentStatusToPostedCommandHandler.CalculateAmountUpdatesForWashoutInvoice
                                accountingDocumentLine = await CreateAccountingDocumentLineForInvoice(AccountingDocumentLineType.Nominal, invoiceInformation, sectionsInformation, vats, company, accountingSetup, fxRates, postingLineId, index, null);
                                accountingDocumentLines.Add(accountingDocumentLine);
                                postingLineId++;
                            }
                        }
                        else if (invoiceFunction == InvoiceFunction.Cancelled)
                        {
                                accountingDocumentLine = await CreateAccountingDocumentLineForInvoice(AccountingDocumentLineType.Nominal, invoiceInformation, sectionsInformation, vats, company, accountingSetup, fxRates, postingLineId, index, null);
                                accountingDocumentLines.Add(accountingDocumentLine);
                                postingLineId++;
                        }
                        else
                        {
                            accountingDocumentLine = await CreateAccountingDocumentLineForInvoice(AccountingDocumentLineType.Nominal, invoiceInformation, sectionsInformation, vats, company, accountingSetup, fxRates, postingLineId, index, null);
                            accountingDocumentLines.Add(accountingDocumentLine);
                            postingLineId++;
                        }
                    }

                    // Tax
                    for (int index = 0; index < vats.Count(); index++)
                    {
                        accountingDocumentLine = await CreateAccountingDocumentLineForInvoice(AccountingDocumentLineType.Tax, invoiceInformation, sectionsInformation, vats, company, accountingSetup, fxRates, postingLineId, index, accountingDocumentLines);
                        accountingDocumentLines.Add(accountingDocumentLine);
                        postingLineId++;
                    }

                    // Client
                    accountingDocumentLine = await CreateAccountingDocumentLineForInvoice(AccountingDocumentLineType.Client, invoiceInformation, sectionsInformation, vats, company, accountingSetup, fxRates, postingLineId, 0, accountingDocumentLines);
                    accountingDocumentLine.SourceInvoiceId = invoiceInformation.InvoiceId;
                    accountingDocumentLines.Add(accountingDocumentLine);

                    break;
                case (int)DocumentType.CP:
                case (int)DocumentType.CI:

                    AccountingDocumentLine accountingDocumentLineForDocumentReference = new AccountingDocumentLine();

                    accountingDocumentLine = await CreateAccountingDocumentLineForSimpleCash(AccountingDocumentLineType.Client, docTypeId, cashInformation, company, fxRates, postingLineId, accountingSetup);
                    // Note: this is here for simple cash. There is no secondary reference, as at that time, the cash is no matched...
                    accountingDocumentLines.Add(accountingDocumentLine);

                    // Nominal
                    postingLineId++;
                    accountingDocumentLine = await CreateAccountingDocumentLineForSimpleCash(AccountingDocumentLineType.Nominal, docTypeId, cashInformation, company, fxRates, postingLineId, accountingSetup);
                    accountingDocumentLines.Add(accountingDocumentLine);

                    if (cashInformation.AdditionalCosts != null && cashInformation.AdditionalCosts.Any())
                    {
                        for (int index = 0; index < cashInformation.AdditionalCosts.Count(); index++)
                        {
                            postingLineId++;
                            AccountingDocumentLine accountingDocumentLineForAdditionalCosts = new AccountingDocumentLine();
                            AdditionalCostsDto additionalCostsDto = cashInformation.AdditionalCosts.ToList()[index];
                            accountingDocumentLineForAdditionalCosts.PostingLineId = postingLineId;
                            accountingDocumentLineForAdditionalCosts.AccountLineTypeId = (int)AccountLineType.L;
                            accountingDocumentLineForAdditionalCosts.Amount = additionalCostsDto.CostDirectionId == (int)Entities.CostDirectionType.Pay ? cashInformation.AdditionalCosts.ToList()[index].Amount : -cashInformation.AdditionalCosts.ToList()[index].Amount;
                            accountingDocumentLineForAdditionalCosts.AccountReference = additionalCostsDto.AccountReference;
                            accountingDocumentLineForAdditionalCosts.CostTypeCode = additionalCostsDto.CostTypeCode;
                            accountingDocumentLineForAdditionalCosts.AssociatedAccountCode = accountingDocumentLine.AssociatedAccountCode;
                            accountingDocumentLineForAdditionalCosts.DepartmentId = accountingDocumentLine.DepartmentId;
                            accountingDocumentLineForAdditionalCosts.Narrative = additionalCostsDto.Narrative;
                            accountingDocumentLineForAdditionalCosts.AccountingCategoryId = (int)AccountingCategory.N;
                            accountingDocumentLineForAdditionalCosts.Amount = Math.Round(accountingDocumentLineForAdditionalCosts.Amount, CommonRules.RoundDecimals);
                            accountingDocumentLineForAdditionalCosts.ClientAccount = null;
                            accountingDocumentLineForAdditionalCosts.SourceCostLineId = cashInformation.AdditionalCosts.ToList()[index].CashAdditionalCostId;
                            decimal? amountInUSD = accountingDocumentLineForAdditionalCosts.Amount;

                            if (additionalCostsDto.CurrencyCode != null && additionalCostsDto.CurrencyCode.ToUpperInvariant() != CommonRules.BaseCurrency)
                            {
                                amountInUSD = (await _foreignExchangeRateService.Convert(additionalCostsDto.CurrencyCode, CommonRules.BaseCurrency, accountingDocumentLineForAdditionalCosts.Amount, cashInformation.DocumentDate)).ConvertedValue;
                            }

                            accountingDocumentLineForAdditionalCosts = await CommonRules.CalculateFunctionalAndStatutoryCurrency(_foreignExchangeRateService, accountingDocumentLineForAdditionalCosts, amountInUSD, fxRates, company, CommonRules.BaseCurrency, CommonRules.RoundDecimals);

                            accountingDocumentLines.Add(accountingDocumentLineForAdditionalCosts);
                        }
                    }

                    break;

                case (int)DocumentType.MJL:
                    foreach (ManualJournalLineDto manualJournalLine in manualJournal.ManualJournalLines)
                    {
                        accountingDocumentLine = await CreateAccountingDocumentLineForManualJournal(docTypeId, company, manualJournal, fxRates, manualJournalLine, postingLineId, accountingSetup);
                        accountingDocumentLines.Add(accountingDocumentLine);
                        postingLineId++;
                    }

                    break;
                case (int)DocumentType.MTA:

		if (manualJournal != null && (manualJournal.TATypeId == (int)TAType.ManualTemporaryAdjustment || manualJournal.TATypeId == (int)TAType.ManualMarkToMarket))
                    {
                        IEnumerable<ManualJournalLineDto> manualJournalLines = manualJournal.ManualJournalLines.OrderBy(x => x.AccrualNumber);

                        int? previousAccuralNumber = manualJournal.ManualJournalLines.FirstOrDefault().AccrualNumber;

                        foreach (ManualJournalLineDto manualJournalLine in manualJournalLines)
                        {
                            if (previousAccuralNumber != manualJournalLine.AccrualNumber)
                            {
                                postingLineId = 1;
                                previousAccuralNumber = manualJournalLine.AccrualNumber;
                            }

                            accountingDocumentLine = await CreateAccountingDocumentLineForManualJournal(docTypeId, company, manualJournal, fxRates, manualJournalLine, postingLineId, accountingSetup);
                            accountingDocumentLines.Add(accountingDocumentLine);

                            if (previousAccuralNumber == manualJournalLine.AccrualNumber)
                            {
                                postingLineId++;
                            }

                            previousAccuralNumber = manualJournalLine.AccrualNumber;
                        }
                    }
                    
                    else if (monthEndTADocument != null && (monthEndTADocument.TATypeId == (int)TAType.MonthEndTemporaryAdjustment || monthEndTADocument.TATypeId == (int)TAType.FxDealMonthTemporaryAdjustment))
                    {
                        IEnumerable<MonthEndTALineDto> monthEndLines = monthEndTADocument.MonthEndTALines.OrderBy(x => x.AccrualNumber);

                        foreach (MonthEndTALineDto monthEndLine in monthEndLines)
                        {
                            accountingDocumentLine = await CreateAccountingDocumentLineForMonthEndTA(docTypeId, company, monthEndTADocument, fxRates, monthEndLine, postingLineId);
                            if (monthEndTADocument.TATypeId == (int)TAType.FxDealMonthTemporaryAdjustment)
                            {
                                postingLineId++;
                                accountingDocumentLine.AccountingCategoryId = (int)AccountingCategory.N;
                                accountingDocumentLine.AccountLineTypeId = (int)AccountLineType.L;
                            }

                            accountingDocumentLines.Add(accountingDocumentLine);
                        }
                    }

                    break;
                case (int)DocumentType.FJ:
                    accountingDocumentLine = await CreateAccountingDocumentLineForFJDocument(docTypeId, postingLineId, accountingSetup, AccountLineType.B, company, fxRates, fxSettlementDocument);
                    accountingDocumentLines.Add(accountingDocumentLine);
                    postingLineId++;

                    accountingDocumentLine = await CreateAccountingDocumentLineForFJDocument(docTypeId, postingLineId, accountingSetup, AccountLineType.L, company, fxRates, fxSettlementDocument);
                    accountingDocumentLines.Add(accountingDocumentLine);
                    break;
            }

            return accountingDocumentLines;
        }

        private async Task EnqueueBulkPostingProcessorMessage(IEnumerable<long> docIds, string company, bool postOpClosedPolicy)
        {
            List<ProcessMessage> postingProcessMessage = new List<ProcessMessage>();

            foreach (long docId in docIds)
            {
                var content = new JObject();
                content.Add(new JProperty("docId", docId));
                content.Add(new JProperty("postOpClosedPolicy", postOpClosedPolicy));

                postingProcessMessage.Add(new ProcessMessage
                {
                    ProcessTypeId = (long)ProcessType.AtlasPostingProcessor,
                    CompanyId = company,
                    Content = content.ToString()
                });
            }

            await _processMessageService.SendBulkMessage(postingProcessMessage);
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

    public enum TransactionDocumentType
    {
        PurchaseInvoice = 1,
        SalesInvoice = 2,
        CreditNote = 3,
        DebitNote = 4,
        CashPay = 5,
        CashReceipt = 6,
        TemporaryAdjustment = 7,
        MatchingCash = 8,
        Revaluation = 9,
        ManualRegularJournal = 10,
    }
}
