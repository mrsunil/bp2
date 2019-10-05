using System;

namespace LDC.Atlas.Services.PreAccounting.Entities
{
    public class DocumentMatching
    {
        public long? DataversionId { get; set; }

        public string CompanyId { get; set; }

        public long? MatchFlagId { get; set; }

        public long? TransactionDocumentId { get; set; }

        public decimal? Amount { get; set; }

        public decimal? AmountInFunctionalCurrency { get; set; }

        public decimal? AmountInStatutoryCurrency { get; set; }

        public DateTime? ValueDate { get; set; }

        public long? DepartmentId { get; set; }

        public int? TransactionDirectionId { get; set; }

        public long? LineId { get; set; }

        public long? SecondaryDocumentReferenceId { get; set; }

        public long? SourceJournalLineId { get; set; }

        public long? SourceInvoiceId { get; set; }

        public long? SourceCashLineId { get; set; }

        public long? MatchedJournalLineId { get; set; }

        public long? MatchedInvoiceId { get; set; }

        public long? MatchedCashLineId { get; set; }
    }
}
