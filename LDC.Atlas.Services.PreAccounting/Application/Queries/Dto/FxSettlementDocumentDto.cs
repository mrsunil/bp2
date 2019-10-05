using LDC.Atlas.Services.PreAccounting.Entities;
using System;
using System.Collections.Generic;


namespace LDC.Atlas.Services.PreAccounting.Application.Queries.Dto
{
    public class FxSettlementDocumentDto
    {
        public long FxDealId { get; set; }

        public long TraderId { get; set; }

        public long BrokerId { get; set; }

        public long DepartmentId { get; set; }

        public long NominalAccountId { get; set; }

        public long SettlementNominalAccountId { get; set; }

        public long CounterpartyId { get; set; }

        public int DealDirectionId { get; set; }

        public int? FxTradeTypeId { get; set; }

        public int? AccrualNumber { get; set; }

        public decimal Amount { get; set; }

        public decimal SpotRate { get; set; }

        public decimal FwPoints { get; set; }

        public FxSettlementDocumentType FxSettlementDocumentTypeId { get; set; }

        public string DocumentReference { get; set; }

        public string CurrencyCode​ { get; set; }

        public string Reference { get; set; }

        public string SettlementCurrencyCode { get; set; }

        public string SpotRateType { get; set; }

        public string BankReference { get; set; }

        public string Memorandum { get; set; }

        public DateTime AccountingPeriod { get; set; }

        public DateTime DocumentDate { get; set; }

        public DateTime MaturityDate { get; set; }

        public DateTime ContractDate { get; set; }

        public IEnumerable<FxSettlementLineDto> FxSettlementLines { get; set; }

        public decimal? NdfAgreedRate { get; set; }

        public DateTime? NdfAgreedDate { get; set; }

        public bool IsNdf { get; set; }
    }
}
