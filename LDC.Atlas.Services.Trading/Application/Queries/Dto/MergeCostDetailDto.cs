namespace LDC.Atlas.Services.Trading.Application.Queries.Dto
{
    /// <summary>
    /// Information regarding costs for trade merge business rule
    /// </summary>
    public class MergeCostDetailDto
    {
        public int RateTypeId { get; set; }

        public bool IsCostInvoiced { get; set; }

        public long SectionId { get; set; }

        public long CostId {get; set;}
    }
}
