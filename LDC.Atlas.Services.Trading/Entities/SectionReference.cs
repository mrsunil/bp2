using System.Collections.Generic;

namespace LDC.Atlas.Services.Trading.Entities
{
    public class SectionReference
    {
        public long SectionId { get; set; }

        public long? DataVersionId { get; set; }

        public string ContractLabel { get; set; }

        public InvoicingStatus? InvoicingStatusId { get; set; }

        public long PhysicalContractId { get; set; }

        public long SectionOriginId { get; set; }

        public decimal Quantity { get; set; }

        public IEnumerable<Cost> Costs { get; set; }

        public string SectionNumberId { get; set; }

        public long SectionTypeId { get; set; }

        public ContractStatus Status { get; set; }

        public bool IsClosed { get; set; }

        public bool IsCancelled { get; set; }

    }
}
