using LDC.Atlas.Services.Configuration.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Application.Commands
{
    public class UpdateCompanyConfigurationCommand : IRequest
    {
        public string CompanyId { get; set; }

        public CompanySetup CompanySetup { get; set; }

        public InvoiceSetup InvoiceSetup { get; set; }

        public IEnumerable<InterfaceSetup> InterfaceSetup { get; set; }

        public RetentionPolicy RetentionPolicy { get; set; }

        public TradeSetup TradeConfiguration { get; set; }

        public DefaultAccountingSetup DefaultAccountingSetup { get; set; }

        public IEnumerable<MainAccountingFieldSetup> MainAccountingFieldSetup { get; set; }

        public IEnumerable<InterCoNoInterCoEmailSetup> IntercoNoIntercoEmailSetup { get; set; }

        public IEnumerable<AllocationSetUp> AllocationSetUp { get; set; }

        public IEnumerable<MandatoryTradeApprovalImageSetup> MandatoryTradeApprovalImageSetup { get; set; }

        public IEnumerable<AccountingParameter> AccountingParameters { get; set; }

        public IEnumerable<TradeParameter> TradeParameters { get; set; }
    }

    public class DeleteCompanyCommand : IRequest
    {
        public string CompanyId { get; set; }
    }

    public class UpdateIsFrozenForCompanyCommand: IRequest
    {
        public string CompanyId { get; set; }

        public int IsFrozen { get; set; }
    }
}
