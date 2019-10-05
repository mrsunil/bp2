namespace LDC.Atlas.Services.PreAccounting.Application.Queries.Dto
{
    public class InvoiceLinesDto
    {
        public long InvoiceLineId { get; set; }

        public string VATCode { get; set; }

        public decimal InvoiceLineAmount { get; set; }

        public decimal InvoiceTotalAmount { get; set; }

        public long SectionId { get; set; }

        public int? CostDirectionId { get; set; }

        public int? Type { get; set; }

        public string PhysicalContractCode { get; set; }

        public decimal Quantity { get; set; }

        public string CostType { get; set; }

        public string NominalAccount { get; set; }

        public string BusinessSectorCode { get; set; }

    }
}
