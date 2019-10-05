using LDC.Atlas.DataAccess.DapperMapper;
using System;

namespace LDC.Atlas.MasterData.Common.Entities
{
    public class Vessel
    {
        public long VesselId { get; set; }

        public string VesselCode { get; set; }

        [Column(Name = "Description")]
        public string VesselDescription { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public string Built { get; set; }

        public int Flag { get; set; }
    }
}