using System;

namespace LDC.Atlas.MasterData.Common.Entities
{
    public class Country
    {
        public long CountryId { get; set; }

        public string MdmId { get; set; }

        public string CountryCode { get; set; }

        public string Description { get; set; }

        public long RegionId { get; set; }

        public float TimezoneHrs { get; set; }

        public string ECCode { get; set; }

        public string ECNumber { get; set; }

        public bool ZipAfter { get; set; }

        public string ISOCode { get; set; }

        public bool OFACRestricted { get; set; }

        public bool NISO { get; set; }

        public string CurrencyCode { get; set; }

        public bool IsDeactivated { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }
    }
}
