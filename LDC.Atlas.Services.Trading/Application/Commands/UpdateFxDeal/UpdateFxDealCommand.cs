using MediatR;
using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Trading.Application.Commands.UpdateFxDeal
{
    public class UpdateFxDealCommand : IRequest
    {
        internal string CompanyId { get; set; } // internal to avoid the exposure in Swagger

        public long FxDealId { get; set; }

        public int DealDirectionId { get; set; }

        public long TraderId { get; set; }

        public DateTime ContractDate { get; set; }

        public DateTime MaturityDate { get; set; }

        public long DepartmentId { get; set; }

        public int? FxTradeTypeId { get; set; }

        public string CurrencyCode { get; set; }

        public decimal Amount { get; set; }

        public string SettlementCurrencyCode { get; set; }

        public decimal SpotRate { get; set; }

        public string SpotRateType { get; set; }

        public decimal FwPoints { get; set; }

        public long NominalAccountId { get; set; }

        public long SettlementNominalAccountId { get; set; }

        public long CounterpartyId { get; set; }

        public long BrokerId { get; set; }

        public string BankReference { get; set; }

        public string Memorandum { get; set; }

        public IEnumerable<FxDealSection> Sections { get; set; }

        public decimal? NdfAgreedRate { get; set; }

        public DateTime? NdfAgreedDate { get; set; }

        public bool IsNdf { get; set; }
    }

    public class FxDealSection
    {
        public long SectionId { get; set; }

        public decimal CoverApplied { get; set; }
    }
}
