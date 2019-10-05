using LDC.Atlas.DataAccess.DapperMapper;
using System;

namespace LDC.Atlas.Services.Trading.Entities
{
    public class FixingDetails
    {
        public int FixingDetailsId { get; set; }

        public int FixingFamilyId { get; set; }

        public DateTime FixedDate { get; set; }

        [Column(Name = "FixedNumberOfLot")]
        public int FixedNumberOfLots { get; set; }

        public decimal FixedPrice { get; set; }

        public string CurrencyCode { get; set; }

        public string FixTypeCode { get; set; }

        [Column(Name = "PromptMonth")]
        public DateTime PromptMonthDate { get; set; }

        [Column(Name = "FuturesOptionsCommodityCode")]
        public string CommodityCode { get; set; }

        public string Memo { get; set; }

        [Column(Name = "companyId")]
        public string Company { get; set; }
    }
}