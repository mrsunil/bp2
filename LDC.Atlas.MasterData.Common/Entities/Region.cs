using System;

namespace LDC.Atlas.MasterData.Common.Entities
{
    public class Region
    {
        public long RegionId { get; set; }

        public string MdmId { get; set; }

        public string RegionCode { get; set; }

        public string Description { get; set; }

        public bool IsDeactivated { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }
    }
}
