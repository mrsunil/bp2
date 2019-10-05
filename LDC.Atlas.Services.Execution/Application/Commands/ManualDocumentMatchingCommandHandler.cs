using AutoMapper;
using LDC.Atlas.Application.Core.Entities;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.Services;
using LDC.Atlas.MasterData.Common;
using LDC.Atlas.MasterData.Common.Entities;
using LDC.Atlas.Services.Execution.Application.Queries;
using LDC.Atlas.Services.Execution.Application.Queries.Dto;
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
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Application.Commands
{
    public class ManualDocumentMatchingCommandHandler : IRequestHandler<CreateManualDocumentMatchingCommand, ManualDocumentMatchingRecord>,
                                                        IRequestHandler<UnmatchManualDocumentMatchingCommand, ManualDocumentMatchingRecord>,
                                                        IRequestHandler<UpdateDocumentMatchingCommand>
    {
        private readonly ILogger<ManualDocumentMatchingCommandHandler> _logger;
        private readonly IIdentityService _identityService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IManualDocumentMatchingRepository _manualDocumentMatchingRepository;
        private readonly IManualDocumentMatchingQueries _manualDocumentMatchingQueries;
        private readonly ITransactionDocumentQueries _transactionDocumentQueries;
        private readonly ITransactionDocumentRepository _transactionDocumentRepository;
        private readonly IMasterDataService _masterDataService;
        private readonly ISystemDateTimeService _systemDateTimeService;
        private readonly IForeignExchangeRateService _foreignExchangeRateService;
        private readonly IMapper _mapper;
        private readonly IProcessMessageService _processMessageService;
        private readonly IAuthorizationService _authorizationService;

        public ManualDocumentMatchingCommandHandler(
            ILogger<ManualDocumentMatchingCommandHandler> logger,
            IIdentityService identityService,
            IMasterDataService masterDataService,
            IUnitOfWork unitOfWork,
            IManualDocumentMatchingRepository manualDocumentMatchingRepository,
            IManualDocumentMatchingQueries manualDocumentMatchingQueries,
            ITransactionDocumentQueries transactionDocumentQueries,
            ITransactionDocumentRepository transactionDocumentRepository,
            ISystemDateTimeService systemDateTimeService,
            IForeignExchangeRateService foreignExchangeRateService,
            IProcessMessageService processMessageService,
            IMapper mapper,
            IAuthorizationService authorizationService)
        {
            _manualDocumentMatchingRepository = manualDocumentMatchingRepository ?? throw new ArgumentNullException(nameof(manualDocumentMatchingRepository));
            _manualDocumentMatchingQueries = manualDocumentMatchingQueries ?? throw new ArgumentNullException(nameof(manualDocumentMatchingQueries));
            _transactionDocumentQueries = transactionDocumentQueries ?? throw new ArgumentNullException(nameof(transactionDocumentQueries));
            _transactionDocumentRepository = transactionDocumentRepository ?? throw new ArgumentNullException(nameof(transactionDocumentRepository));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _systemDateTimeService = systemDateTimeService ?? throw new ArgumentNullException(nameof(systemDateTimeService));
            _masterDataService = masterDataService;
            _foreignExchangeRateService = foreignExchangeRateService;
            _processMessageService = processMessageService ?? throw new ArgumentNullException(nameof(processMessageService));
            _authorizationService = authorizationService ?? throw new ArgumentNullException(nameof(authorizationService));
        }

        /// <summary>
        /// Handles the creation of a manual document matching
        /// </summary>
        /// <param name="request">request</param>
        /// <param name="cancellationToken">cancellationToken</param>
        public async Task<ManualDocumentMatchingRecord> Handle(CreateManualDocumentMatchingCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                var manualDocumentMatchingRecord = _mapper.Map<ManualDocumentMatchingRecord>(request);

                var matchableDocumentIds = new List<MatchableSourceIdDto>();

                // Getting the information for the documents that we want to match
                // We get mostly the rates of exchange which have been fixed during the posting of these documents
                foreach (var document in manualDocumentMatchingRecord.DocumentMatchings)
                {
                    matchableDocumentIds.Add(new MatchableSourceIdDto() { SourceCashLineId = document.SourceCashLineId, SourceInvoiceId = document.SourceInvoiceId, SourceJournalLineId = document.SourceJournalLineId });
                }

                var matchableDocumentsSummaryInformation = await _manualDocumentMatchingQueries.GetMatchableDocumentsSummaryInformation(
                        request.Company,
                        matchableDocumentIds);

                // Rebuilding a complete list of records to be pushed as a parameter of the "create match" SP
                List<DocumentMatching> documentMatchingRecords = new List<DocumentMatching>();
                foreach (var documentMatchingRecord in manualDocumentMatchingRecord.DocumentMatchings)
                {
                    DocumentMatching documentMatching = new DocumentMatching();
                    documentMatching.TransactionDocumentId = documentMatchingRecord.TransactionDocumentId;

                    // There is a complete mismatch into the names used in the exchange with the
                    // app (documentmatching.Amount is the full document amount), and the one
                    // understood by the DB (documentmatching.Amount is the amount matched in the doc matching)
                    // The right solution should be to use different classes...
                    documentMatching.Amount = documentMatchingRecord.DocumentAmount;

                    var matchableDocumentSummaryInformation = matchableDocumentsSummaryInformation
                        .Where(d => d.TransactionDocumentId == documentMatchingRecord.TransactionDocumentId).FirstOrDefault();
                    switch ((MasterDocumentType)matchableDocumentSummaryInformation.TransactionDocumentTypeId)
                    {
                        case MasterDocumentType.PI:
                        case MasterDocumentType.CN:
                        case MasterDocumentType.CP:
                            documentMatching.TransactionDirectionId = (int)TransactionDirection.Pay;
                            break;
                        case MasterDocumentType.SI:
                        case MasterDocumentType.DN:
                        case MasterDocumentType.CI:
                            documentMatching.TransactionDirectionId = (int)TransactionDirection.Recieve;
                            break;
                        case MasterDocumentType.JL:
                            documentMatching.TransactionDirectionId = documentMatching.DocumentAmount > 0 ?
                                (int)TransactionDirection.Pay : (int)TransactionDirection.Recieve;
                            break;
                        default:
                            // We should not be there...
                            break;
                    }

                    switch ((MasterDocumentType)matchableDocumentSummaryInformation.TransactionDocumentTypeId)
                    {
                        case MasterDocumentType.PI:
                        case MasterDocumentType.CN:
                        case MasterDocumentType.CI:
                            documentMatching.SigningFactor = -1;
                            break;
                        case MasterDocumentType.CP:
                        case MasterDocumentType.SI:
                        case MasterDocumentType.DN:
                        case MasterDocumentType.JL:
                            documentMatching.SigningFactor = 1;
                            break;
                    }

                    documentMatching.TransactionDocumentTypeId = documentMatchingRecord.TransactionDocumentTypeId;
                    documentMatching.DepartmentId = documentMatchingRecord.DepartmentId;
                    documentMatching.DocumentDate = documentMatchingRecord.DocumentDate;
                    decimal? matchedAmount = documentMatching.Amount;

                    // Calculation of the statutory / fct ccy amounts for the document matching
                    if (matchedAmount == matchableDocumentSummaryInformation.UnmatchedAmount)
                    {
                        // In the case we are fully matching the document, we set the statutory & functional matched amounts
                        // to the value of the remaining unmatched amount. This way, we are sure that, in the case a document has
                        // multiple matchings, the sum of the matched amounts in statutory & fct ccies are = to the total amount
                        // in these ccies
                        documentMatching.StatutoryCcyAmount = matchableDocumentSummaryInformation.UnmatchedAmountInStatutoryCurrency;
                        documentMatching.FunctionalCcyAmount = matchableDocumentSummaryInformation.UnmatchedAmountInFunctionalCurrency;
                    }
                    else
                    {
                        // We are not fully matching the matchable document.
                        // Calculate the statutory & functional currencies based on the rate of exchange stored
                        // in the transaction document which is matched, at the time of its posting
                        // NOTE THAT the unmatched ccies will be updated by a SP called when saving the document matching
                        documentMatching.StatutoryCcyAmount = AmountConverter.ConvertAmountThroughIntermediateRoeToUSD(
                            documentMatching.Amount.Value,
                            matchableDocumentSummaryInformation.RoeDocumentCurrency,
                            matchableDocumentSummaryInformation.RoeDocumentCurrencyType,
                            matchableDocumentSummaryInformation.RoeStatutoryCurrency,
                            matchableDocumentSummaryInformation.RoeStatutoryCurrencyType,
                            2);
                        documentMatching.FunctionalCcyAmount = AmountConverter.ConvertAmountThroughIntermediateRoeToUSD(
                               documentMatching.Amount.Value,
                               matchableDocumentSummaryInformation.RoeDocumentCurrency,
                               matchableDocumentSummaryInformation.RoeDocumentCurrencyType,
                               matchableDocumentSummaryInformation.RoeFunctionalCurrency,
                               matchableDocumentSummaryInformation.RoeFunctionalCurrencyType,
                               2);
                    }

                    documentMatching.IsCreditOrDebit = documentMatchingRecord.IsCreditOrDebit;
                    if (documentMatchingRecord.LineId == 0)
                    {
                        documentMatching.LineId = null;
                    }
                    else
                    {
                        documentMatching.LineId = documentMatchingRecord.LineId;
                    }

                    documentMatching.Credit = documentMatchingRecord.Credit;
                    documentMatching.Debit = documentMatchingRecord.Debit;
                    documentMatching.SourceCashLineId = documentMatchingRecord.SourceCashLineId == 0 ? null : documentMatchingRecord.SourceCashLineId;
                    documentMatching.SourceInvoiceId = documentMatchingRecord.SourceInvoiceId == 0 ? null : documentMatchingRecord.SourceInvoiceId;
                    documentMatching.SourceJournalLineId = documentMatchingRecord.SourceJournalLineId == 0 ? null : documentMatchingRecord.SourceJournalLineId;
                    documentMatchingRecords.Add(documentMatching);
                }

                // Saving the matchflag in the database
                manualDocumentMatchingRecord.DocumentMatchings = documentMatchingRecords;
                var matchingRecord = await _manualDocumentMatchingRepository.CreateUpdateDocumentMatching(manualDocumentMatchingRecord);
                manualDocumentMatchingRecord.MatchFlagCode = matchingRecord.MatchFlagCode;
                manualDocumentMatchingRecord.MatchFlagId = matchingRecord.MatchFlagId;

                // Calculating the sums of the fct & statut ccy amounts for all the documents, to check if they are = 0 or not
                // This will determine the need for a reval record
                var sumsByDepartmentAndDirection = documentMatchingRecords.GroupBy(d => new { d.DepartmentId, d.TransactionDirectionId })
                  .Select(g => new
                  {
                      g.Key.DepartmentId,
                      g.Key.TransactionDirectionId,
                      Amount = g.Sum(s => s.Amount * s.SigningFactor),
                      FunctionalCcyAmount = g.Sum(s => s.FunctionalCcyAmount * s.SigningFactor),
                      StatutoryCcyAmount = g.Sum(s => s.StatutoryCcyAmount * s.SigningFactor),
                  }).ToList();

                if (sumsByDepartmentAndDirection.Any(sum => sum.FunctionalCcyAmount != 0 || sum.StatutoryCcyAmount != 0))
                {
                    // Need to create a reval document
                    // Note that reval documents are created (for cash by picking) at posting time of the cbp
                    var revaluationInformation = await _transactionDocumentRepository.CreateRevaluation(
                        request.Company,
                        null,
                        request.CurrencyCode,
                        matchingRecord.MatchFlagId.Value,
                        request.PaymentDocumentDate,
                        request.PaymentDocumentDate,
                        request.PaymentDocumentDate);
                    await EnqueueMessageForAccountingDocumentCreation(revaluationInformation.TransactionDocumentId, request.Company);
                    manualDocumentMatchingRecord.ReversalRevalJournalCode = revaluationInformation.DocumentReference;
                }

                _unitOfWork.Commit();
                _logger.LogInformation("Document match created with match id {Atlas.MatchFlagId}.", manualDocumentMatchingRecord.MatchFlagId.Value);
                return manualDocumentMatchingRecord;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        private async Task EnqueueMessageForAccountingDocumentCreation(long transactionDocumentId, string company)
        {
            var authorizationResult = await _authorizationService.AuthorizeAsync(_identityService.GetUser(), Policies.PostOpClosedPolicy);

            var content = new JObject();
            content.Add(new JProperty("docId", transactionDocumentId));
            content.Add(new JProperty("postOpClosedPolicy", authorizationResult.Succeeded));
            ProcessMessage message = new ProcessMessage​
            {
                ProcessTypeId = (int)ProcessType.AtlasAccountingDocumentProcessor,
                CompanyId = company,
                Content = content.ToString(),
            };

            await _processMessageService.SendMessage(message);
        }

        public async Task<Unit> Handle(UpdateDocumentMatchingCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                var updateDocumentMatchingRecord = _mapper.Map<ManualDocumentMatchingRecord>(request);

                await _manualDocumentMatchingRepository.UpdateDocumentAsync(updateDocumentMatchingRecord);

                _unitOfWork.Commit();
                _logger.LogInformation("Document with match flag id {Atlas_matchFlagId} updated", request.MatchFlagId);
                return Unit.Value;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        /// <summary>
        /// Handling of the unmatching of a match (whichever a manual or the result of a cash by picking)
        /// </summary>
        /// <param name="request">request</param>
        /// <param name="cancellationToken">cancellationToken</param>
        public async Task<ManualDocumentMatchingRecord> Handle(UnmatchManualDocumentMatchingCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                long? revalutionTransactionDocId = await _manualDocumentMatchingRepository.DeleteMatchFlag(
                   request.MatchFlagId, request.Company);

                string documentReference = string.Empty;

                if (revalutionTransactionDocId != null)
                {
                    var companyDate = await _systemDateTimeService.GetCompanyDate(request.Company);

                    // A revaluation exists => we have to create a reversal for it
                    int refNumberToCreateForReversal = await _transactionDocumentQueries.GetNextTransactionDocumentReferenceValues(
                        request.Company,
                        (int)MasterDocumentType.JL, // The type of document for reversal is JL
                        companyDate.Year);

                    // Calculate the document reference
                        documentReference = string.Concat(
                        MasterDocumentType.JL,
                        companyDate.Year - 2000,
                        string.Format(CultureInfo.InvariantCulture, "{0:D5}", refNumberToCreateForReversal));

                    var reversalTransactionDocumentId = await _transactionDocumentRepository.ReverseDocument(
                        revalutionTransactionDocId.Value,
                        request.Company,
                        companyDate.Year,
                        refNumberToCreateForReversal,
                        documentReference,
                        companyDate);

                    var authorizationResult = await _authorizationService.AuthorizeAsync(_identityService.GetUser(), Policies.PostOpClosedPolicy);

                    var content = new JObject();
                    content.Add(new JProperty("docId", reversalTransactionDocumentId));
                    content.Add(new JProperty("postOpClosedPolicy", authorizationResult.Succeeded));

                    // Requesting the creation of the corresponding accounting document
                    await _processMessageService.SendMessage(new ProcessMessage​
                    {
                        ProcessTypeId = (int)ProcessType.AtlasAccountingDocumentProcessor,
                        CompanyId = request.Company,
                        Content = content.ToString(),
                    });
                }

                _unitOfWork.Commit();
                _logger.LogInformation("Match Flag Deleted");

                return revalutionTransactionDocId == null ? null : new ManualDocumentMatchingRecord() { ReversalRevalJournalCode = documentReference };
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }
    }
}
