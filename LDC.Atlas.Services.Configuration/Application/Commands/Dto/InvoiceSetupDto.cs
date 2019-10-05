using LDC.Atlas.DataAccess.DapperMapper;
using System;

namespace LDC.Atlas.Services.Configuration.Application.Commands.Dto
{
    public class InvoiceSetupDto
    {
        public long InvoiceSetupId { get; set; }

        public bool VatActive { get; set; }

        public string VatLabel { get; set; }

        public string DefaultVATCode { get; set; }

        public decimal? TolerancePercentage { get; set; }

        public bool AuthorizedForPosting { get; set; }

        public string CompanyId { get; set; }

        public string PaymentTermCode { get; set; }

        public decimal? ThresholdCostAmount { get; set; }

        public string DefaultCostVATCode { get; set; }

        public string TaxType { get; set; }
    }
}
