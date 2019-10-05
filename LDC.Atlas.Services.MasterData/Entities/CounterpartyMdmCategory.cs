using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Entities
{
    public class CounterpartyMdmCategory
    {
        public long? CounterPartyID { get; set; }

        public long? CounterPartyMDMCategoryId { get; set; }

        public long? MdmCategoryID { get; set; }
    }
}
