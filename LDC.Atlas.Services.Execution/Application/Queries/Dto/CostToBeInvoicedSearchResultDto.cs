using LDC.Atlas.DataAccess.DapperMapper;
using System;

namespace LDC.Atlas.Services.Execution.Application.Queries.Dto
{
    public class CostToBeInvoicedSearchResultDto
    {
        public long CostId { get; set; }

        public long SectionId { get; set; }

        public string ContractLabel { get; set; }

        [Column(Name = "M_CostType")]
        public string CostTypeCode { get; set; }

        [Column(Name = "M_SupplierCode")]
        public string SupplierCode { get; set; }

        public string CurrencyCode { get; set; }

        [Column(Name = "E_RateType")]
        public int RateType { get; set; }

        public decimal Rate { get; set; }

        [Column(Name = "E_PricingMethod")]
        public int PricingMethod { get; set; }

        [Column(Name = "E_CostDirection")]
        public int CostDirection { get; set; }

        public decimal? OriginalEstimatePMTValue { get; set; }

        public decimal? OriginalEstimateFullValue { get; set; }

        public decimal? CalculatedFullValue { get; set; }

        public string Charter { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? CreationDate { get; set; }

        [Column(Name = "ModifiedBy")]
        public string LastModifiedBy { get; set; }

        [Column(Name = "ModifiedDate")]
        public DateTime? LastModifiedDate { get; set; }

        public decimal? AmountInvoiced { get; set; }

        public decimal? Quantity { get; set; }
    }
}
