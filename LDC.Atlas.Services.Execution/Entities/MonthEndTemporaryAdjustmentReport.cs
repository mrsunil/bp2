using System.Collections.Generic;

namespace LDC.Atlas.Services.Execution.Entities
{
    public class MonthEndTemporaryAdjustmentReport
    {
        public string CurrencyCode { get; set; }

        public long SectionId { get; set; }
        public long CostId { get; set; }

        public decimal AccruedAmount { get; set; }

        public decimal Quantity { get; set; }

        public long AccrualNumber { get; set; }

        public int? AccountLineTypeId { get; set; }

        public decimal FullValue { get; set; }
        public decimal InvoicedAmount { get; set; }

        public int? IsOriginal { get; set; }

        public int? InvoiceTransactionDocumentId { get; set; }

        public int FxDealId { get; set; }

        public int NominalAccountId { get; set; }

        public string BusinessSectorCode { get; set; }

    }

    public class MonthEndTAResponse
    {
        public string MonthEndTAReferenceNumber { get; set; }

        public IEnumerable<long> TransactionDocumentId { get; set; }
    }
}
