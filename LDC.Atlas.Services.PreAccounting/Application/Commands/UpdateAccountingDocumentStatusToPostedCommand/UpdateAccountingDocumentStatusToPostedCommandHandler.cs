using AutoMapper;
using LDC.Atlas.Application.Core.Entities;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.Services;
using LDC.Atlas.MasterData.Common;
using LDC.Atlas.Services.PreAccounting.Application.Queries;
using LDC.Atlas.Services.PreAccounting.Entities;
using LDC.Atlas.Services.PreAccounting.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Application.Commands
{
    public class UpdateAccountingDocumentStatusToPostedCommandHandler : IRequestHandler<UpdateAccountingDocumentStatusToPostedCommand, Unit>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IIdentityService _identityService;
        private readonly ILogger _logger;
        private readonly IMapper _mapper;
        private readonly IAccountingDocumentQueries _accountingQueries;
        private readonly IMasterDataService _masterDataService;
        private readonly IAccountingDocumentRepository _accountingDocumentRepository;
        private readonly IInvoicingRepository _invoicingRepository;
        private readonly ISystemDateTimeService _systemDateTimeService;
        private readonly IProcessMessageService _processMessageService;

        public UpdateAccountingDocumentStatusToPostedCommandHandler(
          ILogger<UpdateAccountingDocumentStatusToPostedCommandHandler> logger,
          IUnitOfWork unitOfWork,
          IIdentityService identityService,
          IMapper mapper,
          IAccountingDocumentQueries accountingQueries,
          IMasterDataService masterDataService,
          ISystemDateTimeService systemDateTimeService,
          IProcessMessageService processMessageService,
          IAccountingDocumentRepository accountingDocumentRepository,
          IInvoicingRepository documentMatchingRepository)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _systemDateTimeService = systemDateTimeService ?? throw new ArgumentNullException(nameof(systemDateTimeService));
            _processMessageService = processMessageService ?? throw new ArgumentNullException(nameof(processMessageService));
            _accountingQueries = accountingQueries ?? throw new ArgumentNullException(nameof(accountingQueries));
            _masterDataService = masterDataService ?? throw new ArgumentNullException(nameof(masterDataService));
            _accountingDocumentRepository = accountingDocumentRepository ?? throw new ArgumentNullException(nameof(accountingDocumentRepository));
            _invoicingRepository = documentMatchingRepository ?? throw new ArgumentNullException(nameof(documentMatchingRepository));
        }

        /// <summary>
        /// Handling of a request to declare an accounting document as "posted".
        /// This request is called by the background process which manages the posting
        /// </summary>
        /// <param name="request">Contains the id of the accounting document to post</param>
        /// <param name="cancellationToken"></param>
        public async Task<Unit> Handle(UpdateAccountingDocumentStatusToPostedCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var company = await _masterDataService.GetCompanyByIdAsync(request.Company);
                List<AccountingDocumentStatus> accountingDocumentsToPostIds = new List<AccountingDocumentStatus>();

                // Getting the accounting document for which to change the posting status (there is only one as we retrieve an 
                // accounting document for which we passed the id as parameter)
                var accountingDocumentInformation =
                    await _accountingQueries.GetAccountingDocumentInAuthorizeStateForPostingAsync(request.DocId, request.Company);

                if (accountingDocumentInformation == null)
                {
                    throw new Exception($"No postable document found for company {request.Company} with ID {request.DocId}");
                }

                accountingDocumentsToPostIds.Add(new AccountingDocumentStatus { AccountingId = accountingDocumentInformation.AccountingDocumentId });

                // accounting document sent for posting should have the flag toInterface as True
                // Reason for this change is Reval JL had ToInterface flag as false. and hence were not getting Interfaced
                // If the document with ToInterface set as True, has all the Lines with Amount as zero it will be again set as false
                accountingDocumentInformation.ToInterface = true;
                accountingDocumentInformation.FullAccountingDocument.ToInterface = true;

                // Fixing the rate of exchange of the transaction document, from the doc CCY into the fct & statut ccy
                // so that the matched fct & statut ccy amounts can be calculated accurately

                // We dont want to run that on Reval (caused some issues at some time because of a bad request - this test should be useless now)
                var transactionDocumentDto = await _accountingQueries.GetJLDocumentTypeByTransactionDocumentId(accountingDocumentInformation.TransactionDocumentId, request.Company);
                if (transactionDocumentDto == null ||
                    (transactionDocumentDto != null && transactionDocumentDto.JLTypeId != 2)) // JLType = 2 = Reval
                {
                    await UpdateDocumentRates(
                        request.Company,
                        accountingDocumentInformation.TransactionDocumentId,
                        accountingDocumentInformation.FullAccountingDocument.GLDate.Value);
                }

                // Cash by picking: updating the "matchflag" status from "prematch" to "not prematch" + creation of reval JL
                if (accountingDocumentInformation.DetailedCashType != null
                    && accountingDocumentInformation.DetailedCashType.Value != (int)CashSelectionType.SimpleCashPayment
                    && accountingDocumentInformation.DetailedCashType.Value != (int)CashSelectionType.SimpleCashReceipt)
                {
                    // We are in a cash by picking !
                    if (accountingDocumentInformation.CashByPickingMatchFlagId == null)
                    {
                        throw new Exception($"No matchflag found for cash by picking transaction document id {accountingDocumentInformation.DocumentReference} for company {request.Company}");
                    }

                    // Creation of a new JL transaction document
                    var infoForCreatingCashByPickingReval = await _accountingQueries.GetInfoForCreatingCashByPickingReval(
                        company.CompanyId,
                        accountingDocumentInformation.TransactionDocumentId,
                        accountingDocumentInformation.DetailedCashType.Value == (int)CashSelectionType.PaymentDifferentClient);

                    if (infoForCreatingCashByPickingReval == null)
                    {
                        throw new Exception($"Internal error: no cash by picking found with transaction id ${accountingDocumentInformation.TransactionDocumentId}");
                    }

                    // We set the "prematch" value of the match flag to false, because, for a cash by picking,
                    // the corresponding match flag becomes not "prematched" at the time the cbp is posted
                    await _accountingDocumentRepository.UpdatePrematchForMatchFlag(
                        company.CompanyId,
                        infoForCreatingCashByPickingReval.CashByPickingMatchFlagId,
                        false);

                    // In case of different client we set the "prematched" status of the second (part of matched documents) matchflag to false
                    if (infoForCreatingCashByPickingReval.DiffClientMatchFlagId.HasValue)
                    {
                        await _accountingDocumentRepository.UpdatePrematchForMatchFlag(
                        company.CompanyId,
                        infoForCreatingCashByPickingReval.DiffClientMatchFlagId,
                        false);
                    }

                    if (infoForCreatingCashByPickingReval.CashByPickingMatchFlagId != null &&
                        (infoForCreatingCashByPickingReval.CashByPickingMatchingCurrencyCode != company.FunctionalCurrencyCode
                        || infoForCreatingCashByPickingReval.CashByPickingMatchingCurrencyCode != company.StatutoryCurrencyCode))
                    {
                        // Need to create a reval document
                        // Note that reval documents are created (for cash by picking) at posting time of the cbp
                        Revaluation revaluation = new Revaluation
                        {
                            TransactionDocumentId = accountingDocumentInformation.TransactionDocumentId,
                            MatchFlagId = infoForCreatingCashByPickingReval.CashByPickingMatchFlagId.Value,
                            CurrencyCode = infoForCreatingCashByPickingReval.CashByPickingMatchingCurrencyCode,
                            GLDate = infoForCreatingCashByPickingReval.CashByPickingDocumentDate,
                            PaymentDocumentDate = infoForCreatingCashByPickingReval.CashByPickingValueDate,
                            CompanyId = request.Company,
                            DifferentClientMatchFlagId = infoForCreatingCashByPickingReval.DiffClientMatchFlagId
                        };

                        var newRevalTransactionDocumentId = await _accountingDocumentRepository.CreateRevaluation(
                            revaluation,
                            true);
                        await EnqueueMessageForCreatingAccDoc(newRevalTransactionDocumentId, request.Company, request.PostOpClosedPolicy);
                        _logger.LogInformation("Document match for cash created with match id {Atlas_MatchFlagId}.", infoForCreatingCashByPickingReval.CashByPickingMatchFlagId.Value);
                    }
                }

                if (accountingDocumentInformation.TransactionDocumentTypeId == (int)DocumentType.MTA)
                {
                    var transactionIdOfReversedDoc = await _accountingQueries.GetTransactionDocumentIdByReversalId(accountingDocumentInformation.TransactionDocumentId, request.Company);

                    if (transactionIdOfReversedDoc == null)
                    {
                        // In the case of an accrual, we create the automatic accounting document for the month M+1
                        // Note that it will be automatically created as "posted" !
                        AccountingDocument accountingDocumentForMainReversal = accountingDocumentInformation.FullAccountingDocument.ShallowCopy();

                        accountingDocumentForMainReversal.DocumentDate = new DateTime(accountingDocumentForMainReversal.DocumentDate.Year, accountingDocumentForMainReversal.DocumentDate.Month, 1).AddMonths(1);
                        accountingDocumentForMainReversal.AccountingPeriod = new DateTime(accountingDocumentForMainReversal.AccountingPeriod.Year, accountingDocumentForMainReversal.AccountingPeriod.Month, 1).AddMonths(1);
                        accountingDocumentForMainReversal.AccountingDate = accountingDocumentForMainReversal.DocumentDate;
                        accountingDocumentForMainReversal.StatusId = PostingStatus.Posted;

                        foreach (AccountingDocumentLine accountingDocumentLine in accountingDocumentForMainReversal.AccountingDocumentLines)
                        {
                            accountingDocumentLine.Amount = -accountingDocumentLine.Amount;
                            accountingDocumentLine.FunctionalCurrency = -accountingDocumentLine.FunctionalCurrency;
                            accountingDocumentLine.StatutoryCurrency = -accountingDocumentLine.StatutoryCurrency;
                            accountingDocumentLine.Quantity = -accountingDocumentLine.Quantity;

                            var monthEnd = await _accountingQueries.GetMonthEndTAbyTransactionDocumentId(request.Company, accountingDocumentInformation.FullAccountingDocument.TransactionDocumentId);

                            if (monthEnd == null)
                            {
                                accountingDocumentLine.Narrative =
                                    "Reversal of Manual Accrual " + accountingDocumentForMainReversal.AccountingPeriod.ToString("MMM-yyyy", CultureInfo.InvariantCulture);
                            }
                            else
                            {
                                accountingDocumentLine.Narrative =
                                    "Reversal of Accruals " + accountingDocumentInformation.FullAccountingDocument.AccountingPeriod.ToString("MMM-yyyy", CultureInfo.InvariantCulture);
                            }
                        }
                        List<AccountingDocument> lstOfAccountingaccount = new List<AccountingDocument>();
                        lstOfAccountingaccount.Add(accountingDocumentForMainReversal);
                        var accountingDocumentCreationStatus = await _accountingDocumentRepository.CreateAccountingDocument(request.Company, lstOfAccountingaccount);
                        foreach (var accountingDocumentStatus in accountingDocumentCreationStatus)
                        {
                            accountingDocumentsToPostIds.Add(new AccountingDocumentStatus { AccountingId = accountingDocumentStatus.AccountingId });
                        }
                    }
                }

                // Diff currency, we also need to update the payment side to posted status
                if (accountingDocumentInformation.DetailedCashType == (int)CashSelectionType.PaymentDifferentCurrency || accountingDocumentInformation.DetailedCashType == (int)CashSelectionType.ReceiptDifferentCurrency)
                {
                    var cashInformation = await _accountingQueries.GetCashInformationForAccountingDocument(accountingDocumentInformation.TransactionDocumentId, company.CompanyId);

                    var paidAccountingDocument = (await _accountingQueries.GetAccountingDocumentsbyTransactionDocumentId(cashInformation.PaymentTransactionDocumentId.Value, company.CompanyId)).FirstOrDefault();

                    accountingDocumentsToPostIds.Add(new AccountingDocumentStatus { AccountingId = paidAccountingDocument.AccountingId });
                }

                // Set the document status to "posted"
                await _accountingDocumentRepository.UpdateAccountingDocumentsStatus(
                    request.Company,
                    accountingDocumentsToPostIds,
                    (int)PostingStatus.Posted);

                // identify if its a TA document
                bool ifAccrualDocument = accountingDocumentInformation.FullAccountingDocument.DocumentReference.Contains("TA");
                if (accountingDocumentsToPostIds.Count > 1 && !ifAccrualDocument)
                {
                    // get the list of all accounting documents which has got posted
                    var accountingIds = accountingDocumentsToPostIds.Select(item => item.AccountingId);

                    // get the accounting document information from accounting ID
                    var accountingDocumentToBeInterfaced = await _accountingQueries.GetAccountingDocumentsByAccountingIdsAsync(accountingIds, company.CompanyId);
                    foreach (var accountingDocument in accountingDocumentToBeInterfaced)
                    {
                        if (accountingDocument.ToInterface)
                        {
                            // sanity check to verify if documentLines have valid amount
                            bool areAllAccountingLinesEqualToZero = accountingDocument.AccountingDocumentLines.All(x => x.Amount == 0);
                            var documentToBeInterfaced = new AccountingDocument();
                            documentToBeInterfaced.TransactionDocumentTypeId = (long)accountingDocument.TransactionDocumentTypeId;
                            documentToBeInterfaced.TransactionDocumentId = accountingDocument.TransactionDocumentId;
                            documentToBeInterfaced.AccountingId = accountingDocument.AccountingId;
                            documentToBeInterfaced.ToInterface = accountingDocument.ToInterface;

                            bool isCOrNAccountingLine = accountingDocument.AccountingDocumentLines.Where(accountingLine => accountingLine.AccountingCategoryId == (int)AccountingCategory.N
                                   || accountingLine.AccountingCategoryId == (int)AccountingCategory.C).Count() > 0;

                            if (areAllAccountingLinesEqualToZero && isCOrNAccountingLine)
                            {
                                await _accountingDocumentRepository.UpdateAccountingDocumentInterfaceStatus(request.Company, documentToBeInterfaced.TransactionDocumentId);

                                documentToBeInterfaced.ToInterface = false;
                            }
                            else
                            {
                                // insert into accounting interface process message queue
                                await InsertIntoAccountingInterfaceProcessQueue(documentToBeInterfaced, request.Company);
                            }
                        }
                    }
                }
                else
                {
                    if (accountingDocumentInformation.ToInterface)
                    {
                        // sanity check to verify if documentLines have valid amount
                        bool areAllAccountingLinesEqualToZero = accountingDocumentInformation.FullAccountingDocument.AccountingDocumentLines.All(x => x.Amount == 0);

                        // If the document contains client or nominal lines (so typically, cash or invoice documents),
                        // while all the line amounts are equal to 0,
                        // then we don't send it to the accounting interface.
                        // [But not sure what is the exact scenario supposed to end with the condition of a cash or an invoice
                        // with all the client and nominal lines are equal to 0]
                        //
                        // Note: revaluation journal have all the amounts = 0 (but not the amount in statutory & fct currency)
                        //       but does not enter in this condition because it has no "C" or "N" line
                        bool isCOrNAccountingLine = accountingDocumentInformation.FullAccountingDocument.AccountingDocumentLines.Where(accountingLine => accountingLine.AccountingCategoryId == (int)AccountingCategory.N
                                   || accountingLine.AccountingCategoryId == (int)AccountingCategory.C).Count() > 0;

                        if (areAllAccountingLinesEqualToZero && isCOrNAccountingLine)
                        {
                            await _accountingDocumentRepository.UpdateAccountingDocumentInterfaceStatus(request.Company, accountingDocumentInformation.FullAccountingDocument.TransactionDocumentId);

                            accountingDocumentInformation.FullAccountingDocument.ToInterface = false;
                        }
                        else
                        {
                            // insert into accounting interface process message queue
                            await InsertIntoAccountingInterfaceProcessQueue(accountingDocumentInformation.FullAccountingDocument, request.Company);
                        }
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

        private async Task InsertIntoAccountingInterfaceProcessQueue(AccountingDocument accountingDocument, string company)
        {
            if (accountingDocument.ToInterface)
            {
                dynamic message = new JObject(
                    new JProperty("transactionDocumentId", accountingDocument.TransactionDocumentId),
                    new JProperty("documentId", accountingDocument.AccountingId),
                    new JProperty("documentTypeId", accountingDocument.TransactionDocumentTypeId),
                    new JProperty("companyId", company),
                    new JProperty("businessApplicationType", BusinessApplicationType.AX));

                await _processMessageService.SendMessage(new ProcessMessage
                {
                    ProcessTypeId = (long)ProcessType.AtlasAccountingInterfaceProcessor,
                    CompanyId = company,
                    Content = message.ToString()
                });
            }
        }

        private async Task EnqueueMessageForCreatingAccDoc(long docId, string company, bool postOpClosedPolicy)
        {
            var content = new JObject();
            content.Add(new JProperty("docId", docId));
            content.Add(new JProperty("postOpClosedPolicy", postOpClosedPolicy));

            await _processMessageService.SendMessage(new ProcessMessage
            {
                ProcessTypeId = (int)ProcessType.AtlasAccountingDocumentProcessor,
                CompanyId = company,
                Content = content.ToString()
            });
        }

        private async Task UpdateDocumentRates(
          string companyCode,
          long transactionDocumentId,
          DateTime postingDate)
        {
            var informationForUpdatingTransactionDocumentRates = await _invoicingRepository.UpdateTransactionDocumentRates(
                companyCode,
                transactionDocumentId,
                postingDate);

            if (informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.IsReversal)
            {
                // We don't try to update the rates for reversal
                return;
            }

            if (informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate == null)
            {
                throw new Exception($"Error: no transaction document found for id {transactionDocumentId}");
            }
            if (informationForUpdatingTransactionDocumentRates.AccountingDocumentLinesInfoForRateUpdate == null
                || informationForUpdatingTransactionDocumentRates.AccountingDocumentLinesInfoForRateUpdate.Count() == 0)
            {
                throw new Exception($"Error: no accounting document lines found for id {transactionDocumentId}");
            }

            StatutoryAndCurrencyAmountsUpdateInfo result = null;
            switch (informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.TransactionDocumentTypeEnum)
            {
                case MasterDocumentType.PI:
                case MasterDocumentType.SI:
                case MasterDocumentType.DN:
                case MasterDocumentType.CN:
                    switch (informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.InvoiceTypeEnum)
                    {
                        case InvoiceType.WashoutCredit:
                        case InvoiceType.WashoutDebit:
                            result = CalculateAmountUpdatesForWashoutInvoice(
                                transactionDocumentId,
                                informationForUpdatingTransactionDocumentRates);
                            break;
                        case InvoiceType.CancelledCredit:
                        case InvoiceType.CancelledDebit:
                            result = CalculateAmountUpdatesForCancelledInvoice(
                                transactionDocumentId,
                                informationForUpdatingTransactionDocumentRates);
                            break;
                        default:
                            result = CalculateAmountUpdatesForNonWashoutInvoice(
                                transactionDocumentId,
                                informationForUpdatingTransactionDocumentRates);
                            break;
                    }
                    break;
                case MasterDocumentType.CI:
                case MasterDocumentType.CP:
                    result = CalculateAmountUpdatesForCash(
                        transactionDocumentId,
                        informationForUpdatingTransactionDocumentRates);
                    break;
                case MasterDocumentType.JL:
                    result = CalculateAmountUpdatesForJournal(
                        transactionDocumentId,
                        informationForUpdatingTransactionDocumentRates);
                    break;
                case MasterDocumentType.MC:
                    break;
                case MasterDocumentType.TA:
                    break;
            }
            if (result != null)
            {
                await _invoicingRepository.UpdateStatutoryAndCurrencyAmounts(companyCode, result);
            }
        }

        #region calculations of updates to do on records for taking into consideration the "fixing" of the rates at the time of posting
        private StatutoryAndCurrencyAmountsUpdateInfo CalculateAmountUpdatesForCash(
            long transactionDocumentId,
            DocumentsRateUpdateInformation informationForUpdatingTransactionDocumentRates)
        {
            if (informationForUpdatingTransactionDocumentRates.CashLinesInfoForRateUpdate == null || informationForUpdatingTransactionDocumentRates.CashLinesInfoForRateUpdate.Count() == 0)
            {
                throw new Exception($"Error for cash with transaction id {transactionDocumentId}: no cash lines found");
            }

            var result = new StatutoryAndCurrencyAmountsUpdateInfo();
            decimal totalAmount = 0;
            decimal totalAmountInFunctionalCurrency = 0;
            decimal totalAmountInStatutoryCurrency = 0;
            foreach (var cashLine in informationForUpdatingTransactionDocumentRates.CashLinesInfoForRateUpdate)
            {
                var amount = cashLine.Amount;
                if (informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.IsCashByPickingMultiCurrency)
                {
                    var roe = informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.CbpMultiCCY_MatchingRoe;
                    var roeType = informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.CbpMultiCCY_matchingRoeType;
                    // In the case of a cbp multi ccy, the amount to consider is the one in the cash ccy
                    amount = amount * (roeType == "M" ? roe : 1) / (roeType == "D" ? roe : 1);
                }

                CalculateAmounts(
                    amount,
                    informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.RoeFromDocumentCCYToFunctionalCCY,
                    informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.RoeFromDocumentCCYToStatutoryCCY,
                    informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.RoeConversionDirection,
                    out decimal amountInFuntionalCurrency,
                    out decimal amountInStatutoryCurrency);
                result.CashLinesAmountsToUpdate.Add(new CashLineAmountsToUpdate()
                {
                    CashLineId = cashLine.CashLineId,
                    AmountInFunctionalCurrency = amountInFuntionalCurrency,
                    AmountInStatutoryCurrency = amountInStatutoryCurrency
                });

                var accountingLines = informationForUpdatingTransactionDocumentRates.AccountingDocumentLinesInfoForRateUpdate.
                    Where(accLine => accLine.SourceCashLineId == cashLine.CashLineId).ToList();
                if (accountingLines.Count != 1)
                {
                    throw new Exception($"Error: the number of accounting lines refering cashline id {cashLine.CashLineId} is not equal to 1");
                }

                var accountingLine = accountingLines.First();
                var sign = accountingLine.Amount > 0 ? 1 : -1;
                result.AccountingLinesAmountsToUpdate.Add(new AccountingLineAmountsToUpdate()
                {
                    AccountingLineId = accountingLine.AccountingDocumentLineId,
                    AmountInFunctionalCurrency = Math.Abs(amountInFuntionalCurrency) * sign,
                    AmountInStatutoryCurrency = Math.Abs(amountInStatutoryCurrency) * sign
                });
                totalAmount += accountingLine.Amount;
                totalAmountInFunctionalCurrency += Math.Abs(amountInFuntionalCurrency) * sign;
                totalAmountInStatutoryCurrency += Math.Abs(amountInStatutoryCurrency) * sign;

                var documentMatching = informationForUpdatingTransactionDocumentRates.DocumentMatchingInfoForRateUpdate.Where
                    (dm => dm.SourceCashLineId == cashLine.CashLineId).FirstOrDefault();

                if (documentMatching != null)
                {
                    if (Math.Abs(documentMatching.Amount) != Math.Abs(accountingLine.Amount))
                    {
                        throw new Exception($"Error: the document matching id {documentMatching.DocumentMatchingId} associated to cash line id {cashLine.CashLineId} has an amount which is inconsistent with the amount of acc line id {accountingLine.AccountingDocumentLineId}");
                    }

                    var signDocumentMatching = documentMatching.Amount > 0 ? 1 : -1;
                    result.DocumentMatchingToUpdate.Add(new DocumentMatchingToUpdate()
                    {
                        DocumentMatchingId = documentMatching.DocumentMatchingId,
                        AmountInFunctionalCurrency = Math.Abs(amountInFuntionalCurrency) * signDocumentMatching,
                        AmountInStatutoryCurrency = Math.Abs(amountInStatutoryCurrency) * signDocumentMatching
                    });
                }
            }

            decimal totalCostAmount = 0;
            decimal totalCostAmountInFunctionalCurrency = 0;
            decimal totalCostAmountInStatutoryCurrency = 0;
            foreach (var additionalCost in informationForUpdatingTransactionDocumentRates.CashAdditionalCostsInfoForRateUpdate)
            {
                CalculateAmounts(
                    additionalCost.Amount,
                    informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.RoeFromDocumentCCYToFunctionalCCY,
                    informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.RoeFromDocumentCCYToStatutoryCCY,
                    informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.RoeConversionDirection,
                    out decimal amountInFuntionalCurrency,
                    out decimal amountInStatutoryCurrency);
                result.CashCostsAmountsToUpdate.Add(new CashCostAmountsToUpdate()
                {
                    CashAdditionCostId = additionalCost.CashAdditionalCostId,
                    AmountInFunctionalCurrency = amountInFuntionalCurrency,
                    AmountInStatutoryCurrency = amountInStatutoryCurrency
                });

                var accountingLines = informationForUpdatingTransactionDocumentRates.AccountingDocumentLinesInfoForRateUpdate.
                    Where(accLine => accLine.SourceCostLineId == additionalCost.CashAdditionalCostId).ToList();
                if (accountingLines.Count != 1)
                {
                    throw new Exception($"Error: the number of accounting lines refering cash additional cost id {additionalCost.CashAdditionalCostId} is not equal to 1");
                }

                var accountingLine = accountingLines.First();
                var sign = accountingLine.Amount > 0 ? 1 : -1;
                result.AccountingLinesAmountsToUpdate.Add(new AccountingLineAmountsToUpdate()
                {
                    AccountingLineId = accountingLine.AccountingDocumentLineId,
                    AmountInFunctionalCurrency = Math.Abs(amountInFuntionalCurrency) * sign,
                    AmountInStatutoryCurrency = Math.Abs(amountInStatutoryCurrency) * sign
                });

                totalCostAmount += accountingLine.Amount;
                totalCostAmountInFunctionalCurrency += Math.Abs(amountInFuntionalCurrency) * sign;
                totalCostAmountInStatutoryCurrency += Math.Abs(amountInStatutoryCurrency) * sign;
            }

            // Updating the bank accounting line
            // We can have multiple bank lines
            var bankAccountLines = informationForUpdatingTransactionDocumentRates.AccountingDocumentLinesInfoForRateUpdate
                .Where(accLine => accLine.AccountingDocumentLineTypeEnum == AccountingDocumentLineTypeTheRealOne.Bank && accLine.SourceCostLineId == null).ToList();
            if (bankAccountLines.Count != 1)
            {
                throw new Exception($"Error for invoice {informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.DocumentReference} transaction id {transactionDocumentId}: 1 unique bank line expected but 0 or more than 1 found");
            }

            var bankAccountLine = bankAccountLines.First();
            decimal calculatedBankAmount = -(totalAmount + totalCostAmount);
            decimal calculatedBankAmountInStatutoryCCY = -(totalAmountInStatutoryCurrency + totalCostAmountInStatutoryCurrency);
            decimal calculatedBankAmountInFunctionalCCY = -(totalAmountInFunctionalCurrency + totalCostAmountInFunctionalCurrency);
            if (calculatedBankAmount != bankAccountLine.Amount
                // The consistency check betwee the calculated bank amount and the bank line amount cannot be done if diff ccy,
                // as the calculated bank amount is a sum of values in 2 ccies (thus, wrong...) 
                && !informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.IsCashByPickingMultiCurrency)
            {
                throw new Exception($"Error for cash {informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.DocumentReference} transaction id {transactionDocumentId}: the calculated bank amount does not match the stored bank amount");
            }

            result.AccountingLinesAmountsToUpdate.Add(new AccountingLineAmountsToUpdate()
            {
                AccountingLineId = bankAccountLine.AccountingDocumentLineId,
                AmountInFunctionalCurrency = calculatedBankAmountInFunctionalCCY,
                AmountInStatutoryCurrency = calculatedBankAmountInStatutoryCCY
            });

            if (informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.IsCashByPickingMultiCurrency)
            {
                foreach (var accDoc in informationForUpdatingTransactionDocumentRates.AccountingDocumentLinesInfoForRateUpdate
                .Where(accLine => accLine.AccountingDocumentLineTypeEnum == AccountingDocumentLineTypeTheRealOne.Ledger && accLine.SourceCostLineId == null))
                {
                    var sign = accDoc.Amount > 0 ? 1 : -1;
                    result.AccountingLinesAmountsToUpdate.Add(new AccountingLineAmountsToUpdate()
                    {
                        AccountingLineId = accDoc.AccountingDocumentLineId,
                        AmountInFunctionalCurrency = Math.Abs(totalAmountInFunctionalCurrency) * sign,
                        AmountInStatutoryCurrency = Math.Abs(totalAmountInStatutoryCurrency) * sign
                    });
                }
            }

            CheckBalance(result, informationForUpdatingTransactionDocumentRates);

            return result;
        }

        private StatutoryAndCurrencyAmountsUpdateInfo CalculateAmountUpdatesForNonWashoutInvoice(
            long transactionDocumentId,
            DocumentsRateUpdateInformation informationForUpdatingTransactionDocumentRates)
        {
            var result = new StatutoryAndCurrencyAmountsUpdateInfo();
            if (informationForUpdatingTransactionDocumentRates.InvoiceLinesInfoForRateUpdate == null || informationForUpdatingTransactionDocumentRates.InvoiceLinesInfoForRateUpdate.Count() == 0)
            {
                throw new Exception($"Error for invoice with transaction id {transactionDocumentId}: no invoice lines found");
            }

            decimal totalAmountInFunctionalCurrency = 0;
            decimal totalAmountInStatutoryCurrency = 0;
            decimal totalAmount = 0;
            decimal totalVatAmount = 0;
            decimal totalVatAmountInFunctionalCurrency = 0;
            decimal totalVatAmountInStatutoryCurrency = 0;

            foreach (var invoiceLine in informationForUpdatingTransactionDocumentRates.InvoiceLinesInfoForRateUpdate)
            {
                CalculateAmounts(
                    invoiceLine.LineAmount,
                    informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.RoeFromDocumentCCYToFunctionalCCY,
                    informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.RoeFromDocumentCCYToStatutoryCCY,
                    informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.RoeConversionDirection,
                    out decimal amountInFuntionalCurrency,
                    out decimal amountInStatutoryCurrency);
                CalculateAmounts(
                    invoiceLine.VATAmount,
                    informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.RoeFromDocumentCCYToFunctionalCCY,
                    informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.RoeFromDocumentCCYToStatutoryCCY,
                    informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.RoeConversionDirection,
                    out decimal vatAmountInFuntionalCurrency,
                    out decimal vatAmountInStatutoryCurrency);

                result.InvoiceLinesAmountsToUpdate.Add(new InvoiceLineAmountsToUpdate()
                {
                    InvoiceLineId = invoiceLine.InvoiceLineId,
                    AmountInFunctionalCurrency = amountInFuntionalCurrency,
                    AmountInStatutoryCurrency = amountInStatutoryCurrency
                });

                var accountingLines = informationForUpdatingTransactionDocumentRates.AccountingDocumentLinesInfoForRateUpdate.
                    Where(accLine => accLine.SourceInvoiceLineId == invoiceLine.InvoiceLineId);
                if (accountingLines.Count() != 1)
                {
                    throw new Exception($"Error: the number of accounting lines refering invoice line id {invoiceLine.InvoiceLineId} is not equal to 1");
                }

                var accountingLine = accountingLines.ToList()[0];
                result.AccountingLinesAmountsToUpdate.Add(new AccountingLineAmountsToUpdate()
                {
                    AccountingLineId = accountingLine.AccountingDocumentLineId,
                    AmountInFunctionalCurrency = amountInFuntionalCurrency * (accountingLine.Amount > 0 ? 1 : -1),
                    AmountInStatutoryCurrency = amountInStatutoryCurrency * (accountingLine.Amount > 0 ? 1 : -1)
                });

                // Same algorithm than invoiceCommandHandler.CalculateBalancedTotalAmount :
                // invoice lines targeting a purchase contract are counted <0, lines targeting a sales contract >0
                // Costs payable are counted <0, costs receivable >0
                var sign = invoiceLine.CostDirectionTypeEnum == null
                    ? (invoiceLine.ContractTypeEnum == Entities.ContractType.CommercialPurchase ? -1 : 1)
                    : (invoiceLine.CostDirectionTypeEnum == CostDirectionType.Pay ? -1 : 1);
                totalAmountInStatutoryCurrency += amountInStatutoryCurrency * sign;
                totalAmountInFunctionalCurrency += amountInFuntionalCurrency * sign;
                totalAmount += invoiceLine.LineAmount * sign;
                totalVatAmount += invoiceLine.VATAmount;
                totalVatAmountInFunctionalCurrency += vatAmountInFuntionalCurrency;
                totalVatAmountInStatutoryCurrency += vatAmountInStatutoryCurrency;

            }

            // Updating the total invoice value in the invoice
            if (Math.Abs(informationForUpdatingTransactionDocumentRates.InvoiceInfoForRateUpdate.TotalInvoiceValue) != Math.Abs(totalAmount))
            {
                throw new Exception($"Error for invoice {informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.DocumentReference} transaction id {transactionDocumentId}: the total calculated amount does not match the total amount stored in the invoice");
            }

            var invoiceAmountSign =
                informationForUpdatingTransactionDocumentRates.InvoiceInfoForRateUpdate.TotalInvoiceValue > 0 ? 1 : -1;
            result.InvoiceAmountsToUpdate.Add(new InvoiceAmountsToUpdate()
            {
                InvoiceId = informationForUpdatingTransactionDocumentRates.InvoiceInfoForRateUpdate.InvoiceId,
                AmountInFunctionalCurrency = Math.Abs(totalAmountInFunctionalCurrency) * invoiceAmountSign,
                AmountInStatutoryCurrency = Math.Abs(totalAmountInStatutoryCurrency) * invoiceAmountSign
            });

            // Updating the counterparty line (Client or Vendor)
            var customerAccountingLines = informationForUpdatingTransactionDocumentRates.AccountingDocumentLinesInfoForRateUpdate
                .Where(accLine => accLine.AccountingDocumentLineTypeEnum == AccountingDocumentLineTypeTheRealOne.Vendor
                || accLine.AccountingDocumentLineTypeEnum == AccountingDocumentLineTypeTheRealOne.Client);
            if (customerAccountingLines == null || customerAccountingLines.Count() != 1)
            {
                throw new Exception($"Error for invoice {informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.DocumentReference} transaction id {transactionDocumentId}: 1 unique client or vendor line expected but 0 or more than 1 found");
            }

            var customerAccountingLine = customerAccountingLines.First();

            if ((totalAmount - totalVatAmount) != customerAccountingLine.Amount)
            {
                throw new Exception($"Internal error for invoice {informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.DocumentReference} when updating rates: the total calculated does not match the total stored");
            }

            result.AccountingLinesAmountsToUpdate.Add(new AccountingLineAmountsToUpdate()
            {
                AccountingLineId = customerAccountingLine.AccountingDocumentLineId,
                AmountInFunctionalCurrency = totalAmountInFunctionalCurrency,
                AmountInStatutoryCurrency = totalAmountInStatutoryCurrency
            });

            CheckBalance(result, informationForUpdatingTransactionDocumentRates);

            result.AccountingLinesAmountsToUpdate.Find(x => x.AccountingLineId == customerAccountingLine.AccountingDocumentLineId).AmountInFunctionalCurrency -= totalVatAmountInFunctionalCurrency;
            result.AccountingLinesAmountsToUpdate.Find(x => x.AccountingLineId == customerAccountingLine.AccountingDocumentLineId).AmountInStatutoryCurrency -= totalVatAmountInStatutoryCurrency;

            // REMAINING WORK to be done for non-E6 companies: take into account the VAT lines (=0 for E6)

            return result;
        }

        private StatutoryAndCurrencyAmountsUpdateInfo CalculateAmountUpdatesForWashoutInvoice(
             long transactionDocumentId,
             DocumentsRateUpdateInformation informationForUpdatingTransactionDocumentRates)
        {
            var result = new StatutoryAndCurrencyAmountsUpdateInfo();
            if (informationForUpdatingTransactionDocumentRates.InvoiceLinesInfoForRateUpdate == null || informationForUpdatingTransactionDocumentRates.InvoiceLinesInfoForRateUpdate.Count() == 0)
            {
                throw new Exception($"Error for invoice with transaction id {transactionDocumentId}: no invoice lines found");
            }

            decimal totalAmountInFunctionalCurrency = 0;
            decimal totalAmountInStatutoryCurrency = 0;
            decimal totalAmount = 0;

            // [WASHOUT_E6] For washout E6, we expect to have only one 1 to 1 washout (ie we must have only one line for a purchase
            // contract, and one line for a sales contract)
            //if (informationForUpdatingTransactionDocumentRates.InvoiceLinesInfoForRateUpdate.Count(i => i.CostDirectionTypeEnum == null && i.ContractTypeEnum == Entities.ContractType.CommercialPurchase) != 1
            //    || informationForUpdatingTransactionDocumentRates.InvoiceLinesInfoForRateUpdate.Count(i => i.CostDirectionTypeEnum == null && i.ContractTypeEnum == Entities.ContractType.CommercialSale) != 1
            //    )
            //{
            //    // NOTE : this rule is also written in CreateAccountingDocumentCommandHandler.CreateAccountingDocumentLines
            //    // Look for [WASHOUT_E6] in the source code
            //    throw new Exception("Error : for E6 release, there is the assumption that the washouth contains one unique line on a purchase contract, and one unique line on a sales contract");
            //}

            foreach (var invoiceLine in informationForUpdatingTransactionDocumentRates.InvoiceLinesInfoForRateUpdate)
            {
                CalculateAmounts(
                    invoiceLine.LineAmount,
                    informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.RoeFromDocumentCCYToFunctionalCCY,
                    informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.RoeFromDocumentCCYToStatutoryCCY,
                    informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.RoeConversionDirection,
                    out decimal amountInFuntionalCurrency,
                    out decimal amountInStatutoryCurrency);
                result.InvoiceLinesAmountsToUpdate.Add(new InvoiceLineAmountsToUpdate()
                {
                    InvoiceLineId = invoiceLine.InvoiceLineId,
                    AmountInFunctionalCurrency = amountInFuntionalCurrency,
                    AmountInStatutoryCurrency = amountInStatutoryCurrency
                });
            }

            result.InvoiceLinesAmountsToUpdate = result.InvoiceLinesAmountsToUpdate.OrderBy(x => x.InvoiceLineId).ToList();
            informationForUpdatingTransactionDocumentRates.InvoiceLinesInfoForRateUpdate = informationForUpdatingTransactionDocumentRates.InvoiceLinesInfoForRateUpdate.OrderBy(x => x.InvoiceLineId).ToList();

            int index = -1;

            foreach (var invoiceLine in informationForUpdatingTransactionDocumentRates.InvoiceLinesInfoForRateUpdate)
            {
                var newAmountsForTheLine = result.InvoiceLinesAmountsToUpdate.Where(lines => lines.InvoiceLineId == invoiceLine.InvoiceLineId)
                    .First();

                index++;

                // [WASHOUT_E6] The line on the commercial purchase does not produce an accounting line...
                if (invoiceLine.ContractTypeEnum == Entities.ContractType.CommercialPurchase
                    && invoiceLine.CostDirectionTypeEnum == null)
                {
                    continue;
                }

                int purchaseIndex = index % 2 == 0 ? index + 1 : index - 1;

                // Looking for the associated accounting line
                var accountingLines = informationForUpdatingTransactionDocumentRates.AccountingDocumentLinesInfoForRateUpdate.
                Where(accLine => accLine.SourceInvoiceLineId == invoiceLine.InvoiceLineId);
                if (accountingLines.Count() != 1)
                {
                    throw new Exception($"Error: the number of accounting lines refering invoice line id {invoiceLine.InvoiceLineId} is not equal to 1");
                }

                var accountingLine = accountingLines.ToList()[0];

                var sign = invoiceLine.CostDirectionTypeEnum == null
                      ? (invoiceLine.ContractTypeEnum == Entities.ContractType.CommercialPurchase ? -1 : 1)
                      : (invoiceLine.CostDirectionTypeEnum == CostDirectionType.Pay ? -1 : 1);
                if (invoiceLine.ContractTypeEnum == Entities.ContractType.CommercialSale
                    && invoiceLine.CostDirectionTypeEnum == null)
                {
                    // We "aggregate" the invoice line associated to the purchase contract with the one associated to the sales contract
                    InvoiceLineAmountsToUpdate associatedSalesNewAmount = null;
                    var associatedInvoiceLineInfo = informationForUpdatingTransactionDocumentRates.InvoiceLinesInfoForRateUpdate.ToList()[purchaseIndex];
                    // Where(line => line.ContractTypeEnum == Entities.ContractType.CommercialPurchase && line.CostDirectionTypeEnum == null).First();
                    associatedSalesNewAmount = result.InvoiceLinesAmountsToUpdate.Where(line => line.InvoiceLineId == associatedInvoiceLineInfo.InvoiceLineId).First();

                    newAmountsForTheLine = new InvoiceLineAmountsToUpdate()
                    {
                        InvoiceLineId = newAmountsForTheLine.InvoiceLineId,
                        AmountInFunctionalCurrency = newAmountsForTheLine.AmountInFunctionalCurrency - associatedSalesNewAmount.AmountInFunctionalCurrency,
                        AmountInStatutoryCurrency = newAmountsForTheLine.AmountInStatutoryCurrency - associatedSalesNewAmount.AmountInStatutoryCurrency
                    };
                    totalAmount -= associatedInvoiceLineInfo.LineAmount * sign;

                    if (Math.Abs(accountingLine.Amount) != Math.Abs(invoiceLine.LineAmount - associatedInvoiceLineInfo.LineAmount))
                    {
                        throw new Exception($"Inconsistency error when working for washout {informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.DocumentReference}");
                    }

                    result.AccountingLinesAmountsToUpdate.Add(new AccountingLineAmountsToUpdate()
                    {
                        AccountingLineId = accountingLine.AccountingDocumentLineId,
                        AmountInFunctionalCurrency = Math.Abs(newAmountsForTheLine.AmountInFunctionalCurrency) * (accountingLine.Amount > 0 ? 1 : -1),
                        AmountInStatutoryCurrency = Math.Abs(newAmountsForTheLine.AmountInStatutoryCurrency) * (accountingLine.Amount > 0 ? 1 : -1)
                    });
                }
                else
                {
                    result.AccountingLinesAmountsToUpdate.Add(new AccountingLineAmountsToUpdate()
                    {
                        AccountingLineId = accountingLine.AccountingDocumentLineId,
                        AmountInFunctionalCurrency = Math.Abs(newAmountsForTheLine.AmountInFunctionalCurrency) * (accountingLine.Amount > 0 ? 1 : -1),
                        AmountInStatutoryCurrency = Math.Abs(newAmountsForTheLine.AmountInStatutoryCurrency) * (accountingLine.Amount > 0 ? 1 : -1)
                    });
                }

                // Same algorithm than invoiceCommandHandler.CalculateBalancedTotalAmount :
                // invoice lines targeting a purchase contract are counted <0, lines targeting a sales contract >0
                // Costs payable are counted <0, costs receivable >0
                totalAmountInStatutoryCurrency += newAmountsForTheLine.AmountInStatutoryCurrency * sign;
                totalAmountInFunctionalCurrency += newAmountsForTheLine.AmountInFunctionalCurrency * sign;
                totalAmount += invoiceLine.LineAmount * sign;
            }

            // Updating the total invoice value in the invoice
            if (Math.Abs(informationForUpdatingTransactionDocumentRates.InvoiceInfoForRateUpdate.TotalInvoiceValue) != Math.Abs(totalAmount))
            {
                throw new Exception($"Error for invoice {informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.DocumentReference} transaction id {transactionDocumentId}: the total calculated amount does not match the total amount stored in the invoice");
            }

            var invoiceAmountSign =
                informationForUpdatingTransactionDocumentRates.InvoiceInfoForRateUpdate.TotalInvoiceValue > 0 ? 1 : -1;
            result.InvoiceAmountsToUpdate.Add(new InvoiceAmountsToUpdate()
            {
                InvoiceId = informationForUpdatingTransactionDocumentRates.InvoiceInfoForRateUpdate.InvoiceId,
                AmountInFunctionalCurrency = Math.Abs(totalAmountInFunctionalCurrency) * invoiceAmountSign,
                AmountInStatutoryCurrency = Math.Abs(totalAmountInStatutoryCurrency) * invoiceAmountSign
            });

            // Updating the counterparty line (Client or Vendor)
            var customerAccountingLines = informationForUpdatingTransactionDocumentRates.AccountingDocumentLinesInfoForRateUpdate
                .Where(accLine => accLine.AccountingDocumentLineTypeEnum == AccountingDocumentLineTypeTheRealOne.Vendor
                || accLine.AccountingDocumentLineTypeEnum == AccountingDocumentLineTypeTheRealOne.Client);
            if (customerAccountingLines == null || customerAccountingLines.Count() != 1)
            {
                throw new Exception($"Error for invoice {informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.DocumentReference} transaction id {transactionDocumentId}: 1 unique client or vendor line expected but 0 or more than 1 found");
            }

            var customerAccountingLine = customerAccountingLines.First();
            if (totalAmount != customerAccountingLine.Amount)
            {
                throw new Exception($"Internal error for invoice {informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.DocumentReference} when updating rates: the total calculated does not match the total stored");
            }

            result.AccountingLinesAmountsToUpdate.Add(new AccountingLineAmountsToUpdate()
            {
                AccountingLineId = customerAccountingLine.AccountingDocumentLineId,
                AmountInFunctionalCurrency = Math.Abs(totalAmountInFunctionalCurrency) * (customerAccountingLine.Amount > 0 ? 1 : -1),
                AmountInStatutoryCurrency = Math.Abs(totalAmountInStatutoryCurrency) * (customerAccountingLine.Amount > 0 ? 1 : -1)
            });

            CheckBalance(result, informationForUpdatingTransactionDocumentRates);

            // REMAINING WORK to be done for non-E6 companies: take into account the VAT lines (=0 for E6)

            return result;
        }

        private StatutoryAndCurrencyAmountsUpdateInfo CalculateAmountUpdatesForCancelledInvoice(
                long transactionDocumentId,
                DocumentsRateUpdateInformation informationForUpdatingTransactionDocumentRates)
        {
            var result = new StatutoryAndCurrencyAmountsUpdateInfo();
            if (informationForUpdatingTransactionDocumentRates.InvoiceLinesInfoForRateUpdate == null || informationForUpdatingTransactionDocumentRates.InvoiceLinesInfoForRateUpdate.Count() == 0)
            {
                throw new Exception($"Error for invoice with transaction id {transactionDocumentId}: no invoice lines found");
            }

            decimal totalAmountInFunctionalCurrency = 0;
            decimal totalAmountInStatutoryCurrency = 0;
            decimal totalAmount = 0;

            foreach (var invoiceLine in informationForUpdatingTransactionDocumentRates.InvoiceLinesInfoForRateUpdate)
            {
                CalculateAmounts(
                    invoiceLine.LineAmount,
                    informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.RoeFromDocumentCCYToFunctionalCCY,
                    informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.RoeFromDocumentCCYToStatutoryCCY,
                    informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.RoeConversionDirection,
                    out decimal amountInFuntionalCurrency,
                    out decimal amountInStatutoryCurrency);
                result.InvoiceLinesAmountsToUpdate.Add(new InvoiceLineAmountsToUpdate()
                {
                    InvoiceLineId = invoiceLine.InvoiceLineId,
                    AmountInFunctionalCurrency = amountInFuntionalCurrency,
                    AmountInStatutoryCurrency = amountInStatutoryCurrency
                });

                var accountingLines = informationForUpdatingTransactionDocumentRates.AccountingDocumentLinesInfoForRateUpdate.
                    Where(accLine => accLine.SourceInvoiceLineId == invoiceLine.InvoiceLineId);
                if (accountingLines.Count() != 1)
                {
                    throw new Exception($"Error: the number of accounting lines refering invoice line id {invoiceLine.InvoiceLineId} is not equal to 1");
                }

                var accountingLine = accountingLines.ToList()[0];
                result.AccountingLinesAmountsToUpdate.Add(new AccountingLineAmountsToUpdate()
                {
                    AccountingLineId = accountingLine.AccountingDocumentLineId,
                    AmountInFunctionalCurrency = amountInFuntionalCurrency * (accountingLine.Amount > 0 ? 1 : -1),
                    AmountInStatutoryCurrency = amountInStatutoryCurrency * (accountingLine.Amount > 0 ? 1 : -1)
                });

                // Costs payable are counted <0, costs receivable >0
                var sign = informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.TransactionDocumentTypeId == (int)DocumentType.CN ? -1 : 1;

                totalAmountInStatutoryCurrency += amountInStatutoryCurrency * sign;
                totalAmountInFunctionalCurrency += amountInFuntionalCurrency * sign;
                totalAmount += invoiceLine.LineAmount * sign;
            }

            // Updating the total invoice value in the invoice
            if (Math.Abs(informationForUpdatingTransactionDocumentRates.InvoiceInfoForRateUpdate.TotalInvoiceValue) != Math.Abs(totalAmount))
            {
                throw new Exception($"Error for invoice {informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.DocumentReference} transaction id {transactionDocumentId}: the total calculated amount does not match the total amount stored in the invoice");
            }

            var invoiceAmountSign =
                informationForUpdatingTransactionDocumentRates.InvoiceInfoForRateUpdate.TotalInvoiceValue > 0 ? 1 : -1;
            result.InvoiceAmountsToUpdate.Add(new InvoiceAmountsToUpdate()
            {
                InvoiceId = informationForUpdatingTransactionDocumentRates.InvoiceInfoForRateUpdate.InvoiceId,
                AmountInFunctionalCurrency = Math.Abs(totalAmountInFunctionalCurrency) * invoiceAmountSign,
                AmountInStatutoryCurrency = Math.Abs(totalAmountInStatutoryCurrency) * invoiceAmountSign
            });

            // Updating the counterparty line (Client or Vendor)
            var customerAccountingLines = informationForUpdatingTransactionDocumentRates.AccountingDocumentLinesInfoForRateUpdate
                .Where(accLine => accLine.AccountingDocumentLineTypeEnum == AccountingDocumentLineTypeTheRealOne.Vendor
                || accLine.AccountingDocumentLineTypeEnum == AccountingDocumentLineTypeTheRealOne.Client);
            if (customerAccountingLines == null || customerAccountingLines.Count() != 1)
            {
                throw new Exception($"Error for invoice {informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.DocumentReference} transaction id {transactionDocumentId}: 1 unique client or vendor line expected but 0 or more than 1 found");
            }

            var customerAccountingLine = customerAccountingLines.First();
            result.AccountingLinesAmountsToUpdate.Add(new AccountingLineAmountsToUpdate()
            {
                AccountingLineId = customerAccountingLine.AccountingDocumentLineId,
                AmountInFunctionalCurrency = totalAmountInFunctionalCurrency,
                AmountInStatutoryCurrency = totalAmountInStatutoryCurrency
            });

            CheckBalance(result, informationForUpdatingTransactionDocumentRates);

            // REMAINING WORK to be done for non-E6 companies: take into account the VAT lines (=0 for E6)

            return result;
        }

        private StatutoryAndCurrencyAmountsUpdateInfo CalculateAmountUpdatesForJournal(
            long transactionDocumentId,
            DocumentsRateUpdateInformation informationForUpdatingTransactionDocumentRates)
        {
            if (informationForUpdatingTransactionDocumentRates.JournalLinesInfoForRateUpdate == null
                || informationForUpdatingTransactionDocumentRates.JournalLinesInfoForRateUpdate.Count() == 0)
            {
                throw new Exception($"Error for journal with transaction id {transactionDocumentId}: no journal lines found");
            }

            var result = new StatutoryAndCurrencyAmountsUpdateInfo();
            foreach (var journalLine in informationForUpdatingTransactionDocumentRates.JournalLinesInfoForRateUpdate)
            {
                CalculateAmounts(
                             journalLine.Amount,
                             informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.RoeFromDocumentCCYToFunctionalCCY,
                             informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.RoeFromDocumentCCYToStatutoryCCY,
                             informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.RoeConversionDirection,
                             out decimal amountInFuntionalCurrency,
                             out decimal amountInStatutoryCurrency);

                var accountingLines = informationForUpdatingTransactionDocumentRates.AccountingDocumentLinesInfoForRateUpdate.
                    Where(accLine => accLine.SourceJournalLineId == journalLine.JournalLineId).ToList();
                if (accountingLines.Count != 1)
                {
                    throw new Exception($"Error: the number of accounting lines refering journal line id {journalLine.JournalLineId} is not equal to 1");
                }

                var accountingLine = accountingLines[0];

                result.JournalLinesAmountsToUpdate.Add(new JournalLineAmountsToUpdate()
                {
                    JournalLineId = journalLine.JournalLineId,
                    AccountingLineId = accountingLine.AccountingDocumentLineId,
                    AmountInFunctionalCurrency = amountInFuntionalCurrency,
                    AmountInStatutoryCurrency = amountInStatutoryCurrency
                });

                // Updating the associating accounting line (which MUST exist)
                result.AccountingLinesAmountsToUpdate.Add(new AccountingLineAmountsToUpdate()
                {
                    AccountingLineId = accountingLine.AccountingDocumentLineId,
                    AmountInFunctionalCurrency = amountInFuntionalCurrency,
                    AmountInStatutoryCurrency = amountInStatutoryCurrency
                });

                // In case of counterparty transfer JL (which are created at the time of cash by picking different clients) we need to update the document matching associated to them
                if (informationForUpdatingTransactionDocumentRates.DocumentMatchingOfCounterpartyTransferForRateUpdate != null)
                {
                    var documentMatching = informationForUpdatingTransactionDocumentRates.DocumentMatchingOfCounterpartyTransferForRateUpdate.Where(
                    dm => dm.SourceJournalLineId == journalLine.JournalLineId).FirstOrDefault();
                    if (documentMatching != null)
                    {
                        var signDocumentMatching = documentMatching.Amount > 0 ? 1 : -1;
                        result.DocumentMatchingToUpdate.Add(new DocumentMatchingToUpdate()
                        {
                            DocumentMatchingId = documentMatching.DocumentMatchingId,
                            AmountInFunctionalCurrency = Math.Abs(amountInFuntionalCurrency) * signDocumentMatching,
                            AmountInStatutoryCurrency = Math.Abs(amountInStatutoryCurrency) * signDocumentMatching
                        });
                    }
                }
            }

            // In the case the sum of the values in statutory & fct ccies do not balance (because of rounding error),
            // we correct the maximum value (to minimize the difference)
            if (result.AccountingLinesAmountsToUpdate.Sum(accLine => accLine.AmountInFunctionalCurrency) != 0
                || result.AccountingLinesAmountsToUpdate.Sum(accLine => accLine.AmountInStatutoryCurrency) != 0)
            {
                var sortedList = result.AccountingLinesAmountsToUpdate.OrderByDescending(accLine =>
                    Math.Max(Math.Abs(accLine.AmountInStatutoryCurrency), Math.Abs(accLine.AmountInFunctionalCurrency))).ToList();
                AccountingLineAmountsToUpdate maxValue = sortedList[0];
                result.AccountingLinesAmountsToUpdate.Remove(maxValue);
                maxValue.AmountInFunctionalCurrency = -result.AccountingLinesAmountsToUpdate.Sum(accLine => accLine.AmountInFunctionalCurrency);
                maxValue.AmountInStatutoryCurrency = -result.AccountingLinesAmountsToUpdate.Sum(accLine => accLine.AmountInStatutoryCurrency);
                result.AccountingLinesAmountsToUpdate.Add(maxValue);

                var maxJournalLine = result.JournalLinesAmountsToUpdate.Where(jl => jl.AccountingLineId == maxValue.AccountingLineId).First();
                maxJournalLine.AmountInFunctionalCurrency = maxJournalLine.AmountInFunctionalCurrency;
                maxJournalLine.AmountInStatutoryCurrency = maxJournalLine.AmountInStatutoryCurrency;
            }

            CheckBalance(result, informationForUpdatingTransactionDocumentRates);
            return result;
        }

        void CheckBalance(StatutoryAndCurrencyAmountsUpdateInfo result, DocumentsRateUpdateInformation informationForUpdatingTransactionDocumentRates)
        {
            // Checking the balance in the other currencies
            if (result.AccountingLinesAmountsToUpdate.Sum(line => line.AmountInFunctionalCurrency) != 0
                || result.AccountingLinesAmountsToUpdate.Sum(line => line.AmountInStatutoryCurrency) != 0)
            {
                throw new Exception($"Internal error for document {informationForUpdatingTransactionDocumentRates.TransactionDocumentInfoForRateUpdate.DocumentReference} when updating rates: the calculated balance for statutory or fct ccy is not 0");
            }
        }

        void CalculateAmounts(
           decimal amount,
           decimal roeFromDocumentCCYToFunctionalCCY,
           decimal roeFromDocumentCCYToStatutoryCCY,
           string roeConversionDirection,
           out decimal amountInFunctionalCurrency,
           out decimal amountInStatutoryCurrency)
        {
            amountInStatutoryCurrency =
                Math.Round(
                    amount
                * (roeConversionDirection == "M" ? roeFromDocumentCCYToStatutoryCCY : 1)
                / (roeConversionDirection != "M" ? roeFromDocumentCCYToStatutoryCCY : 1), 2, MidpointRounding.AwayFromZero); // the default rounding option for .NET is MidPointRounding.ToEven, but that this option does not produce the desired result for some of values: -1119.965 was getting rounded to -1119.96 instead of -1119.97
            amountInFunctionalCurrency =
                Math.Round(
                    amount
                * (roeConversionDirection == "M" ? roeFromDocumentCCYToFunctionalCCY : 1)
                / (roeConversionDirection != "M" ? roeFromDocumentCCYToFunctionalCCY : 1), 2, MidpointRounding.AwayFromZero); // the default rounding option for .NET is MidPointRounding.ToEven, but that this option does not produce the desired result for some of values: -1119.965 was getting rounded to -1119.96 instead of -1119.97
        }
        #endregion
    }
}