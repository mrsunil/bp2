using LDC.Atlas.DataAccess.DapperMapper;
using System;

namespace LDC.Atlas.Services.MasterData.Entities
{
    public class Port
    {
        public long PortId { get; set; }

        public string PortCode { get; set; }

        public string Description { get; set; }

        public string DisplayName => PortCode;

        public int CountryId { get; set; }

        public string MDMId { get; set; }

        public string Type { get; set; }

        public string Address { get; set; }

        public long? ProvinceId { get; set; }

        public bool IsDeactivated { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public string CountryCode { get; set; }

        public string CountryDescription { get; set; }

    }
}
