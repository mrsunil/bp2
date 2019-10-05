namespace LDC.Atlas.Services.Trading.Application.Queries.Dto
{
    public class ParentCostsToAdjustDto
    {
        public long CostId { get; set; }

        public long SectionId { get; set; }

        public string CostTypeCode { get; set; }

        public string SupplierCode { get; set; }

        public string CurrencyCode { get; set; }

        public int RateTypeId { get; set; }

        public decimal Rate { get; set; }

        public string Narrative { get; set; }

        public long? PriceUnitId { get; set; }

        public int CostDirectionId { get; set; }

        public decimal Quantity { get; set; }

        public int InvoicingStatusId { get; set; }

    }
}
