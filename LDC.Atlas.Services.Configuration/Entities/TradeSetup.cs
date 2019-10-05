using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Entities
{
    public class TradeSetup
    {
        public int TradeSetupId { get; set; }

        public string CompanyId { get; set; }

        public bool BusinessSectorNominalTradingOperation { get; set; }

        public bool BusinessSectorNominalPostingPurpose { get; set; }

        public long WeightUnitId { get; set; }
    }
}
