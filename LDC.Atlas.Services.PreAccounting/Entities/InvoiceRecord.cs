using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.PreAccounting.Entities
{
    public class InvoiceRecord
    {
        public long InvoiceID { get; set; }

        public string InvoiceLabel { get; set; }

        public string ExternalInvoiceRef { get; set; }

        public string CounterpartyCode { get; set; }

        public decimal TotalGoodsValue { get; set; }

        public decimal TotalInvoiceValue { get; set; }

        public DateTime InvoiceDate { get; set; }

        public DateTime DueDate { get; set; }

        public string Currency { get; set; }

        public InvoiceType InvoiceType { get; set; }

        public string PaymentTerms { get; set; }

        public DocumentRecord Document { get; set; }

        public TransactionRecord Transaction { get; set; }

        public IEnumerable<InvoiceLineRecord> InvoiceLines { get; set; }

        public string Company { get; set; }
    }
}
