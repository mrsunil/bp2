using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Application.Commands.Dto
{
    public class TradeSetupDto
    {
        public long TradeSetupId { get; set; }

        public int CompanyId { get; set; }

        public bool BusinessSectorNominalTradingOperation { get; set; }

        public bool BusinessSectorNominalPostingPurpose { get; set; }

        public long WeightUnitId { get; set; }
    }
}
