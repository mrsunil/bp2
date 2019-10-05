using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Entities
{
    public class CounterpartyAccountType
    {
        public long? CounterpartyID { get; set; }

        public long? CounterPartyAccountTypeId { get; set; }

        public long? AccountTypeId { get; set; }

        public bool IsDeactivated { get; set; }
    }
}
