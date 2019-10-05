using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Entities
{
    public class PhysicalContractToUpdate
    {
        public long PhysicalContractId { get; set; }

        public DateTime? ContractDate { get; set; }

        public long UserId { get; set; }
    }
}
