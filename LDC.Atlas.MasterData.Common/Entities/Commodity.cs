using System;

namespace LDC.Atlas.MasterData.Common.Entities
{
    public class Commodity
    {
        public long CommodityId { get; set; }

        public string PrincipalCommodity { get; set; }

        public int MDMId { get; set; }

        public string CommodityType { get; set; }

        public string Part2 { get; set; }

        public string Part3 { get; set; }

        public string Part4 { get; set; }

        public string Part5 { get; set; }

        public string Description { get; set; }

        public string ArbitrationCode { get; set; }

        public string Currency { get; set; }

        public long WeightUnitId { get; set; }

        public string WeightCode { get; set; }

        public long PriceUnitId { get; set; }

        public string PriceCode { get; set; }

        public string CountryCode { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }
    }
}
