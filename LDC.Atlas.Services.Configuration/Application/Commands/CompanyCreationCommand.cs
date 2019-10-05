using LDC.Atlas.Services.Configuration.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Application.Commands
{
    public class CompanyCreationCommand : IRequest
    {
        public string CompanyId { get; set; }

        public string CompanyToCopy { get; set; }

        public bool IsCounterpartyRequired { get; set; }

        public bool IsTransactionDataSelected { get; set; }

        public IEnumerable<CompanyUserProfile> CompanyUserProfile { get; set; }

        public CompanySetup CompanySetup { get; set; }

        public InterfaceSetup InterfaceSetup { get; set; }

        public InvoiceSetup InvoiceSetup { get; set; }

        public TradeSetup TradeSetup { get; set; }

        public IEnumerable<InterCoNoInterCoEmailSetup> IntercoNoIntercoEmailSetup { get; set; }

        public IEnumerable<AllocationSetUp> AllocationSetUp { get; set; }

        public IEnumerable<MandatoryTradeApprovalImageSetup> MandatoryTradeApprovalImageSetup { get; set; }

        public IEnumerable<AccountingParameter> AccountingParameters { get; set; }

        public IEnumerable<TradeParameter> TradeParameters { get; set; }
    }
}
