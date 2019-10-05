using MediatR;
using System;

namespace LDC.Atlas.Services.Trading.Application.Commands.CreateFxDeal
{
    public class CreateFxDealCommand : IRequest<FxDealReference>
    {
        internal string CompanyId { get; set; } // internal to avoid the exposure in Swagger

        public string Reference { get; set; }

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

        public decimal? FwPoints { get; set; }

        public long NominalAccountId { get; set; }

        public long SettlementNominalAccountId { get; set; }

        public long CounterpartyId { get; set; }

        public long BrokerId { get; set; }

        public string BankReference { get; set; }

        public string Memorandum { get; set; }

        public decimal? NdfAgreedRate { get; set; }

        public DateTime? NdfAgreedDate { get; set; }
    }

    public class FxDealReference
    {
        public long FxDealId { get; set; }

        public string FxReference { get; set; }

        public string C2CCode { get; set; }

        public string NominalAlternativeAccount { get; set; }

        public string DepartmentAlternativeCode { get; set; }

        public string SettlementNominalAccount { get; set; }

        public string CounterpartyCode { get; set; }

        public string DepartmentMappingCode { get; set; }

        public string NominalAccountNumber { get; set; }

        public string SettlementAccountNumber { get; set; }
    }
}
