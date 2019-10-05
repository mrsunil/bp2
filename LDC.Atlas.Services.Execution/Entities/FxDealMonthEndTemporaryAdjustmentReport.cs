using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Entities
{
    public class FxDealMonthEndTemporaryAdjustmentReport
    {
        public string CurrencyCode { get; set; }

        public string DepartmentCode { get; set; }

        public string DealNumber { get; set; }

        public string AssociatedClient { get; set; }

        public string CostType { get; set; }

        public string DealCurrency { get; set; }

        public string SettlementCurrency { get; set; }

        public decimal DealAmount { get; set; }

        public decimal SettlementAmount { get; set; }

        public long AccrualNumber { get; set; }

        public DateTime? MaturityDate { get; set; }

        public decimal MarketCcyRoeDealt { get; set; }

        public decimal MarketCcyRoeSettlement { get; set; }

        public decimal VariationMargin { get; set; }

        public string Line1NominalAccountCode { get; set; }

        public string Line2NominalAccountCode { get; set; }

        public string Line1NominalAccountDesc { get; set; }

        public string Line2NominalAccountDesc { get; set; }

        public int FxDealId { get; set; }

        public int NominalAccountId { get; set; }

        public int Line1NominalAccountId { get; set; }

        public int Line2NominalAccountId { get; set; }
    }
}
