using LDC.Atlas.Application.Core.Entities;
using System;

namespace LDC.Atlas.Services.Execution.Application.Queries.Dto
{
    public class InvoicesForReversalDto : PaginatedItem
    {
        public string InvoiceReference { get; set; }

        public string ContractReference { get; set; }

        public string CustomerRef { get; set; }

        public DateTime DocumentDate { get; set; }

        public string CharterReference { get; set; }

        public string CurrencyCode { get; set; }

        public decimal Quantity { get; set; }

        public decimal TotalInvoiceValue { get; set; }

        public decimal CostAmount { get; set; }

        public bool ContractUnApproved { get; set; }

        public bool InvoiceMatched { get; set; }

        public int InvoiceId { get; set; }

        public int TransactionDocumentId { get; set; }

        public int DocumentId { get; set; }

        public int TransactionDocumentTypeId { get; set; }

        public InvoiceTypeDto InvoiceTypeId { get; set; }

        public string Department { get; set; }

        public int DepartmentId { get; set; }

        public bool HasPhysicalDocument { get; set; }
    }
}
