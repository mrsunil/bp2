using System;

namespace LDC.Atlas.Services.MasterData.Entities
{
    public class Province
    {
        public long ProvinceId { get; set; }

        public string MdmId { get; set; }

        public string StateCode { get; set; }

        public string Description { get; set; }

        public string AltCode { get; set; }

        public long CountryId { get; set; }

        public bool IsDeactivated { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }
    }
}
