using LDC.Atlas.DataAccess.DapperMapper;
using System;

namespace LDC.Atlas.Services.Execution.Application.Queries.Dto
{
    public class InvoiceMarkingDto
    {
        [Column(Name = "InvoiceMarkingID")]
        public long InvoiceMarkingId { get; set; }

        public string SectionReference { get; set; }

        public string InvoiceReference { get; set; }

        public decimal Quantity { get; set; }

        public decimal InvoicedQuantity { get; set; }

        public string CurrencyCode { get; set; }

        public decimal Amount { get; set; }

        public DateTime? DueDate { get; set; }

        public string ExternalInvoiceRef { get; set; }

        public decimal PaidAmount { get; set; }

        public double PaidPercentage { get; set; }

        public DateTime? MatchDate { get; set; }

        public decimal RemainingAmount { get; set; }

        public string ContractReference { get; set; }

        public string SectionType { get; set; }

        public long AllocatedTo { get; set; }

        public DateTime InvoiceDate { get; set; }

        public decimal InvoiceAmount { get; set; }

        [Column(Name = "PostingStatus")]
        public int PostingStatusId { get; set; }

        public decimal InvoicePercent { get; set; }

        public string DocumentType { get; set; }

        public string PaymentTermCode { get; set; }

        public string CustomerReference { get; set; }

        public DateTime CashMatchDate { get; set; }

        public decimal Price { get; set; }

        public decimal ContractQuantity { get; set; }

        public string CostType { get; set; }        

        public bool IsDeleted { get; set; }

        public decimal PriceConversionFactor { get; set; }

        public decimal WeightConversionFactor { get; set; }

        public long SectionId { get; set; }

        public long? InvoiceLineId { get; set; }

        public long InvoicingStatusId { get; set; }

        public bool MainInvoice { get; set; }
    }
}
