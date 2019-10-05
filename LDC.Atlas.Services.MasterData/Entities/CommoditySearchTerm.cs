using Microsoft.AspNetCore.Mvc;

namespace LDC.Atlas.Services.MasterData.Entities
{
    public class CommoditySearchTerm
    {
        [FromQuery]
        public string PrincipalCommodity { get; set; }

        [FromQuery]
        public string Part2 { get; set; }

        [FromQuery]
        public string Part3 { get; set; }

        [FromQuery]
        public string Part4 { get; set; }

        [FromQuery]
        public string Part5 { get; set; }
    }
}
