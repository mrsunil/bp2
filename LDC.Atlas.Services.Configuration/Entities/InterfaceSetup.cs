using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Entities
{
    public class InterfaceSetup
    {
        public long? InterfaceSetUpId { get; set; }

        public long? InterfaceTypeId { get; set; }

        public string LegalEntityCode { get; set; }

        public bool IsActive { get; set; }

        public string InterfaceCode { get; set; }
    }
}
