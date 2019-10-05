using System;

namespace LDC.Atlas.Services.Execution.Entities
{
    public class InvoiceMarking
    {
        public string ContractReference { get; set; }

        public string SectionType { get; set; }

        public long AllocatedTo { get; set; }

        public long? InvoiceMarkingId { get; set; }

        public long SectionId { get; set; }

        public long? CostId { get; set; }

        public long? InvoiceLineId { get; set; }

        public string InvoiceReference { get; set; }

        public DateTime? InvoiceDate { get; set; }

        public decimal? InvoiceAmount { get; set; }

        public long? PostingStatusId { get; set; }

        public decimal? Quantity { get; set; }

        public string CurrencyCode { get; set; }

        public decimal? InvoicePercent { get; set; }

        public string DocumentType { get; set; }

        public DateTime? DueDate { get; set; }

        public string PaymentTermCode { get; set; }

        public decimal? PaidAmount { get; set; }

        public string CustomerReference { get; set; }

        public decimal? PaidPercentage { get; set; }

        public DateTime? CashMatchDate { get; set; }

        public decimal? RemainingAmount { get; set; }

        public string CompanyId { get; set; }

        public long? DataVersionId { get; set; }

        public decimal ContractValue { get; set; }

        public decimal ContractQuantity { get; set; }

        public int? InvoiceStatusId { get; set; }

        public string CostType { get; set; }

        public decimal Price { get; set; }
    }
}
