namespace LDC.Atlas.Services.Execution.Entities
{
    public class AllocationOperation
    {
        public string Company { get; set; }

        public long? DataVersionId { get; set; }

        public long SectionId { get; set; }

        public long AllocatedSectionId { get; set; }

        public decimal Quantity { get; set; }
        public ShippingType ShippingType { get; set; }
        public AllocationType allocationSourceType { get; set; }
        public AllocationType allocationTargetType { get; set; }

        public int? ContractInvoiceTypeId { get; set; }
    }
}
