using AutoMapper;
using LDC.Atlas.Application.Common.Configuration;
using LDC.Atlas.Application.Core.Entities;
using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Document.Common.Dtos;
using LDC.Atlas.Document.Common.Entities;
using LDC.Atlas.Document.Common.OpenXml;
using LDC.Atlas.Document.Common.Services;
using LDC.Atlas.Document.Common.Utils;
using LDC.Atlas.MasterData.Common;
using LDC.Atlas.Services.Execution.Application.Queries;
using LDC.Atlas.Services.Execution.Application.SharedRules;
using LDC.Atlas.Services.Execution.Entities;
using LDC.Atlas.Services.Execution.Infrastructure.Policies;
using LDC.Atlas.Services.Execution.Repositories;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Application.Commands
{
    public partial class CreateCashCommandHandler : IRequestHandler<CreateCashCommand, Cash>,
        IRequestHandler<UpdateCashCommand>, IRequestHandler<DeleteCashCommand>,
        IRequestHandler<UpdateCashDocumentCommand, PhysicalDocumentReferenceDto>
    {
        #region private attributes
        private readonly ILogger<CreateCashCommandHandler> _logger;
        private readonly IIdentityService _identityService;
        private readonly IUnitOfWork _unitOfWork;

        private readonly ICashRepository _cashRepository;
        private readonly IManualDocumentMatchingRepository _manualDocumentMatchingRepository;
        private readonly ITransactionDocumentRepository _transactionDocumentRepository;

        private readonly IMapper _mapper;
        private readonly IProcessMessageService _processMessageService;
        private readonly ISystemDateTimeService _systemDateTimeService;
        private readonly IPhysicalDocumentStorageService _physicalDocumentStorageService;
        private readonly IPhysicalDocumentGenerationService _physicalDocumentGenerationService;
        private readonly IApplicationTableService _applicationTableQueries;
        private readonly IAuthorizationService _authorizationService;
        private readonly IMasterDataService _masterDataService;
        private readonly IManualJournalRepository _manualJournalRepository;
        private readonly IForeignExchangeRateService _foreignExchangeRateService;

        // This variable need to be finalized whether we are defining it in DB or in API only.
        private readonly string _journalEntriesLabel = "JL";
        private readonly int roundValue = 10;
        private Func<byte[], IWordDocument> _getWordDocument;
        private readonly IAccountingSetUpQueries _accountingQueries;

        #endregion

        #region constructor
        public CreateCashCommandHandler(
            ILogger<CreateCashCommandHandler> logger,
            IIdentityService identityService,
            IUnitOfWork unitOfWork,
            ICashRepository cashRepository,
            IManualDocumentMatchingRepository manualDocumentMatchingRepository,
            ITransactionDocumentRepository transactionDocumentRepository,
            IProcessMessageService processMessageService,
            ISystemDateTimeService systemDateTimeService,
            IPhysicalDocumentStorageService physicalDocumentStorageService,
            IPhysicalDocumentGenerationService physicalDocumentGenerationService,
            IApplicationTableService applicationTableQueries,
            IMapper mapper,
            IForeignExchangeRateService foreignExchangeRateService,
            IAuthorizationService authorizationService,
            IMasterDataService masterDataService,
            IManualJournalRepository manualJournalRepository,
            IAccountingSetUpQueries accountingQueries)
        {
            _cashRepository = cashRepository ?? throw new ArgumentNullException(nameof(cashRepository));
            _manualDocumentMatchingRepository = manualDocumentMatchingRepository ?? throw new ArgumentNullException(nameof(manualDocumentMatchingRepository));
            _transactionDocumentRepository = transactionDocumentRepository ?? throw new ArgumentNullException(nameof(transactionDocumentRepository));

            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _processMessageService = processMessageService ?? throw new ArgumentNullException(nameof(processMessageService));
            _systemDateTimeService = systemDateTimeService ?? throw new ArgumentNullException(nameof(systemDateTimeService));
            _physicalDocumentStorageService = physicalDocumentStorageService ?? throw new ArgumentNullException(nameof(physicalDocumentStorageService));
            _physicalDocumentGenerationService = physicalDocumentGenerationService ?? throw new ArgumentNullException(nameof(physicalDocumentGenerationService));
            _applicationTableQueries = applicationTableQueries ?? throw new ArgumentNullException(nameof(applicationTableQueries));
            _foreignExchangeRateService = foreignExchangeRateService;
            _authorizationService = authorizationService;
            _masterDataService = masterDataService;
            _manualJournalRepository = manualJournalRepository;
            _accountingQueries = accountingQueries;
        }
        #endregion

        #region event handlers
        /// <summary>
        /// Handling the "creation" event for a cash
        /// </summary>
        /// <param name="request">The command object that contains all the properties to create cash and related objects.</param>
        /// <param name="cancellationToken">Token to cancel the operation.</param>
        /// <returns>The Cash object that has been generated.</returns>
        public async Task<Cash> Handle(CreateCashCommand request, CancellationToken cancellationToken)
        {
            var cash = _mapper.Map<Cash>(request);

            _unitOfWork.BeginTransaction();
            try
            {
                await CheckCashEditionAccessRights(cash.ChildCashTypeId, cash.TraxStatus);
                await GenerateCashLinesAndDocumentMatching_AndSaveCashInDatabase(cash, request.IsDraft);

                _unitOfWork.Commit();
            }
            catch (Exception)
            {
                _unitOfWork.Rollback();
                throw;
            }

            _unitOfWork.BeginTransaction();
            try
            {
                await GeneratePhysicalDocument(request, cash);
                _unitOfWork.Commit();
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }

            _logger.LogInformation("New cash created with cash id {Atlas.CashId}.", cash.CashId);

            // TODO: return a simpler object (CashReference) as the entire cash object is no longer used by the client
            return cash;
        }

        /// <summary>
        /// Handling the "update" event of a cash
        /// </summary>
        /// <param name="request">The command object that contains all the properties to update cash and related objects.</param>
        /// <param name="cancellationToken">Token to cancel the operation.</param>
        public async Task<Unit> Handle(UpdateCashCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var cash = _mapper.Map<Cash>(request);

                await CheckCashEditionAccessRights(cash.ChildCashTypeId, cash.TraxStatus);

                var recordsToDelete = await _cashRepository.GetLinkedRecordsForCashUpdate(cash.CashId, cash.CompanyId);

                // Deleting the accounting document of the cash records
                foreach (var cashTransactionId in recordsToDelete.CashTransactionDocumentIds)
                {
                    await _cashRepository.DeleteAccountingDocument(cashTransactionId.TransactionDocumentId, request.CompanyId);
                }

                // Deleting the accounting document of the manual journals (reval & counterparty transfer)
                foreach (var manualJournalTransactionDocumentId in recordsToDelete.ManualJournalTransactionDocumentIds)
                {
                    await _cashRepository.DeleteAccountingDocument(manualJournalTransactionDocumentId, request.CompanyId);
                }

                // Deleting the matchflag and the associated document matching
                foreach (var matchFlag in recordsToDelete.MatchFlagIds)
                {
                    await _manualDocumentMatchingRepository.DeleteMatchFlag(matchFlag, request.CompanyId);
                }

                // Deleting the reval & counterparty transfer
                foreach (var manualJournalTransactionDocumentId in recordsToDelete.ManualJournalTransactionDocumentIds)
                {
                    await _transactionDocumentRepository.DeleteManualJLOrRevaluation(manualJournalTransactionDocumentId, request.CompanyId);
                }

                // Delete the cash records
                foreach (var cashTransactionId in recordsToDelete.CashTransactionDocumentIds)
                {
                    await _cashRepository.DeleteCashAsync(request.CompanyId, null, cashTransactionId.TransactionDocumentId, true);
                }

                List<OldNewId> oldNewIds = new List<OldNewId>();

                foreach (var cashInfo in recordsToDelete.CashTransactionDocumentIds)
                {
                    oldNewIds.Add(new OldNewId()
                    {
                        DocumentReference = cashInfo.DocumentReference,
                        OldTransactionDocumentId = cashInfo.TransactionDocumentId
                    });
                }

                // Regeneration of the cash
                await GenerateCashLinesAndDocumentMatching_AndSaveCashInDatabase(cash, request.IsDraft, oldNewIds);

                _unitOfWork.Commit();

                _logger.LogInformation("Cash with id {Atlas_CashId} updated.", request.CashId);

                return Unit.Value;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        // Here oldNewId is  transactiondocumentid's used to while updating cash.
        // This parameter will have value only in cash Edit mode.
        private async Task GenerateCashLinesAndDocumentMatching_AndSaveCashInDatabase(Cash cash, bool isdraft, List<OldNewId> oldNewIds = null)
        {
            await CalculateFunctionalStatutoryCurrencyValues(cash);

            cash.MatchingCashId = null; // The matching cash id is not supposed to be not null in general  ; the app set something in it...
            var documentLabelResult = await _cashRepository.GetCashDocumentLabelValue(cash.ChildCashTypeId);
            cash.TransactionDocumentTypeId = documentLabelResult.TransactionDocumentTypeId;
            cash.CashDocumentType = isdraft ? CashDocumentType.Draft : CashDocumentType.Cash;  
            cash.PhysicalDocumentId = null;
            int documentReferenceYear = 0;
            string documentReferenceYearValue = string.Empty;
            CommonRules commonRules = new CommonRules(_accountingQueries, _authorizationService, _identityService);
            documentReferenceYear = await commonRules.GetDocumentReferenceYear(cash.DocumentDate, cash.CompanyId);
            cash.Year = documentReferenceYear;
            Cash paymentCash = null; // The payment cash in case of diff ccy             
            if (string.IsNullOrEmpty(cash.DocumentReference))
            {
                // Context of a creation, Generate document reference
                // When in an update, the document reference is already filled in             
                var cashRef = await GenerateDocumentReference(cash.CompanyId, documentReferenceYear, cash.TransactionDocumentTypeId);
                cash.DocumentReference = cashRef.DocumentReference;
                cash.YearNumber = cashRef.YearNumber;
            }
            else
            {
                // !! Warning !! bad design below, but it's the quickest fix
                // When updating a Cash, we are recreating it and keeping the old reference.
                // This also means we are not recalculating the Year Number and we should keep the old one.
                // However we are not getting the Year number and we are not recalculating it so we are inserting 0 in the database.
                // the code below is aimed at fixing this
                cash.YearNumber = int.Parse(cash.DocumentReference.Substring(4, 5), CultureInfo.InvariantCulture);
            }

            // Setting match flag status. A simple cash is not matched at all, while a cash by picking
            // is fully matched with prematch (the matching being created at the time of the cash creation)
            cash.MatchingStatusId =
                ((CashSelectionType)cash.ChildCashTypeId == CashSelectionType.SimpleCashPayment
                || (CashSelectionType)cash.ChildCashTypeId == CashSelectionType.SimpleCashReceipt)
                ? (int)MatchingStatus.NotMatched
                : (int)MatchingStatus.FullyMatchedWithPreMatch;

            switch ((CashSelectionType)cash.ChildCashTypeId)
            {
                case CashSelectionType.SimpleCashPayment:
                case CashSelectionType.SimpleCashReceipt:
                    // Simple cash
                    cash.CashLines = new List<CashLine>(new[] { (await GenerateCashLineForSimpleCash(cash)) });
                    await _cashRepository.CreateCashAsync(cash);
                    if (oldNewIds != null)
                    {
                        oldNewIds[0].NewTransactionDocumentId = cash.TransactionDocumentId;
                        await _cashRepository.ReplaceTransactionDocumentIdsInLogs(cash.CompanyId, oldNewIds);
                    }

                    if (cash.CashDocumentType != CashDocumentType.Draft)
                    {
                        await EnqueueAccountingDocumentCreation(cash.CompanyId, cash.TransactionDocumentId);
                    }

                    break;
                case CashSelectionType.PaymentFullPartialTransaction:
                case CashSelectionType.ReceiptFullPartialTransaction:
                    // Cash by picking simple scenario : same ccy same client
                    {
                        cash.CashLines = GenerateCashLinesCashByPicking(cash.DocumentMatchings, (DirectionType)cash.CashTypeId).ToList();
                        await _cashRepository.CreateCashAsync(cash);
                        if (oldNewIds != null)
                        {
                            oldNewIds[0].NewTransactionDocumentId = cash.TransactionDocumentId;
                            await _cashRepository.ReplaceTransactionDocumentIdsInLogs(cash.CompanyId, oldNewIds);
                        }

                        if (cash.CashDocumentType != CashDocumentType.Draft)
                        {
                            await EnqueueAccountingDocumentCreation(cash.CompanyId, cash.TransactionDocumentId);
                        }

                        var matchFlagToCreate = GenerateMatchFlagForCashByPickingSimpleCase(cash);
                        var matchFlagId = await _cashRepository.CreateUpdateDocumentMatchingsForCashByPickingCreation(matchFlagToCreate, isEdit: false);
                    }

                    break;
                case CashSelectionType.PaymentDifferentCurrency:
                case CashSelectionType.ReceiptDifferentCurrency:
                    // Cash by picking
                    {
                        // Payment cash in bank currency with Matching data and additional costs
                        paymentCash = cash.Clone();

                        // Generate document reference for second cash
                        if (string.IsNullOrEmpty(cash.MatchedDocumentReference))
                        {
                            var cash2Ref = await GenerateDocumentReference(paymentCash.CompanyId, documentReferenceYear, paymentCash.TransactionDocumentTypeId, 2);
                            paymentCash.DocumentReference = cash2Ref.DocumentReference;
                            paymentCash.YearNumber = cash2Ref.YearNumber;
                        }
                        else
                        {
                            // In edition, the screen sends wrongly ordered doc refs
                            paymentCash.DocumentReference = cash.DocumentReference;
                            paymentCash.YearNumber = int.Parse(cash.DocumentReference.Substring(4, 5), CultureInfo.InvariantCulture);

                            cash.DocumentReference = cash.MatchedDocumentReference;
                            cash.YearNumber = int.Parse(cash.MatchedDocumentReference.Substring(4, 5), CultureInfo.InvariantCulture);
                        }

                        cash.CashLines = GenerateCashLinesCashByPicking(cash.DocumentMatchings, (DirectionType)cash.CashTypeId).ToList();

                        // First cash has the currency of the matched objects
                        cash.CurrencyCode = cash.MatchingCurrency;

                        // No matching data for first cash
                        cash.MatchingAmount = null;
                        cash.MatchingCashId = null;
                        cash.MatchingCurrency = null;
                        cash.MatchingRate = null;
                        cash.MatchingRateType = null;

                        // No additional costs for first cash
                        cash.AdditionalCostDetails = new List<CashAdditionalCost>();

                        // Calculate cash amount (in the currency of the matched objects)
                        cash.Amount = cash.CashLines.Sum(l => l.Amount);

                        await _cashRepository.CreateCashAsync(cash);
                        var matchFlagToCreate = GenerateMatchFlagForCashByPickingSimpleCase(cash);
                        var matchFlagId = await _cashRepository.CreateUpdateDocumentMatchingsForCashByPickingCreation(matchFlagToCreate, isEdit: false);

                        // Create second cash
                        paymentCash.Amount = Math.Round(cash.Amount.Value * (paymentCash.MatchingRateType == "M" ? paymentCash.MatchingRate.Value : 1 / paymentCash.MatchingRate.Value), 2);
                        paymentCash.MatchingCashId = cash.TransactionDocumentId;
                        paymentCash.MatchingAmount = cash.Amount;

                        await _cashRepository.CreateCashAsync(paymentCash);

                        cash.MatchedDocumentReference = paymentCash.DocumentReference;
                        cash.PaymentCashId = paymentCash.CashId;

                        if (oldNewIds != null)
                        {
                            oldNewIds.Where(o => o.DocumentReference == cash.DocumentReference).First().NewTransactionDocumentId = cash.TransactionDocumentId;
                            oldNewIds.Where(o => o.DocumentReference == cash.MatchedDocumentReference).First().NewTransactionDocumentId = paymentCash.TransactionDocumentId;
                            await _cashRepository.ReplaceTransactionDocumentIdsInLogs(cash.CompanyId, oldNewIds);
                        }

                        // We create a message only for the matched cash (the two cashes will be processed together when creating accounting documents).
                        if (cash.CashDocumentType != CashDocumentType.Draft)
                        {
                            await EnqueueAccountingDocumentCreation(cash.CompanyId, cash.TransactionDocumentId);
                        }
                    }

                    break;
                case CashSelectionType.PaymentDifferentClient:
                    {
                        cash.CashLines = GenerateCashLinesCashByPicking(cash.DocumentMatchings, (DirectionType)cash.CashTypeId).ToList();
                        await _cashRepository.CreateCashAsync(cash);
                        if (oldNewIds != null)
                        {
                            oldNewIds[0].NewTransactionDocumentId = cash.TransactionDocumentId;
                            await _cashRepository.ReplaceTransactionDocumentIdsInLogs(cash.CompanyId, oldNewIds);
                        }

                        if (cash.CashDocumentType != CashDocumentType.Draft)
                        {
                            await EnqueueAccountingDocumentCreation(cash.CompanyId, cash.TransactionDocumentId);
                        }

                        var allCostTypes = await _masterDataService.GetCostTypesAsync(cash.CompanyId);
                        var fxRealCostType = allCostTypes.Where(ct => ct.CostTypeCode == "FXREAL").FirstOrDefault();

                        // Create counterparty JLs and document matching records for matched documents and cash lines and for JLs
                        GenerateInformationForCashByPickingDiffClient(
                            cash,
                            out IEnumerable<ManualJournalLine> manualJournalLines,
                            out SortedList<int, DocumentMatching> mappingJLNumberAndDm,
                            out MatchFlag matchFlagCpForMatchedDocument,
                            out MatchFlag matchFlagCpForCash,
                            fxRealCostType);

                        cash.DocumentMatchings = null; // We don't want to use it anymore
                                                       // Generate document reference for counterparty transfer reference
                        var counterpartyTransferReference = await GenerateDocumentReference(cash.CompanyId, documentReferenceYear, (int)MasterDocumentType.JL);

                        // Save counterparty transfer JL in DB
                        var counterpartyTransferManualJournalDocument = new ManualJournalDocument()
                        {
                            DocumentReference = counterpartyTransferReference.DocumentReference,
                            YearNumber = counterpartyTransferReference.YearNumber,
                            DocumentDate = cash.DocumentDate,
                            CurrencyCode = cash.CurrencyCode,
                            TransactionDocumentTypeId = (int)MasterDocumentType.JL,
                            JLTypeId = (int)JLType.CounterPartyTransfer,
                            AuthorizedForPosting = cash.AuthorizedForPosting,
                            DataVersionId = cash.DataVersionId,
                            ValueDate = DateTime.Now,
                            Year = cash.Year,
                            ManualJournalLines = manualJournalLines,
                            AccountingPeriod = DateTime.Now,
                        };
                        var counterpartyTransferCreationInfo = await _manualJournalRepository.CreateManualJournal(counterpartyTransferManualJournalDocument, cash.CompanyId);

                        // Enqueue the creation of the accounting document
                        if (cash.CashDocumentType != CashDocumentType.Draft)
                        {
                            await EnqueueAccountingDocumentCreation(cash.CompanyId, counterpartyTransferCreationInfo.TransactionDocumentId);
                        }

                        counterpartyTransferManualJournalDocument.TransactionDocumentId = counterpartyTransferCreationInfo.TransactionDocumentId;
                        await _cashRepository.UpdateCashCounterpartyTransferId(cash.CompanyId, cash.CashId, counterpartyTransferCreationInfo.TransactionDocumentId);

                        // Get manual journal lines
                        var generatedCpTransferLinesReferences = await _manualJournalRepository.GetManualJournalLineReferences(counterpartyTransferCreationInfo.ManualJournalDocumentId, cash.CompanyId, cash.DataVersionId);
                        foreach (var journalLine in counterpartyTransferManualJournalDocument.ManualJournalLines)
                        {
                            journalLine.JournalDocumentId = counterpartyTransferCreationInfo.ManualJournalDocumentId;
                            journalLine.JournalLineId = generatedCpTransferLinesReferences.First(jl => jl.LineNumber == journalLine.LineNumber).JournalLineId;
                        }

                        // Pushing the source journal line id into the document matching
                        foreach (var journalLineReference in generatedCpTransferLinesReferences)
                        {
                            mappingJLNumberAndDm[(int)journalLineReference.LineNumber.Value].TransactionDocumentId = counterpartyTransferCreationInfo.TransactionDocumentId;
                            mappingJLNumberAndDm[(int)journalLineReference.LineNumber.Value].SourceJournalLineId = journalLineReference.JournalLineId;
                        }

                        // Save document matching records of counterparty of matched documents + associate them with a matchflag
                        cash.MatchFlagIdInvoiceInserted = await _cashRepository.CreateUpdateDocumentMatchingsForCashByPickingCreation(matchFlagCpForMatchedDocument, false);

                        // Save document matching records of counterparty of cash + associate them with a matchflag
                        cash.MatchFlagIdCashInserted = await _cashRepository.CreateUpdateDocumentMatchingsForCashByPickingCreation(matchFlagCpForCash, false);
                    }

                    break;
            }

            if (!isdraft)
            {
                if ((CashSelectionType)cash.ChildCashTypeId == CashSelectionType.PaymentDifferentCurrency
                    || (CashSelectionType)cash.ChildCashTypeId == CashSelectionType.ReceiptDifferentCurrency)
                {
                    // In case of payment with diff ccy, we send the payment cash
                    await EnqueueTraxPaymentMessage(paymentCash);
                }
                else
                {
                    await EnqueueTraxPaymentMessage(cash);
                }
            }
        }

        public async Task<PhysicalDocumentReferenceDto> Handle(UpdateCashDocumentCommand request, CancellationToken cancellationToken)
        {
            var draftDocument = await _physicalDocumentStorageService.DownloadDraftDocumentByIdAsync(request.DraftDocumentId);
            if (draftDocument?.FileContent == null)
            {
                throw new AtlasBusinessException("Document has not found.");
            }

            var cash = await _cashRepository.GetCashByIdAsync(request.Company, request.CashId);
            if (cash == null)
            {
                throw new AtlasBusinessException("Cash has not found.");
            }

            var validPreviewDocumentName = $"{request.Company}_{Enum.GetName(typeof(CashSelectionType), cash.CashTypeId)}_PREVIEW_{cash.CounterPartyCode}";
            var validDocumentName = $"{request.Company}_{Enum.GetName(typeof(CashSelectionType), cash.CashTypeId)}_{cash.CounterPartyCode}";
            if (!draftDocument.DocumentName.Contains(validPreviewDocumentName, StringComparison.InvariantCultureIgnoreCase) &&
                !draftDocument.DocumentName.Contains(validDocumentName, StringComparison.InvariantCultureIgnoreCase))
            {
                throw new AtlasBusinessException("The uploaded file is invalid, the filename has been modified.Please upload the document with the original filename.");
            }

            var physicalDocumentType = MapCashSelectionTypeToPhysicalDocumentType((CashSelectionType)cash.CashTypeId);

            var companyDate = await _systemDateTimeService.GetCompanyDate(request.Company);
            var documentName = $"{companyDate.ToString("yyyyMMdd_HHMMss", CultureInfo.InvariantCulture)}_{request.Company}_{Enum.GetName(typeof(CashSelectionType), cash.CashTypeId)}_{cash.CounterPartyCode}{draftDocument.DocumentExtension}";

            var documentId = await _physicalDocumentStorageService.UploadDocument(new UploadDocumentParameters
            {
                CompanyId = request.Company,
                DocumentName = documentName,
                File = draftDocument.FileContent,
                DocumentTemplatePath = draftDocument.DocumentTemplate,
                PhysicalDocumentTypeId = physicalDocumentType,
                PhysicalDocumentStatus = PhysicalDocumentStatus.New,
                RecordId = request.CashId,
                TableId = await GetApplicationTableId(physicalDocumentType),
            });

            if (cash.PhysicalDocumentId == request.PhysicalDocumentId)
            {
                await _cashRepository.UpdateCashPhysicalDocument(request.CashId, documentId);
            }

            await _physicalDocumentStorageService.UpdateDocumentStatus(request.PhysicalDocumentId, PhysicalDocumentStatus.Deprecated);

            return new PhysicalDocumentReferenceDto { PhysicalDocumentId = documentId };
        }
        #endregion

        #region Common methods

        /// <summary>
        /// This method will generate the document reference number based on CashType
        /// e.x For CaSh Receipt: CI1800001
        ///     For Cash Payment: CP1800001
        /// </summary>
        /// <param name="company">company code</param>
        /// <param name="year">The full year (2019 for ex...)</param>
        /// <param name="transactionDocumentTypeId">type of the transaction document to create</param>
        /// <param name="increment">The number to increment the counter with. One by default.</param>
        /// <returns>Tuple which contains at Item1 the new "yearnumber", and at Item2 the new DocumentReference (made
        /// of the transaction doc type, the year and the yearnumber</returns>
        private async Task<(long YearNumber, string DocumentReference)> GenerateDocumentReference(
            string company,
            int year,
            long transactionDocumentTypeId,
            int increment = 1)
        {
            var result = await _cashRepository.GetDocumentReferenceValues(
                company,
                year,
                transactionDocumentTypeId);
            if (result != null)
            {
                return (
                    result.TransactionTypeYearCounter,
                    string.Concat(
                    result.Label,
                    year % 100,
                    string.Format(CultureInfo.InvariantCulture, "{0:D5}", result.TransactionTypeYearCounter)));
            }

            return (0, null);
        }

        // generate additional cost document reference
        private async Task GetAdditionalCostDocumentReference(CreateCashCommand cash)
        {
            // fetch current document number from additional cost table to generate Journal Entries based on company and year.
            var result = await _cashRepository.GetAdditionalCashYearNumber(cash.CompanyId, cash.DocumentDate.Year);

            if (result != null)
            {
                int yearNumber = result.TransactionTypeYearCounter + 1;
                foreach (var item in cash.AdditionalCostDetails)
                {
                    if (!string.Equals(item.CurrencyCode, cash.CurrencyCode, StringComparison.CurrentCultureIgnoreCase))
                    {
                        string documentDateYear = cash.DocumentDate.Year.ToString(CultureInfo.InvariantCulture);
                        item.Year = cash.DocumentDate.Year;
                        item.YearNumber = yearNumber;
                        item.DocumentReference = string.Concat(_journalEntriesLabel, documentDateYear.Substring(documentDateYear.Length - 2), string.Format(CultureInfo.InvariantCulture, "{0:D5}", yearNumber));
                        yearNumber++;
                    }
                }
            }
        }

        public async Task<Unit> Handle(DeleteCashCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var cash = await _cashRepository.GetCashByIdAsync(request.Company, request.CashId);

                await _cashRepository.DeleteAccountingDocument(cash.TransactionDocumentId, request.Company);

                if (cash.MatchFlagId != null)
                {
                    // Case of a cash by picking ; we delete the match flag
                    await _manualDocumentMatchingRepository.DeleteMatchFlag(cash.MatchFlagId, request.Company);
                }

                await _cashRepository.DeleteCashAsync(request.Company, request.CashId, null, false);
                _unitOfWork.Commit();
                _logger.LogInformation("Cash with id {Atlas_CashId} deleted.", request.CashId);
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }

            return Unit.Value;
        }

        private void CheckDocumentValidity(PhysicalDraftDocumentDto document, Cash newCash, IWordDocument wordHelper)
        {
            if (document.PhysicalDocumentTypeId != (int)PhysicalDocumentType.CashSimpleCash
                && document.PhysicalDocumentTypeId != (int)PhysicalDocumentType.CashPickByTransaction
                && document.PhysicalDocumentTypeId != (int)PhysicalDocumentType.CashDifferentClient
                && document.PhysicalDocumentTypeId != (int)PhysicalDocumentType.CashDifferentCurrency)
            {
                throw new AtlasBusinessException($"The provided document is not of type cash.");
            }

            var documentName = $"{newCash.CompanyId}_{Enum.GetName(typeof(CashSelectionType), newCash.ChildCashTypeId)}_PREVIEW_{newCash.CounterPartyCode}_{_identityService.GetUserName()}";

            if (!document.DocumentName.Contains(documentName, StringComparison.InvariantCultureIgnoreCase))
            {
                throw new AtlasBusinessException($"The provided document has an invalid name. It should contains with {documentName}.");
            }

            var metadata = wordHelper.GetCustomXmlPart<CashDocumentMetadata>();

            if (metadata == null)
            {
                throw new AtlasBusinessException("The selected document has not been generated by Atlas. Please use a document originally created by Atlas.");
            }
        }

        private async Task<long> GenerateCashDocument(CreateCashCommand request, Cash cash, DateTime companyDate, bool isPreview)
        {
            var physicalDocumentType = MapCashSelectionTypeToPhysicalDocumentType((CashSelectionType)request.ChildCashTypeId);

            var template = await _physicalDocumentGenerationService.GetTemplateByPath(request.Template, physicalDocumentType, request.CompanyId);

            if (template == null)
            {
                throw new AtlasTechnicalException($"Cannot find requested template: {request.Template}");
            }

            // Generate the cash physical document
            var reportParameters = new Dictionary<string, string>
            {
                { "Company", cash.CompanyId },
                { "CashId", cash.CashId.ToString(CultureInfo.InvariantCulture) },
                { "IsPreview", isPreview.ToString(CultureInfo.InvariantCulture) }
            };

            var documentResponse = await _physicalDocumentGenerationService.GenerateDocument(request.Template, reportParameters, PhysicalDocumentFormat.WORDOPENXML);

            string documentName;

            if (request.IsDraft)
            {
                documentName = $"{companyDate.ToString("yyyyMMdd_HHMMss", CultureInfo.InvariantCulture)}_{cash.CompanyId}_{Enum.GetName(typeof(CashSelectionType), cash.ChildCashTypeId)}_PREVIEW_{cash.CounterPartyCode}_{_identityService.GetUserName()}.{documentResponse.Extension}";
            }
            else if (isPreview)
            {
                documentName = $"{companyDate.ToString("yyyyMMdd_HHMMss", CultureInfo.InvariantCulture)}_{cash.CompanyId}_{Enum.GetName(typeof(CashSelectionType), cash.ChildCashTypeId)}_PREVIEW_{cash.CounterPartyCode}.{documentResponse.Extension}";
            }
            else
            {
                documentName = $"{companyDate.ToString("yyyyMMdd_HHMMss", CultureInfo.InvariantCulture)}_{cash.CompanyId}_{Enum.GetName(typeof(CashSelectionType), cash.ChildCashTypeId)}_{cash.CounterPartyCode}.{documentResponse.Extension}";
            }

            // Add metadata inside the document
            var wordHelper = GetWordDocument(documentResponse.Result);

            wordHelper.AddCustomXmlPart(new CashDocumentMetadata { CashId = cash.CashId, Company = cash.CompanyId, UserName = _identityService.GetUserName() });

            var table = (await _applicationTableQueries.GetApplicationTablesAsync(physicalDocumentType.GetApplicationTableName())).FirstOrDefault();

            if (table == null)
            {
                throw new AtlasTechnicalException($"Table \"{physicalDocumentType.GetApplicationTableName()}\" not found in application tables.");
            }

            // Save the document in DB
            var documentId = await _physicalDocumentStorageService.UploadDocument(new UploadDocumentParameters
            {
                CompanyId = request.CompanyId,
                DocumentName = documentName,
                File = wordHelper.GetFile(),
                DocumentTemplatePath = template.Path,
                PhysicalDocumentTypeId = physicalDocumentType,
                PhysicalDocumentStatus = isPreview ? PhysicalDocumentStatus.Preview : PhysicalDocumentStatus.New,
                RecordId = cash.CashId,
                TableId = await GetApplicationTableId(physicalDocumentType),
                IsDraft = request.IsDraft
            });

            return documentId;
        }

        private async Task<int> GetApplicationTableId(PhysicalDocumentType physicalDocumentType)
        {
            var table = (await _applicationTableQueries.GetApplicationTablesAsync(physicalDocumentType.GetApplicationTableName())).FirstOrDefault();

            if (table == null)
            {
                throw new AtlasTechnicalException($"Table \"{physicalDocumentType.GetApplicationTableName()}\" not found in application tables.");
            }

            return table.TableId;
        }

        private async Task<CashLine> GenerateCashLineForSimpleCash(Cash cash)
        {
            var company = await _masterDataService.GetCompanyByIdAsync(cash.CompanyId);
            var amountInFunctionalCurrency = await _foreignExchangeRateService.Convert(cash.CurrencyCode, company.FunctionalCurrencyCode, cash.Amount.Value, cash.DocumentDate);
            var amountInStatutoryCurrency = await _foreignExchangeRateService.Convert(cash.CurrencyCode, company.StatutoryCurrencyCode, cash.Amount.Value, cash.DocumentDate);

            var cashLineAmount = cash.Amount;
            if ((CashSelectionType)cash.ChildCashTypeId == CashSelectionType.SimpleCashReceipt)
            {
                // In the case of a cash receipt, the total customer amount includes the costs
                // Note : this rule is also duplicated in CreateAccountingDocumentCommandHandler.CreateAccountingDocumentLineForSimpleCash
                foreach (var additionalCost in cash.AdditionalCostDetails)
                {
                    cashLineAmount += additionalCost.Amount
                            * (additionalCost.CostDirectionId == (int)CostDirection.Payable ? 1 : -1);
                }
            }

            var cashLine = new CashLine
            {
                DepartmentId = cash.DepartmentId,
                TransactionDirectionId = (int)((DirectionType)cash.CashTypeId == DirectionType.Payment ? TransactionDirection.Pay : TransactionDirection.Recieve),
                Amount = cashLineAmount,
                AmountInFunctionalCurrency = amountInFunctionalCurrency.ConvertedValue,
                AmountInStatutoryCurrency = amountInStatutoryCurrency.ConvertedValue
            };
            return cashLine;
        }

        /// <summary>
        /// Calculation of the functional and statutory currencies
        /// IMPORTANT NOTE : this is a temporary information ; as soon as the cash is posted,
        /// a call to usp_UpdateTransactionDocumentRates will "fix" the rates as the values at posting time
        /// and will recalculate the final matchable amounts
        /// </summary>
        /// <param name="cash">cash</param>
        private async Task CalculateFunctionalStatutoryCurrencyValues(Cash cash)
        {
            var company = await _masterDataService.GetCompanyByIdAsync(cash.CompanyId);
            var functionalCurrencyCode = company.FunctionalCurrencyCode;
            var statutoryCurrencyCode = company.StatutoryCurrencyCode;

            var fxRateDocumentCurrency = await _masterDataService.GetFxRateAsync(cash.DocumentDate, cash.CurrencyCode);
            var fxRateFunctionalCurrency = await _masterDataService.GetFxRateAsync(cash.DocumentDate, company.FunctionalCurrencyCode);
            var fxRateStatutoryCurrency = await _masterDataService.GetFxRateAsync(cash.DocumentDate, company.StatutoryCurrencyCode);

            IEnumerable<TransactionDocumentRateOfExchange> transactionDocumentRateOfExchangeList = await _transactionDocumentRepository.GetTransactionDocumentRateOfExchangeList(
                cash.DocumentMatchings.Where(dm => dm.TransactionDocumentId.HasValue).Select(dm => dm.TransactionDocumentId.Value).Distinct().ToList(),
                cash.CompanyId);

            foreach (var documentMatching in cash.DocumentMatchings)
            {
                var transactionDocumentRateOfExchange = transactionDocumentRateOfExchangeList.ToList().SingleOrDefault(t => t.TransactionDocumentId == documentMatching.TransactionDocumentId);

                if (transactionDocumentRateOfExchange == null)
                {
                    throw new AtlasBusinessException($"The transaction document not found for the id {documentMatching.TransactionDocumentId}");
                }

                documentMatching.AmountInFunctionalCurrency = AmountConverter.ConvertAmountThroughIntermediateRoeToUSD(
                   documentMatching.AmountToBePaid,
                   transactionDocumentRateOfExchange.RoeDocumentCurrency.Value,
                   transactionDocumentRateOfExchange.RoeDocumentCurrencyType,
                   transactionDocumentRateOfExchange.RoeFunctionalCurrency.Value,
                   transactionDocumentRateOfExchange.RoeFunctionalCurrencyType,
                   2);
                documentMatching.AmountInStatutoryCurrency = AmountConverter.ConvertAmountThroughIntermediateRoeToUSD(
                    documentMatching.AmountToBePaid,
                    transactionDocumentRateOfExchange.RoeDocumentCurrency.Value,
                    transactionDocumentRateOfExchange.RoeDocumentCurrencyType,
                    transactionDocumentRateOfExchange.RoeStatutoryCurrency.Value,
                    transactionDocumentRateOfExchange.RoeStatutoryCurrencyType,
                    2);

                if (cash.ChildCashTypeId == (int)CashSelectionType.PaymentDifferentCurrency || cash.ChildCashTypeId == (int)CashSelectionType.ReceiptDifferentCurrency)
                {
                    //var matchableDocumentSummaryInformation = matchableDocumentsSummaryInformation.Where(d => d.TransactionDocumentId ==
                    //    documentMatching.TransactionDocumentId).FirstOrDefault();

                    documentMatching.CashLineAmountInFunctionalCurrency = documentMatching.CurrencyCode != functionalCurrencyCode
                    ? (await _foreignExchangeRateService.Convert(documentMatching.CurrencyCode, functionalCurrencyCode, Math.Round(documentMatching.AmountToBePaid, roundValue, MidpointRounding.AwayFromZero), GetDateForROE(documentMatching))).ConvertedValue
                    : documentMatching.AmountToBePaid; // the default rounding option for .NET is MidPointRounding.ToEven, but that this option does not produce the desired result for some of values: -1119.965 was getting rounded to -1119.96 instead of -1119.97

                    documentMatching.CashLineAmountInStatutoryCurrency = documentMatching.CurrencyCode != statutoryCurrencyCode
                    ? (await _foreignExchangeRateService.Convert(documentMatching.CurrencyCode, statutoryCurrencyCode, Math.Round(documentMatching.AmountToBePaid, roundValue, MidpointRounding.AwayFromZero), GetDateForROE(documentMatching))).ConvertedValue
                    : documentMatching.AmountToBePaid;
                }
                else
                {
                    documentMatching.CashLineAmountInFunctionalCurrency = AmountConverter.ConvertAmountThroughIntermediateRoeToUSD(
                        documentMatching.AmountToBePaid,
                        fxRateDocumentCurrency.Rate.Value,
                        fxRateDocumentCurrency.CurrencyRoeType,
                        fxRateFunctionalCurrency.Rate.Value,
                        fxRateFunctionalCurrency.CurrencyRoeType,
                        2);
                    documentMatching.CashLineAmountInStatutoryCurrency = AmountConverter.ConvertAmountThroughIntermediateRoeToUSD(
                        documentMatching.AmountToBePaid,
                        fxRateDocumentCurrency.Rate.Value,
                        fxRateDocumentCurrency.CurrencyRoeType,
                        fxRateStatutoryCurrency.Rate.Value,
                        fxRateStatutoryCurrency.CurrencyRoeType,
                        2);
                }
            }
        }

        private static DateTime? GetDateForROE(DocumentMatching documentToMatch)
        {
            if (documentToMatch.SourceCashLineId.HasValue || documentToMatch.SourceJournalLineId.HasValue)
            {
                return documentToMatch.DocumentDate;
            }
            else if (documentToMatch.SourceInvoiceId.HasValue)
            {
                return documentToMatch.InvoiceGLDate;
            }

            return null;
        }

        private static PhysicalDocumentType MapCashSelectionTypeToPhysicalDocumentType(CashSelectionType cashSelectionType)
        {
            switch (cashSelectionType)
            {
                case CashSelectionType.SimpleCashPayment:
                case CashSelectionType.SimpleCashReceipt:
                    return PhysicalDocumentType.CashSimpleCash;
                case CashSelectionType.PaymentFullPartialTransaction:
                case CashSelectionType.ReceiptFullPartialTransaction:
                    return PhysicalDocumentType.CashPickByTransaction;
                case CashSelectionType.PaymentDifferentCurrency:
                case CashSelectionType.ReceiptDifferentCurrency:
                    return PhysicalDocumentType.CashDifferentCurrency;
                case CashSelectionType.PaymentDifferentClient:
                    return PhysicalDocumentType.CashDifferentClient;
                default:
                    throw new AtlasTechnicalException($"Invalid cash selection type: {cashSelectionType}");
            }
        }

        private static IEnumerable<CashLine> GenerateCashLinesCashByPicking(IEnumerable<DocumentMatching> documentMatching, DirectionType cashDirectionType)
        {
            List<CashLine> cashLines = new List<CashLine>();

            foreach (var document in documentMatching)
            {
                int sign = CalculateSignForCashDocumentMatching(cashDirectionType, (MasterDocumentType)document.TransactionDocumentTypeId);
                decimal? amount = document.AmountToBePaid * sign;
                decimal? cashFunctionalCurrencyAmount = document.CashLineAmountInFunctionalCurrency * sign;
                decimal? cashStatutoryCurrencyAmount = document.CashLineAmountInStatutoryCurrency * sign;
                var cashLine = new CashLine
                {
                    DepartmentId = document.DepartmentId,
                    TransactionDirectionId = document.TransactionDirectionId,
                    Amount = amount,
                    AmountInFunctionalCurrency = cashFunctionalCurrencyAmount,
                    AmountInStatutoryCurrency = cashStatutoryCurrencyAmount,
                    InitiallyMatchedJournalLineId = document.SourceJournalLineId,
                    InitiallyMatchedCashLineId = document.SourceCashLineId,
                    InitiallyMatchedInvoiceId = document.SourceInvoiceId
                };
                cashLines.Add(cashLine);
            }

            return cashLines;
        }

        private async Task CheckCashEditionAccessRights(long cashTypeid, int? traxStatus)
        {
            // A custom handler is a better way \\

            var isSimpleCashPaymentType = cashTypeid == 1;
            var isFullPartialCashPaymentType = cashTypeid == 2;
            var isCurrencyCashPaymentType = cashTypeid == 3;
            var isClientCashPaymentType = cashTypeid == 4;
            var isSimpleReceiptPaymentType = cashTypeid == 5;
            var isFullPartialReceiptPaymentType = cashTypeid == 6;
            var isCurrencyReceiptPaymentType = cashTypeid == 7;

            bool isTraxReadOnly = true;
            if (traxStatus.HasValue &&
                   (traxStatus == (int)InterfaceStatus.ReadyToTransmit ||
                    traxStatus == (int)InterfaceStatus.StandBy ||
                    traxStatus == (int)InterfaceStatus.TransmitError ||
                    traxStatus == (int)InterfaceStatus.Error ||
                    traxStatus == (int)InterfaceStatus.Rejected))
            {
                isTraxReadOnly = false;
            }

            ClaimsPrincipal user = _identityService.GetUser();
            var authorizationCashPaymentSimplePolicy = await _authorizationService.AuthorizeAsync(user, null, Policies.CashPaymentSimplePolicy);
            var authorizationCashPaidFullPartialPolicy = await _authorizationService.AuthorizeAsync(user, null, Policies.CashPaidFullPartialPolicy);
            var authorizationCashPaidDifferentCurrencyPolicy = await _authorizationService.AuthorizeAsync(user, null, Policies.CashPaidDifferentCurrencyPolicy);
            var authorizationCashPaidDifferentClientPolicy = await _authorizationService.AuthorizeAsync(user, null, Policies.CashPaidDifferentClientPolicy);
            var authorizationCashReceiptSimplePolicy = await _authorizationService.AuthorizeAsync(user, null, Policies.CashReceiptSimplePolicy);
            var authorizationCashReceiptFullPartialPolicy = await _authorizationService.AuthorizeAsync(user, null, Policies.CashReceiptFullPartialPolicy);
            var authorizationCashReceiptDifferentCurrencyPolicy = await _authorizationService.AuthorizeAsync(user, null, Policies.CashReceiptDifferentCurrencyPolicy);
            var authorizationCashReceiptTraxPolicy = await _authorizationService.AuthorizeAsync(user, null, Policies.CashReceiptTraxPolicy);


            // Create cash
            if ((!authorizationCashPaymentSimplePolicy.Succeeded && isSimpleCashPaymentType)
                || (!authorizationCashPaidFullPartialPolicy.Succeeded && isFullPartialCashPaymentType)
                || (!authorizationCashPaidDifferentCurrencyPolicy.Succeeded && isCurrencyCashPaymentType)
                || (!authorizationCashPaidDifferentClientPolicy.Succeeded && isClientCashPaymentType)
                || (!authorizationCashReceiptSimplePolicy.Succeeded && isSimpleReceiptPaymentType)
                || (!authorizationCashReceiptFullPartialPolicy.Succeeded && isFullPartialReceiptPaymentType)
                || (!authorizationCashReceiptDifferentCurrencyPolicy.Succeeded && isCurrencyReceiptPaymentType))
            {
                throw new AtlasSecurityException("One or more privileges are required to perform this action.");
            }
            else if (traxStatus.HasValue && isTraxReadOnly && !authorizationCashReceiptTraxPolicy.Succeeded)
            {
                throw new AtlasSecurityException("You cannot update this cash because the trax status is read-only.");
            }
        }

        /// <summary>
        /// Generates the sign of matching of a document type in a cash by picking
        /// </summary>
        /// <param name="cashType">CashType</param>
        /// <param name="documentType">Document Type</param>
        /// <returns> Sign for single cash</returns>
        private static int CalculateSignForCashDocumentMatching(DirectionType cashType, MasterDocumentType documentType)
        {
            switch (documentType)
            {
                case MasterDocumentType.SI:
                case MasterDocumentType.JL:
                case MasterDocumentType.DN:
                case MasterDocumentType.CP:
                
                    return cashType == DirectionType.Payment ? -1 : 1;
                case MasterDocumentType.PI:
                case MasterDocumentType.CN:
                case MasterDocumentType.CI:
                    return cashType == DirectionType.Payment ? 1 : -1;
                default:
                    throw new AtlasBusinessException($"The document type {documentType} is not handle by the cash creation.");
            }
        }
        #endregion

        #region unused - to be deleted after final code validation
        private IEnumerable<DocumentMatching> GenerateDocumentMatchingOfJournalLines(ManualJournalDocument manualJournalDocument)
        {
            var documentMatchings = new List<DocumentMatching>();
            var manualJournalDocumentList = manualJournalDocument.ManualJournalLines.ToList();

            for (int i = 0; i < manualJournalDocumentList.Count; i++)
            {
                var documentMatchingItem = new DocumentMatching()
                {
                    TransactionDocumentId = manualJournalDocument.TransactionDocumentId,
                    Amount = manualJournalDocumentList[i].Amount,
                    ValueDate = manualJournalDocument.ValueDate,
                    DepartmentId = manualJournalDocumentList[i].DepartmentId,
                    TransactionDirectionId = manualJournalDocumentList[i].Amount > 0 ? (int)TransactionDirection.Pay : (int)TransactionDirection.Recieve,
                };

                // Line number is always
                // even number for the JLs of cash's counterparty
                // odd number for the JLs of matched document's counterparty
                if (manualJournalDocumentList[i].LineNumber % 2 == 0)
                {
                    // Cash's counterpary part
                    documentMatchingItem.SourceJournalLineId = manualJournalDocumentList[i].JournalLineId;
                    documentMatchingItem.MatchedCashLineId = manualJournalDocumentList[i - 1].JournalLineId;
                }
                else
                {
                    // Matched counterparty part
                    documentMatchingItem.SourceJournalLineId = manualJournalDocumentList[i].JournalLineId;
                    documentMatchingItem.MatchedCashLineId = manualJournalDocumentList[i + 1].JournalLineId;
                }

                documentMatchings.Add(documentMatchingItem);
            }

            return documentMatchings;
        }
        #endregion

        #region doc generation
        internal Func<byte[], IWordDocument> GetWordDocument
        {
            get { return _getWordDocument ?? ((b) => { return new WordDocument(b); }); }
            set => _getWordDocument = value;
        }

        private async Task GeneratePhysicalDocument(CreateCashCommand request, Cash cash)
        {
            var companyDate = await _systemDateTimeService.GetCompanyDate(request.CompanyId);

            // We create a physical document based on the specified template
            if (request.PhysicalDocumentId == null && request.Template != null)
            {
                var documentId = await GenerateCashDocument(request, cash, companyDate, false);

                cash.PhysicalDocumentId = documentId;

                if (!request.IsDraft)
                {
                    // Update cash in DB with document Id
                    await _cashRepository.UpdateCashPhysicalDocument(cash.CashId, documentId);
                }
            }

            // The user has provided a document (via previous upload)
            else if (!request.IsDraft && request.PhysicalDocumentId != null)
            {
                // Load user document from DB
                var document = await _physicalDocumentStorageService.DownloadDraftDocumentByIdAsync(request.PhysicalDocumentId.Value);

                if (document?.FileContent == null)
                {
                    throw new NotFoundException("PhysicalDocument", request.PhysicalDocumentId.Value);
                }

                var wordHelper = GetWordDocument(document.FileContent);

                // Check if the document is valid
                CheckDocumentValidity(document, cash, wordHelper);

                // Replace document placeholder with cash document reference
                var isMatch = wordHelper.SearchAndReplace(System.Text.RegularExpressions.Regex.Escape("[DOCUMENT_REFERENCE]"), cash.DocumentReference);

                if (!isMatch)
                {
                    throw new AtlasBusinessException("The selected document format does not allow to add the document reference. The cash has not been created. Please repeat the operation with another document or choose another option.");
                }

                var physicalDocumentType = MapCashSelectionTypeToPhysicalDocumentType((CashSelectionType)cash.ChildCashTypeId);

                // Add metadata inside the document
                wordHelper.AddCustomXmlPart(new CashDocumentMetadata { CashId = cash.CashId, Company = cash.CompanyId, UserName = _identityService.GetUserName() });

                var documentName = $"{companyDate.ToString("yyyyMMdd_HHMMss", CultureInfo.InvariantCulture)}_{cash.CompanyId}_{Enum.GetName(typeof(CashSelectionType), cash.ChildCashTypeId)}_{cash.CounterPartyCode}{document.DocumentExtension}";

                var table = (await _applicationTableQueries.GetApplicationTablesAsync(physicalDocumentType.GetApplicationTableName())).FirstOrDefault();

                if (table == null)
                {
                    throw new AtlasBusinessException($"Table \"{physicalDocumentType.GetApplicationTableName()}\" not found in application tables.");
                }

                // Save the document in DB
                var documentId = await _physicalDocumentStorageService.UploadDocument(new UploadDocumentParameters
                {
                    CompanyId = request.CompanyId,
                    DocumentName = documentName,
                    File = wordHelper.GetFile(),
                    DocumentTemplatePath = document.DocumentTemplate,
                    PhysicalDocumentTypeId = physicalDocumentType,
                    PhysicalDocumentStatus = PhysicalDocumentStatus.New,
                    RecordId = cash.CashId,
                    TableId = await GetApplicationTableId(physicalDocumentType),
                });

                cash.PhysicalDocumentId = documentId;

                // Update cash in DB with document Id
                await _cashRepository.UpdateCashPhysicalDocument(cash.CashId, documentId);

                // Generate the preview document
                var previewDocumentId = await GenerateCashDocument(request, cash, companyDate, true);

                cash.PhysicalDocumentId = documentId;
            }
        }
        #endregion

        #region Message enqueuing
        private async Task EnqueueTraxPaymentMessage(Cash cash)
        {
            // Record to insert into ProcessMessage table to Send the Cash Payment to TRAX
            if (cash.CostDirectionId == (int)DirectionType.Payment && cash.ToTransmitToTreasury)
            {
                var sendTraxMessage = new JObject(
                  new JProperty("cashDocumentRef", cash.DocumentReference),
                  new JProperty("cashId", cash.CashId),
                  new JProperty("transactionDocumentId", cash.TransactionDocumentId),
                  new JProperty("companyId", cash.CompanyId),
                  new JProperty("businessApplicationType", BusinessApplicationType.TRAX));

                await _processMessageService.SendMessage(new ProcessMessage
                {
                    ProcessTypeId = (int)ProcessType.AtlasPaymentRequestInterfaceProcessor,
                    CompanyId = cash.CompanyId,
                    Content = sendTraxMessage.ToString()
                });
            }
        }

        private async Task EnqueueAccountingDocumentCreation(string companyCode, long transactionDocumentId)
        {
            var authorizationResult = await _authorizationService.AuthorizeAsync(_identityService.GetUser(), Policies.PostOpClosedPolicy);

            var content = new JObject();
            content.Add(new JProperty("docId", transactionDocumentId));
            content.Add(new JProperty("postOpClosedPolicy", authorizationResult.Succeeded));

            // Send the message to generate the accounting document
            ProcessMessage message = new ProcessMessage​
            {
                ProcessTypeId = (int)ProcessType.AtlasAccountingDocumentProcessor,
                CompanyId = companyCode,
                Content = content.ToString(),
            };

            await _processMessageService.SendMessage(message);
        }

        private async Task ReplaceTransactionDocumentIdsInLogs(string companyCode, OldNewId oldNewId, long newTransactionDocumentId)
        {
            List<OldNewId> oldNewIds = new List<OldNewId>();
            oldNewId.NewTransactionDocumentId = newTransactionDocumentId;
            oldNewIds.Add(oldNewId);
            await _cashRepository.ReplaceTransactionDocumentIdsInLogs(companyCode, oldNewIds);
        }
        #endregion
    }
}
