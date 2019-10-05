using LDC.Atlas.Application.Core.Entities;
using System;

namespace LDC.Atlas.Services.Trading.Application.Queries.Dto
{
    public class FxDealSearchResultDto : PaginatedItem
    {
        public long FxDealId { get; set; }

        public long DataVersionId { get; set; }

        public string CompanyId { get; set; }

        public string DealNumber { get; set; }

        public int DealDirectionId { get; set; }

        public long TraderId { get; set; }

        public string Trader { get; set; }

        public DateTime ContractDate { get; set; }

        public DateTime MaturityDate { get; set; }

        public long DepartmentId { get; set; }

        public string DepartmentCode { get; set; }

        public string DepartmentDescription { get; set; }

        public int? FxTradeTypeId { get; set; }

        public string CurrencyCode { get; set; }

        public decimal Amount { get; set; }

        public string SettlementCurrency { get; set; }

        public decimal SpotRate { get; set; }

        public string SpotRateType { get; set; }

        public decimal FwPoints { get; set; }

        public decimal TradedROE { get; set; }

        public long NominalAccountId { get; set; }

        public string NominalAccountNumber { get; set; }

        public long SettlementNominalAccountId { get; set; }

        public string SettlementNominalAccountNumber { get; set; }

        public long CounterpartyId { get; set; }

        public long BrokerId { get; set; }

        public string AccountRef { get; set; }

        public string AccountDescription { get; set; }

        public int FxDealStatusId { get; set; }

        public string BankBroker { get; set; }

        public string BankReference { get; set; }

        public string BankDescription { get; set; }

        public string Memorandum { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? CreatedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string Code { get; set; }

        public string DealType { get; set; }

        public decimal SettledAmount { get; set; }

        public string Province { get; set; }

        public string BranchCode { get; set; }
    }
}
