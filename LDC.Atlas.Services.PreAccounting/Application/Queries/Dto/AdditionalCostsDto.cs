namespace LDC.Atlas.Services.PreAccounting.Application.Queries.Dto
{
    public class AdditionalCostsDto
    {
        public long CashAdditionalCostId { get; set; }

        public string AccountReference { get; set; }

        public decimal Amount { get; set; }

        public long CashTypeId { get; set; }

        public string CostTypeCode { get; set; }

        public string Narrative { get; set; }

        public string CurrencyCode { get; set; }

        public int CostDirectionId { get; set; }

        public string ClientAccountCode { get; set; }

        public long? ClientAccountId { get; set; }

        public int? AccountLineTypeId { get; set; }
    }
}