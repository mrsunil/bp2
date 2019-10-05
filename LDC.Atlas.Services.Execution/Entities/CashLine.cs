using System;

namespace LDC.Atlas.Services.Execution.Entities
{
    public class CashLine
    {
        public long CashLineId { get; set; }

        public long CashId { get; set; }

        public int DataVersionId { get; set; }

        public int CompanyId { get; set; }

        public long? DepartmentId { get; set; }

        public int? TransactionDirectionId { get; set; }

        public decimal? Amount { get; set; }

        public decimal? AmountInFunctionalCurrency { get; set; }

        public decimal? AmountInStatutoryCurrency { get; set; }

        public long? InitiallyMatchedJournalLineId { get; set; }

        public long? InitiallyMatchedInvoiceId { get; set; }

        public long? InitiallyMatchedCashLineId { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public string ContextInformation { get; set; }
    }
}
