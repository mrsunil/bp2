using System;

namespace LDC.Atlas.Services.Execution.Application.Queries.Dto
{
    public class InvoiceStatusDetailsDto
    {
        public string InvoiceCode { get; set; }

        public decimal InvoicePercent { get; set; }

        public decimal Quantity { get; set; }

        public DateTime? InvoiceDate { get; set; }

        public DateTime? CreatedDateTime { get; set; }

        public string WeightCode { get; set; }

        public long SectionId { get; set; }

        public long TransactionDocumentId { get; set; }

        public string DocumentReference { get; set; }

        public int ExternalInhouse { get; set; }

        public int TransactionDocumentTypeId { get; set; }

        public long InvoiceId { get; set; }
    }
}
