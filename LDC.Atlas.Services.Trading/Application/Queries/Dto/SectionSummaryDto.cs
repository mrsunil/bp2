using LDC.Atlas.Application.Core.Entities;
using LDC.Atlas.DataAccess.DapperMapper;
using System;

namespace LDC.Atlas.Services.Trading.Application.Queries.Dto
{
    public class SectionSummaryDto : PaginatedItem
    {
        public long PhysicalContractId { get; set; }

        public long SectionId { get; set; }

        public string ContractLabel { get; set; }

        public string Type { get; set; }

        public string Counterparty { get; set; }

        public DateTime? ContractDate { get; set; }

        public int PricingMethodId { get; set; }

        public int Status { get; set; }

        public string CommodityCode { get; set; }

        public string WeightCode { get; set; }

        public decimal Quantity { get; set; }

        public double? Price { get; set; }

        public string CurrencyCode { get; set; }

        public string PaymentTermCode { get; set; }

        public DateTime? BLDate { get; set; }

        public string DepartmentCode { get; set; }

        public string AllocatedToLabel { get; set; }

        public string ParentLabel { get; set; }

        public string CharterCode { get; set; }

        public string CompanyId { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public string PhysicalContractCode { get; set; }

        public string PrincipalCommodity { get; set; }

        [Column(Name = "Part2")]
        public string CommodityOrigin { get; set; }

        [Column(Name = "Part3")]
        public string CommodityGrade { get; set; }

        [Column(Name = "Part4")]
        public string CommodityLvl4 { get; set; }

        [Column(Name = "Part5")]
        public string CommodityLvl5 { get; set; }

        public string ShippingPeriod { get; set; }
    }
}
