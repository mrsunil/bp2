namespace LDC.Atlas.Services.Execution.Entities
{
    public class InvoiceLineRecord
    {
        public long? SectionId { get; set; }

        public int? CostId { get; set; }

        public int? InvoiceId { get; set; }

        public int LineNumber { get; set; }

        public decimal Quantity { get; set; }

        public int? WeightUnitId { get; set; }

        public decimal Price { get; set; }

        public int? PriceUnitId { get; set; }

        public string CurrencyCode { get; set; }

        public string VATCode { get; set; }

        public decimal VATAmount { get; set; }

        public decimal LineAmount { get; set; }

        public decimal InvoicePercent { get; set; }

        public string CostTypeCode { get; set; }

        public int CostDirectionId { get; set; }

        public int RateTypeId { get; set; }

        public ContractType ContractType { get; set; }

        public string Narrative { get; set; }

        public bool InPL { get; set; }

        public bool NoAct { get; set; }
    }
}
