using LDC.Atlas.Services.Execution.Entities;
using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Execution.Application.Queries.Dto
{
    public class InvoiceDto
    {
        public long InvoiceId { get; set; }

        public string InvoiceCode { get; set; }

        public DateTime InvoiceDate { get; set; }

        public InvoiceType InvoiceType { get; set; }

        public string Counterparty { get; set; }

        public string PaymentTermsCode { get; set; }

        public DateTime? DueDate { get; set; }

        public string ExternalInvoiceReference { get; set; }

        public InvoiceSourceType ExternalInhouse { get; set; }

        public string Currency { get; set; }

        public decimal TotalInvoiceValue { get; set; }

        public QuantityToInvoiceType QuantityToInvoiceType { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public int DataVersionId { get; set; }

        public IEnumerable<InvoiceLineDto> SummaryLines { get; set; }

        public string ReversedInvoiceReference { get; set; }

        public string ClientAccount { get; set; }

        public DateTime ReversedDocumentDate { get; set; }
    }
}
