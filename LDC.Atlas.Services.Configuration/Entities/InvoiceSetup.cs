using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Entities
{
    public class InvoiceSetup
    {
        public long InvoiceSetupId { get; set; }

        public bool? VatActive { get; set; }

        public string VatLabel { get; set; }

        public string DefaultVATCode { get; set; }

        public decimal? TolerancePercentage { get; set; }

        public bool AuthorizedForPosting { get; set; }

        public long PaymentTermId { get; set; }

        public decimal? ThresholdCostAmount { get; set; }

        public string DefaultCostVATCode { get; set; }

        public long? TaxTypeId { get; set; }

    }
}
