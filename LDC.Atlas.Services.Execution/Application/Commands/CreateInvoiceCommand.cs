using LDC.Atlas.Document.Common.Dtos;
using LDC.Atlas.Services.Execution.Entities;
using MediatR;
using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Execution.Application.Commands
{
    public class CreateInvoiceCommand : IRequest<InvoiceRecord>
    {
        internal string CompanyId { get; set; } // internal to avoid the exposure in Swagger

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

        public QuantityToInvoiceType QuantityToInvoiceType { get; set; }

        public string Template { get; set; }

        public InvoiceSourceType ExternalInhouse { get; set; }

        public DocumentRecord Document { get; set; }

        public TransactionRecord Transaction { get; set; }

        public IEnumerable<InvoiceLineRecord> InvoiceLines { get; set; }

        public long? PhysicalDocumentId { get; set; }

        public string DocumentReference { get; set; }

        public int YearNumber { get; set; }

        public int TransactionDocumentTypeId { get; set; }

        public bool AuthorizedForPosting { get; set; }

        public long TransactionDocumentId { get; set; }

        public TransactionDocumentType? DocumentType { get; set; }

        public CostDirection? CostDirection { get; set; }

        public int InvoiceTypeId { get; set; }

        public bool IsDraft { get; set; }

        public long? BankAccountId { get; set; }

        public DateTime? AgreementDate { get; set; }

        public int? PricingOptionId { get; set; }
    }

    public class CreateTransactionDocumentCommand : IRequest<TransactionCreationResponse>
    {
        internal string Company { get; set; } // internal to avoid the exposure in Swagger

        public int TransactionDocumentTypeId { get; set; }

        public long TransactionDocumentId { get; set; }

        public DateTime DocumentDate { get; set; }

        public string CurrencyCode { get; set; }

        public bool AuthorizedForPosting { get; set; }

        public long? PhysicalDocumentId { get; set; }

        public bool ToInterface { get; set; }
    }

    public class UpdateInvoiceDocumentCommand : IRequest<PhysicalDocumentReferenceDto>
    {
        internal string Company { get; set; } // internal to avoid the exposure in Swagger

        internal long InvoiceId { get; set; } // internal to avoid the exposure in Swagger

        public long DraftDocumentId { get; set; }

        public int PhysicalDocumentId { get; set; }

        public string DocumentTemplatePath { get; set; }
    }
}
