using LDC.Atlas.DataAccess.DapperMapper;
using System;

namespace LDC.Atlas.Services.Execution.Entities
{
    public class SectionToAllocate
    {
        public long SectionId { get; set; }

        [Column(Name = "ContractSectionCode")]
        public string ContractLabel { get; set; }

        [Column(Name = "PhysicalContractId")]
        public long ContractId { get; set; }

        public ContractType Type { get; set; }

        public decimal Price { get; set; }

        [Column(Name = "ContractStatusCode")]
        public ContractStatus Status { get; set; }

        [Column(Name = "BLDate")]
        public DateTime? BlDate { get; set; }

        public int DepartmentCode { get; set; }

        public string BuyerCode { get; set; }

        public string SellerCode { get; set; }

        public long CommodityId { get; set; }

        public long WeightUnitId { get; set; }

        public decimal Quantity { get; set; }

        public long? AllocatedTo { get; set; }

        public DateTime? AllocationDate { get; set; }

        public string CreatedBy { get; set; }

        public DateTime CreationDate { get; set; }

        [Column(Name = "ModifiedBy")]
        public string LastModifiedBy { get; set; }

        [Column(Name = "ModifiedDate")]
        public DateTime LastModifiedDate { get; set; }
    }
}
