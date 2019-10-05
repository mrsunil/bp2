using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Entities
{
    public class CompanyConfiguration
    {
        public string CompanyId { get; set; }

        public CompanySetup CompanySetup { get; set; }

        public InvoiceSetup InvoiceSetup { get; set; }

        public IEnumerable<InterfaceSetup> InterfaceSetup { get; set; }

        public TradeSetup TradeConfiguration { get; set; }

        public DefaultAccountingSetup DefaultAccountingSetup { get; set; }

        public RetentionPolicy RetentionPolicy { get; set; }

        public IEnumerable<InterCoNoInterCoEmailSetup> InterCoNoInterCoEmailSetup { get; set; }

        public IEnumerable<MainAccountingFieldSetup> MainAccountingFieldSetup { get; set; }

        public IEnumerable<AllocationSetUp> AllocationSetUp { get; set; }

        public IEnumerable<MandatoryTradeApprovalImageSetup> MandatoryTradeApprovalImageSetup { get; set; }

        public IEnumerable<AccountingParameter> AccountingParameters { get; set; }

        public IEnumerable<TradeParameter> TradeParameters { get; set; }
    }
}
