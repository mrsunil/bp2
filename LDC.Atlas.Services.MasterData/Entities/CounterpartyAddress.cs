using System;
using System.Collections.Generic;
using System.Text;

namespace LDC.Atlas.Services.MasterData.Entities
{
    public class CounterpartyAddress
    {
        public long? AddressId { get; set; }

        public short? AddressTypeID { get; set; }

        public string Address1 { get; set; }

        public string Address2 { get; set; }

        public string City { get; set; }

        public string ZIPCode { get; set; }

        public long? ProvinceID { get; set; }

        public long? CountryID { get; set; }

        public string Mail { get; set; }

        public string PhoneNo { get; set; }

        public string FaxNo { get; set; }

        public decimal? MDMId { get; set; }

        public long? CounterpartyID { get; set; }

        public bool? Main { get; set; }

        public long? LDCRegionId { get; set; }

        public bool IsDeactivated { get; set; }
    }
}
