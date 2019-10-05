using LDC.Atlas.DataAccess.DapperMapper;
using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Trading.Entities
{
    public class FixingFamily
    {
        public FixingFamily()
        {
            Details = new List<FixingDetails>();
        }

        [Column(Name = "FixingFamilyId")]
        public int FixingFamilyCode { get; set; }

        public string FixTypeCode { get; set; }

        [Column(Name = "FuturesOptionsCommodityCode")]
        public string CommodityCode { get; set; }

        [Column(Name = "PromptMonth")]
        public DateTime PromptMonthDate { get; set; }

        public int NumberOfLots { get; set; }

        public string CurrencyCode { get; set; }

        [Column(Name = "PriceTypeCode")]
        public string PriceCode { get; set; }

        public int FixedLots { get; set; }

        public decimal AveragePrice { get; set; }

        public bool IsFullyFixed { get; set; }

        public IEnumerable<FixingDetails> Details { get; set; }
    }
}
