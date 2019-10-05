using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Queries.Dto
{
    public class TradeConfigurationDto
    {
        public bool BusinessSectorNominalTradingOperation { get; set; }

        public bool BusinessSectorNominalPostingPurpose { get; set; }

        public string CompanyId { get; set; }
    }
} 
