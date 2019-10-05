using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Trading.Application.Queries.Dto
{
    public class FxDealDto
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

        public decimal? NdfAgreedRate { get; set; }

        public DateTime? NdfAgreedDate { get; set; }

        public long CounterpartyId { get; set; }

        public long BrokerId { get; set; }

        public int FxDealStatusId { get; set; }

        public string BankReference { get; set; }

        public string Memorandum { get; set; }

        public string TraderDisplayName { get; set; }

        public string DepartmentCode { get; set; }

        public string AccountNumber { get; set; }

        public string SettlementNominalAccountNumber { get; set; }

        public decimal TotalApplied { get; set; }

        public decimal Balance { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? CreatedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public IEnumerable<FxDealSectionDto> Sections { get; set; }

        public int FxDealDocumentId { get; set; }

        public string FxDealDocument { get; set; }

        public int FxSettlementDocumentId { get; set; }

        public string FxSettlementDocument { get; set; }

        public int FxDealReverseDocumentId { get; set; }

        public string FxDealReverseDocument { get; set; }

        public int FxSettlementReverseDocumentId { get; set; }

        public string FxSettlementReverseDocument { get; set; }

        public int FxSettlementDealDocumentPostingStatusId { get; set; }

        public int FxSettlementSettlementDocumentPostingStatusId { get; set; }

    }

    public class FxDealSectionDto
    {
        public long SectionId { get; set; }

        public string ContractLabel { get; set; }

        public int ContractType { get; set; }

        public string ContractTypeShortCode { get; set; }

        public int ContractStatusCode { get; set; }

        public DateTime? DeliveryPeriodStartDate { get; set; }

        public decimal ContractedValue { get; set; }

        public string CurrencyCode { get; set; }

        public decimal CoverApplied { get; set; }

        public decimal UncoveredAmount { get; set; }
    }
}
