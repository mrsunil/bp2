using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Application.Command.PricesUnits
{
    public class PricesUnitsBaseCommands
    {
        public class LocalPriceUnitDto
        {
            public long PriceUnitId { get; set; }

            public bool IsDeactivated { get; set; }
        }

        public class GlobalPriceUnitDto : LocalPriceUnitDto
        {
            public string MdmId { get; set; }

            public string PriceCode { get; set; }

            public string Description { get; set; }

            public decimal ConversionFactor { get; set; }

            public long? WeightUnitId { get; set; }
        }
    }
}
