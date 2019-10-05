using LDC.Atlas.DataAccess.DapperMapper;

namespace LDC.Atlas.Services.Execution.Application.Queries.Dto
{
    public class AllocationSummaryDto
    {
        public long SectionId { get; set; }

        public string Type { get; set; }

        public int Status { get; set; }

        public string WeightCode { get; set; }

        public decimal Quantity { get; set; }

        public string DepartmentCode { get; set; }

        public string CompanyId { get; set; }

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
        public long AllocatedSectionId { get; set; }

        public string CurrencyCode { get; set; }

        public string Counterparty { get; set; }

    }
}
