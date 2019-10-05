using LDC.Atlas.Services.Execution.Entities;
using System.Collections.Generic;
using System.Linq;

namespace LDC.Atlas.Services.Execution.Application.Commands
{
    public partial class CreateCashCommandHandler
    {
        private static MatchFlag GenerateMatchFlagForCashByPickingSimpleCase(Cash cash)
        {
            MatchFlag matchFlag = new MatchFlag()
            {
                CashIdOfCashByPicking = cash.CashId,
                CompanyId = cash.CompanyId,
                CounterPartyCode = cash.CounterPartyCode,
                CounterPartyId = cash.CounterPartyId,
                CurrencyCode = cash.CurrencyCode,
                IsPrematch = true,
                MatchFlagId = cash.MatchFlagId,
                MatchingCurrency = cash.MatchingCurrency,
                MatchingStatusId = cash.MatchingStatusId,
                PaymentDocumentDate = cash.DocumentDate // the payment document date should be the document date of the Cash
            };
            matchFlag.DocumentMatchings = new List<DocumentMatching>();
            foreach (var dm in cash.DocumentMatchings)
            {
                var cashLine = cash.CashLines.ToList().Find(cl =>
                   ((cl.InitiallyMatchedInvoiceId.HasValue && dm.SourceInvoiceId.HasValue) && cl.InitiallyMatchedInvoiceId.Value == dm.SourceInvoiceId.Value)
                   || ((cl.InitiallyMatchedCashLineId.HasValue && dm.SourceCashLineId.HasValue) && cl.InitiallyMatchedCashLineId.Value == dm.SourceCashLineId.Value)
                   || ((cl.InitiallyMatchedJournalLineId.HasValue && dm.SourceJournalLineId.HasValue) && cl.InitiallyMatchedJournalLineId.Value == dm.SourceJournalLineId.Value));
                matchFlag.DocumentMatchings.Add(new DocumentMatching()
                {
                    TransactionDocumentId = dm.TransactionDocumentId,
                    Amount = dm.Amount,
                    AmountToBePaid = dm.AmountToBePaid,
                    MatchedAmount = dm.AmountToBePaid,
                    ValueDate = dm.InvoiceGLDate ?? dm.DocumentDate,
                    DepartmentId = dm.DepartmentId,
                    TransactionDirectionId = dm.TransactionDirectionId,
                    AmountInFunctionalCurrency = dm.AmountInFunctionalCurrency,
                    AmountInStatutoryCurrency = dm.AmountInStatutoryCurrency,
                    SecondaryDocumentReferenceId = cash.TransactionDocumentId,
                    SourceCashLineId = dm.SourceCashLineId,
                    SourceInvoiceId = dm.SourceInvoiceId,
                    SourceJournalLineId = dm.SourceJournalLineId,
                    MatchedCashLineId = cashLine?.CashLineId,
                });
                matchFlag.DocumentMatchings.Add(new DocumentMatching()
                {
                    TransactionDocumentId = cash.TransactionDocumentId,
                    Amount = cashLine.Amount.Value, // The cashline contains the signed value
                    AmountToBePaid = cashLine.Amount.Value, // The cashline contains the signed value
                    MatchedAmount = cashLine.Amount.Value, // The cashline contains the signed value
                    ValueDate = cash.DocumentDate,
                    DepartmentId = dm.DepartmentId,
                    TransactionDirectionId = dm.TransactionDirectionId,
                    AmountInFunctionalCurrency = cashLine?.AmountInFunctionalCurrency, // The cashline contains the signed value
                    AmountInStatutoryCurrency = cashLine?.AmountInStatutoryCurrency, // The cashline contains the signed value
                    SecondaryDocumentReferenceId = dm.TransactionDocumentId,
                    SourceCashLineId = cashLine?.CashLineId,
                    MatchedJournalLineId = cashLine?.InitiallyMatchedJournalLineId,
                    MatchedCashLineId = cashLine?.InitiallyMatchedCashLineId,
                    MatchedInvoiceId = cashLine?.InitiallyMatchedInvoiceId
                });
            }

            return matchFlag;
        }
    }
}
