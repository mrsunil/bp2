using LDC.Atlas.MasterData.Common.Entities;
using LDC.Atlas.Services.Execution.Entities;
using System.Collections.Generic;
using System.Linq;

namespace LDC.Atlas.Services.Execution.Application.Commands
{
    public partial class CreateCashCommandHandler
    {
        private static void GenerateInformationForCashByPickingDiffClient(
            Cash cash,
            out IEnumerable<ManualJournalLine> counterpartyTransferJournalLines,
            out SortedList<int, DocumentMatching> linkBetweenJournalLineNumberAndDM,
            out MatchFlag matchFlagCpForMatchedDocument,
            out MatchFlag matchFlagCpForCash,
            CostType fxRealCostType)
        {
            linkBetweenJournalLineNumberAndDM = new SortedList<int, DocumentMatching>();
            var counter = 1;
            var manualJournalLines = new List<ManualJournalLine>();

            matchFlagCpForMatchedDocument = new MatchFlag()
            {
                CompanyId = cash.CompanyId,
                CounterPartyCode = cash.CounterPartyCode,
                // Apparently, the only way to get the counterparty of the matched documents is in the document matching
                CounterPartyId = cash.DocumentMatchings.First().MatchingCounterpartyId,
                CurrencyCode = cash.CurrencyCode,
                IsPrematch = true,
                PaymentDocumentDate = cash.DocumentDate,
                DocumentMatchings = new List<DocumentMatching>(),
            };
            matchFlagCpForCash = new MatchFlag()
            {
                CashIdOfCashByPicking = cash.CashId,
                CompanyId = cash.CompanyId,
                CounterPartyCode = cash.CounterPartyCode,
                CounterPartyId = cash.CounterPartyId,
                CurrencyCode = cash.CurrencyCode,
                IsPrematch = true,
                PaymentDocumentDate = cash.DocumentDate,
                DocumentMatchings = new List<DocumentMatching>()
            };

            foreach (var documentMatching in cash.DocumentMatchings)
            {
                var cashLine = cash.CashLines.ToList().Find(cl =>
                    ((cl.InitiallyMatchedInvoiceId.HasValue && documentMatching.SourceInvoiceId.HasValue) && cl.InitiallyMatchedInvoiceId.Value == documentMatching.SourceInvoiceId.Value)
                    || ((cl.InitiallyMatchedCashLineId.HasValue && documentMatching.SourceCashLineId.HasValue) && cl.InitiallyMatchedCashLineId.Value == documentMatching.SourceCashLineId.Value)
                    || ((cl.InitiallyMatchedJournalLineId.HasValue && documentMatching.SourceJournalLineId.HasValue) && cl.InitiallyMatchedJournalLineId.Value == documentMatching.SourceJournalLineId.Value));

                linkBetweenJournalLineNumberAndDM[counter] = documentMatching;

                // dm for the matched object
                matchFlagCpForMatchedDocument.DocumentMatchings.Add(new DocumentMatching()
                {
                    TransactionDocumentId = documentMatching.TransactionDocumentId,
                    MatchedAmount = documentMatching.AmountToBePaid,
                    ValueDate = documentMatching.InvoiceGLDate ?? documentMatching.DocumentDate,
                    DepartmentId = documentMatching.DepartmentId,
                    TransactionDirectionId = documentMatching.TransactionDirectionId,
                    AmountInFunctionalCurrency = documentMatching.AmountInFunctionalCurrency,
                    AmountInStatutoryCurrency = documentMatching.AmountInStatutoryCurrency,
                    SecondaryDocumentReferenceId = cash.TransactionDocumentId,
                    SourceCashLineId = documentMatching.SourceCashLineId,
                    SourceInvoiceId = documentMatching.SourceInvoiceId,
                    SourceJournalLineId = documentMatching.SourceJournalLineId,
                    MatchedCashLineId = cashLine?.CashLineId,
                    PaymentDocumentDate = cash.DocumentDate
                });

                int signForAccountingDocuments = 1; // Depends on the matched document
                switch ((MasterDocumentType)documentMatching.TransactionDocumentTypeId)
                {
                    case MasterDocumentType.CP:
                    case MasterDocumentType.SI:
                    case MasterDocumentType.DN:
                    case MasterDocumentType.JL:
                        signForAccountingDocuments = -1;
                        break;
                    case MasterDocumentType.CI:
                    case MasterDocumentType.PI:
                    case MasterDocumentType.CN:
                        signForAccountingDocuments = 1;
                        break;
                }

                // dm for the journal - 'removal' from customer 1
                var jlDM = new DocumentMatching()
                {
                    TransactionDocumentId = null, // Will be set later, to represent one of the JL lines
                    MatchedAmount = documentMatching.AmountToBePaid * signForAccountingDocuments,
                    ValueDate = documentMatching.InvoiceGLDate ?? documentMatching.DocumentDate,
                    DepartmentId = documentMatching.DepartmentId,
                    TransactionDirectionId = documentMatching.TransactionDirectionId,
                    AmountInFunctionalCurrency = documentMatching.AmountInFunctionalCurrency * signForAccountingDocuments,
                    AmountInStatutoryCurrency = documentMatching.AmountInStatutoryCurrency * signForAccountingDocuments,
                    SecondaryDocumentReferenceId = cash.TransactionDocumentId,
                    PaymentDocumentDate = cash.DocumentDate
                };
                matchFlagCpForMatchedDocument.DocumentMatchings.Add(jlDM);
                linkBetweenJournalLineNumberAndDM[counter] = jlDM;

                // Creation of the manual journal which must have the exact same amounts than the document matching
                var matchedCounterpartyJL = new ManualJournalLine()
                {
                    ClientAccountId = cash.MatchingCounterpartyId,
                    AssociatedAccountId = cash.MatchingCounterpartyId,
                    AccountLineTypeId = documentMatching.AccountLineTypeId,
                    Amount = documentMatching.AmountToBePaid * signForAccountingDocuments,
                    Narrative = documentMatching.Narrative,
                    DepartmentId = cash.DepartmentId,

                    // On Diff Client, SecondaryDocuementReference should be the reference to the cash
                    SecondaryDocumentReference = cash.DocumentReference,

                    ExternalDocumentReference = documentMatching.ExternalReference,
                    CharterId = null,
                    SectionId = null,
                    LineNumber = counter++,
                    CostTypeId = fxRealCostType.CostTypeId
                };

                manualJournalLines.Add(matchedCounterpartyJL);

                // dm of the cash
                decimal? signedAmountForCash = documentMatching.AmountToBePaid * CalculateSignForCashDocumentMatching(
                    (DirectionType)cash.CashTypeId, (MasterDocumentType)documentMatching.TransactionDocumentTypeId);
                matchFlagCpForCash.DocumentMatchings.Add(new DocumentMatching()
                {
                    TransactionDocumentId = cash.TransactionDocumentId,
                    MatchedAmount = cashLine.Amount.Value, // The cashline contains the signed value
                    ValueDate = cash.DocumentDate,
                    DepartmentId = documentMatching.DepartmentId,
                    TransactionDirectionId = documentMatching.TransactionDirectionId,
                    AmountInFunctionalCurrency = cashLine?.AmountInFunctionalCurrency, // The cashline contains the signed value
                    AmountInStatutoryCurrency = cashLine?.AmountInStatutoryCurrency, // The cashline contains the signed value
                    SecondaryDocumentReferenceId = documentMatching.TransactionDocumentId,
                    SourceCashLineId = cashLine?.CashLineId,
                    MatchedJournalLineId = documentMatching.SourceJournalLineId,
                    MatchedCashLineId = documentMatching.SourceCashLineId,
                    MatchedInvoiceId = documentMatching.SourceInvoiceId,
                    PaymentDocumentDate = cash.DocumentDate
                });

                // Second dm for the journal
                jlDM = new DocumentMatching()
                {
                    TransactionDocumentId = null, // Will be set later, to represent one of the JL lines
                    MatchedAmount = documentMatching.AmountToBePaid * signForAccountingDocuments * -1,
                    ValueDate = cash.DocumentDate,
                    DepartmentId = documentMatching.DepartmentId,
                    TransactionDirectionId = documentMatching.TransactionDirectionId,
                    AmountInFunctionalCurrency = documentMatching.AmountInFunctionalCurrency * signForAccountingDocuments * -1, // The cashline contains the signed value
                    AmountInStatutoryCurrency = documentMatching.AmountInStatutoryCurrency * signForAccountingDocuments * -1, // The cashline contains the signed value
                    SecondaryDocumentReferenceId = documentMatching.TransactionDocumentId,
                    PaymentDocumentDate = cash.DocumentDate
                };
                matchFlagCpForCash.DocumentMatchings.Add(jlDM);
                linkBetweenJournalLineNumberAndDM[counter] = jlDM;

                var cashCounterpartyJL = new ManualJournalLine()
                {
                    ClientAccountId = cash.PaymentCounterpartyId,
                    AssociatedAccountId = cash.PaymentCounterpartyId,
                    AccountLineTypeId = documentMatching.AccountLineTypeId,
                    Amount = documentMatching.AmountToBePaid * signForAccountingDocuments * -1,
                    Narrative = documentMatching.Narrative,
                    DepartmentId = cash.DepartmentId,

                    // On Diff Client, SecondaryDocuementReference should be the reference to the cash
                    SecondaryDocumentReference = cash.DocumentReference,

                    ExternalDocumentReference = documentMatching.ExternalReference,
                    CharterId = null,
                    SectionId = null,
                    LineNumber = counter++,
                    CostTypeId = fxRealCostType.CostTypeId
                };

                manualJournalLines.Add(cashCounterpartyJL);
            }

            counterpartyTransferJournalLines = manualJournalLines;
        }
    }
}
