using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Entities
{
    public class InterCoNoInterCoEmailSetup
    {
        public long? ConfigId { get; set; }

        public string CompanyId { get; set; }

        public long UserId { get; set; }

        public bool IsDeactivated { get; set; }

        public bool IsInterCo { get; set; }
    }
}
