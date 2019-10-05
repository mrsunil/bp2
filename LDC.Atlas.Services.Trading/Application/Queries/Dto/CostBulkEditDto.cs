namespace LDC.Atlas.Services.Trading.Application.Queries.Dto
{
    public class CostBulkEditDto
    {
        public long CostId { get; set; }

        public string RowStatus { get; set; }

        public long SectionId { get; set; }

        public string ContractReference { get; set; }

        public long CostTypeId { get; set; }

        public string SupplierCode { get; set; }

        public string CurrencyCode { get; set; }

        public int RateTypeId { get; set; }

        public decimal Rate { get; set; }

        public string Narrative { get; set; }

        public bool InPL { get; set; }

        public bool NoAction { get; set; }

        public long? PriceUnitId { get; set; }

        public int CostDirectionId { get; set; }

        public decimal InvoicePercent { get; set; }

        public string CostMatrixName { get; set; }

        public decimal Quantity { get; set; }

        public int InvoicingStatusId { get; set; }

        public bool IsApproved { get; set; }
    }
}
