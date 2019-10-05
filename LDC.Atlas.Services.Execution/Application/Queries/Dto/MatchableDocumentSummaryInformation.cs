using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Application.Queries.Dto
{
    public class MatchableDocumentSummaryInformationDto
    {
        public string DocumentReference { get; set; }

        public long? TransactionDocumentId { get; set; }

        public long? TransactionDocumentTypeId { get; set; }

        public long? SourceInvoiceId { get; set; }

        public long? SourceCashLineId { get; set; }

        public long? SourceJournalLineId { get; set; }

        public decimal RoeDocumentCurrency { get; set; }

        public string RoeDocumentCurrencyType { get; set; }

        public decimal RoeFunctionalCurrency { get; set; }

        public string RoeFunctionalCurrencyType { get; set; }

        public decimal RoeStatutoryCurrency { get; set; }

        public string RoeStatutoryCurrencyType { get; set; }

        public decimal UnmatchedAmount { get; set; }

        public decimal UnmatchedAmountInFunctionalCurrency { get; set; }

        public decimal UnmatchedAmountInStatutoryCurrency { get; set; }
    }
}