using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Trading.Entities
{
    public class FxDeal
    {
        public long FxDealId { get; set; }

        public long DataVersionId { get; set; }

        public string CompanyId { get; set; }

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

        public decimal FwPoints { get; set; }

        public long NominalAccountId { get; set; }

        public long SettlementNominalAccountId { get; set; }

        public long CounterpartyId { get; set; }

        public long BrokerId { get; set; }

        public int FxDealStatusId { get; set; }

        public string BankReference { get; set; }

        public string Memorandum { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? CreatedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public ICollection<FxDealSection> Sections { get; set; }

        public decimal? NdfAgreedRate { get; set; }

        public DateTime? NdfAgreedDate { get; set; }

        public long? ProvinceId { get; set; }

        public long? BranchId { get; set; }
    }

    public class FxDealSection
    {
        public long SectionId { get; set; }

        public decimal CoverApplied { get; set; }

        public decimal UncoveredAmount { get; set; }
    }

    public class SectionInformationFxDeal
    {
        public long SectionId { get; set; }

        public string ContractLabel { get; set; }

        public int ContractType { get; set; }

        public string CurrencyCode { get; set; }

        public decimal ContractedValue { get; set; }

        public decimal UncoveredAmount { get; set; }

        public long DepartmentId { get; internal set; }
    }
}
