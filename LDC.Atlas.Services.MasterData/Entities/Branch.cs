using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Entities
{
    public class Branch
    {
        public long BranchId { get; set; }

        public string MDMId { get; set; }

        public string BranchCode { get; set; }

        public string Description { get; set; }

        public long CountryId { get; set; }

        public bool IsDeactivated { get; set; }
    }
}
