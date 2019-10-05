using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Entities
{
    public class CounterpartyTax
    {
        public long? CounterpartyTaxId { get; set; }

        public long? CounterpartyId { get; set; }

        public long CountryId { get; set; }

        public string VATRegistrationNumber { get; set; }

        public bool Main { get; set; }

        public bool IsDeactivated { get; set; }
    }
}
