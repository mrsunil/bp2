namespace LDC.Atlas.Services.Trading.Application.Queries.Dto
{
    public class CostMatrixLineDto
    {
        public long CostMatrixLineId { get; set; }

        public long CostMatrixId { get; set; }

        public long CostTypeId { get; set; }

        public string Description { get; set; }

        public long? SupplierId { get; set; }

        public int PayReceive { get; set; }

        public string CurrencyCode { get; set; }

        public int RateType { get; set; }

        public long? PriceUnitId { get; set; }

        public decimal RateAmount { get; set; }

        public bool InPL { get; set; }

        public bool NoAct { get; set; }

        public string Narrative { get; set; }

        public string CompanyId { get; set; }
    }
}
