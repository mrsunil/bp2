using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Entities
{
    public class PhysicalTradeBulkEdit
    {
        internal string CompanyId { get; set; }

        public long? DataVersionId { get; set; }


        public IEnumerable<PhysicalContractToUpdate> PhysicalContractToUpdate { get; set; }

        public IEnumerable<SectionToUpdate> SectionToUpdate { get; set; }
    }
}
