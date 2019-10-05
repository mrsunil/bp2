using System;
using System.Collections.Generic;
using System.Text;

namespace LDC.Atlas.Services.MasterData.Entities
{
    public class CounterpartyContact
    {
        public long? ContactId { get; set; }

        public int? Title { get; set; }

        public string ContactName { get; set; }

        public string Surname { get; set; }

        public string FirstName { get; set; }

        public string ExtraInitials { get; set; }

        public string JobRole { get; set; }

        public string Domain { get; set; }

        public string Address1 { get; set; }

        public string Address2 { get; set; }

        public string ZipCode { get; set; }

        public string City { get; set; }

        public long CountryId { get; set; }

        public string Email { get; set; }

        public string PhoneNo { get; set; }

        public string MobilePhoneNo { get; set; }

        public string PrivatePhoneNo { get; set; }

        public string Communications { get; set; }

        public long? CounterpartyId { get; set; }

        public bool Main { get; set; }

        public bool IsDeactivated { get; set; }
    }
}
