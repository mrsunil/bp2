using System;

namespace LDC.Atlas.Services.Execution.Application.Queries.Dto
{
    public class UnpaidInvoiceDto
    {
        public int InvoiceId { get; set; }

        public string InvoiceLabel { get; set; }

        public DateTime InvoiceDate { get; set; }

        public string Currency { get; set; }

        public DateTime ValueDate { get; set; }

        public string ExternalInvoiceReference { get; set; }

        public string Department { get; set; }

        public string DepartmentLabel { get; set; }

        public decimal AbsoluteAmount { get; set; }

        public decimal Amount { get; set; }

        public string OperationType { get; set; }

        public decimal AmountToPay { get; set; }

        public string Counterparty { get; set; }

        public string Description { get; set; }

        public string PaymentTerms { get; set; }

        public string PaymentTermsLabel { get; set; }
    }
}
