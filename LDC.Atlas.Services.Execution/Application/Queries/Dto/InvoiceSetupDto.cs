namespace LDC.Atlas.Services.Execution.Application.Queries.Dto
{
    public class InvoiceSetupDto
    {
        public long InvoiceSetupId { get; set; }

        public bool VATActive { get; set; }

        public string VATLabel { get; set; }

        public string DefaultVATCode { get; set; }

        public decimal TolerancePercentage { get; set; }

        public bool AuthorizedForPosting { get; set; }

        public string CompanyId { get; set; }

        public string PaymentTermCode { get; set; }
    }
}
