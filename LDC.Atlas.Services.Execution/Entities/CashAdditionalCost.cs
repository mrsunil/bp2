namespace LDC.Atlas.Services.Execution.Entities
{
    public class CashAdditionalCost
    {
        public long CashAdditionalCostId { get; set; }

        public long CashTypeId { get; set; }

        public string CostTypeCode { get; set; }

        public int CostDirectionId { get; set; }

        public string CurrencyCode { get; set; }

        public int Year { get; set; }

        public int YearNumber { get; set; }

        /// <summary>
        /// Probably useless field...
        /// </summary>
        public string DocumentReference { get; set; }

        public decimal Amount { get; set; }

        public string Narrative { get; set; }

        public long AccountId { get; set; }

        public int AccountLineTypeId { get; set; }

        public string AccountLineType { get; set; }

        public long? ClientAccount { get; set; }

        public string CustomerVendor { get; set; }

        public bool ClientAccountMandatory { get; set; }
    }
}
