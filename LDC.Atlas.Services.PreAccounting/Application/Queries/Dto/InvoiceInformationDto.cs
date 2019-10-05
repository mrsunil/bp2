using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.PreAccounting.Application.Queries.Dto
{
    public class InvoiceInformationDto
    {
        public long InvoiceId { get; set; }

        public string CounterpartyCode { get; set; }

        public DateTime InvoiceDate { get; set; }

        public DateTime InvoiceDueDate { get; set; }

        public string Currency { get; set; }

        public string PaymentTerms { get; set; }

        public string ExternalReference { get; set; }

        public int InvoiceType { get; set; }

        public decimal TotalInvoiceQuantity { get; set; }

        public bool AuthorizedForPosting { get; set; }

        public decimal SumOfInvoiceLineamount { get; set; }

        public decimal SumOfInvoiceTotalAmount { get; set; }

        public int TransactionDocumentTypeId { get; set; }

        public IEnumerable<InvoiceLinesDto> InvoiceLines { get; set; }

        public int InvoiceSourceType { get; set; }

        public long? ReversedTransactionDocumentId { get; set; }

        public string ReversedDocumentReference { get; set; }

        public bool BusinessSectorNominalPostingPurpose { get; set; }

        public string CostTypeCode { get; set; }

        public string AccountReference { get; set; }
    }

    public class BusinessSectorDto
    {
        public string SectorCode { get; set; }

        public string CostTypeCode { get; set; }

        public string AccountNumber { get; set; }
    }
}
