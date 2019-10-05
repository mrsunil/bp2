using LDC.Atlas.DataAccess.DapperMapper;
using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Execution.Entities
{
    public class InvoiceRecord
    {
        public long InvoiceId { get; set; }

        public int DataVersionId { get; set; }

        // DocumentReference
        public string InvoiceLabel { get; set; }

        // ExternalInvoice
        public string ExternalInvoiceRef { get; set; }

        public decimal TotalInvoiceValue { get; set; }

        public InvoiceDocumentType InvoiceDocumentType { get; set; }

        public DateTime DueDate { get; set; }

        public int InvoiceTypeId { get; set; }

        [Column(Name = "Counterparty")]
        public string CounterpartyCode { get; set; }

        public decimal TotalGoodsValue { get; set; }

        public decimal TotalInvoiceQuantity { get; set; }

        public DateTime InvoiceDate { get; set; }

        public string Currency { get; set; }

        public InvoiceType InvoiceType { get; set; }

        public string PaymentTerms { get; set; }

        public QuantityToInvoiceType QuantityToInvoiceType { get; set; }

        public string CompanyId { get; set; }

        public string Template { get; set; }

        public InvoiceSourceType ExternalInhouse { get; set; }

        public DocumentRecord Document { get; set; }

        public TransactionRecord Transaction { get; set; }

        public IEnumerable<InvoiceLineRecord> InvoiceLines { get; set; }

        public long? PhysicalDocumentId { get; set; }

        public long? PreviewPhysicalDocumentId { get; set; }

        public string DocumentReference { get; set; }

        public int YearNumber { get; set; }

        public int TransactionDocumentTypeId { get; set; }

        public bool AuthorizedForPosting { get; set; }

        public long TransactionDocumentId { get; set; }

        public TransactionDocumentType? DocumentType { get; set; }

        public CostDirection? CostDirection { get; set; }

        public string NominalAccountNumber { get; set; }

        public long? BankAccountId { get; set; }

        public DateTime? AgreementDate { get; set; }

        public string C2CCode { get; set; }

        public bool NominalAlternativeAccount { get; set; }

        public bool CostAlternativeCode { get; set; }

        public string DepartmentAlternativeCode { get; set; }

        public bool TaxInterfaceCode { get; set; }

        public bool IsPosted { get; set; }

        public int? PricingOptionId { get; set; }
    }
}
