using LDC.Atlas.Application.Core.Entities;
using System;

namespace LDC.Atlas.Services.Execution.Application.Queries.Dto
{
    public class InvoiceDetailsDto : PaginatedItem
    {
        public int DataVersionId { get; set; }

        public int InvoiceId { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string InvoiceCode { get; set; }

        public DateTime InvoiceDate { get; set; }

        public int InvoiceTypeId { get; set; }

        public string InvoiceTypeDescription { get; set; }

        public string CounterParty { get; set; }

        public string ClientAccount { get; set; }

        public string CharterReference { get; set; }

        public string PaymentTermsCode { get; set; }

        public DateTime DueDate { get; set; }

        public string ExternalInvoiceReference { get; set; }

        public string ExternalInhouseLabel { get; set; }

        public decimal Quantity { get; set; }

        public decimal Price { get; set; }

        public string CurrencyCode { get; set; }

        public decimal TotalInvoiceValue { get; set; }

        public string WeightCode { get; set; }

        public string CompanyId { get; set; }

        public string PostingStatus { get; set; }

        public int OriginalInvoiceTypeId { get; set; }

        public string OriginalInvoiceId { get; set; }
        
        public int DepartmentId { get; set; }

        public string Department { get; set; }

        public string Province { get; set; }

        public string BranchCode { get; set; }
    }
}
