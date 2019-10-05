using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Entities
{
    public class CounterpartyCompany
    {
        public long? CounterpartyID { get; set; }

        public string C2CCode { get; set; }

        public int CompanyId { get; set; }

        public long? DepartmentId { get; set; }

        public bool IsDeactivated { get; set; }
    }
}
