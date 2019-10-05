using LDC.Atlas.Services.Configuration.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Application.Commands.Dto
{
    public class CompanyConfigurationDto
    {
        public string CompanyId { get; set; }

        public CompanySetupDto CompanySetup { get; set; }

        public InvoiceSetupDto InvoiceSetup { get; set; }

        public IEnumerable<InterfaceSetupDto> InterfaceSetup { get; set; }

        public TradeSetupDto TradeConfiguration { get; set; }

        public DefaultAccountingSetupDto DefaultAccountingSetup { get; set; }

        public RetentionPolicyDto RetentionPolicy { get; set; }

        public IEnumerable<InterCoNoInterCoEmailSetupDto> InterCoNoInterCoEmailSetup { get; set; }

        public IEnumerable<AllocationSetUpDto> AllocationSetUp { get; set; }

        public IEnumerable<MandatoryTradeApprovalImageSetupDto> MandatoryTradeApprovalImageSetup { get; set; }

        public IEnumerable<MainAccountingSetupDto> MainAccountingSetup { get; set; }

        public IEnumerable<AccountingParameterDto> AccountingParameters { get; set; }

        public IEnumerable<TradeParameterDto> TradeParameters { get; set; }
    }

}
