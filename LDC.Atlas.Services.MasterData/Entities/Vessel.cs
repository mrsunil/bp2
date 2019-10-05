using System;

namespace LDC.Atlas.Services.MasterData.Entities
{
    public class Vessel
    {
        public long VesselId { get; set; }

        public string MDMId { get; set; }

        public string VesselName { get; set; }

        public string VesselDescription { get; set; }

        public string Imo { get; set; }

        public string Built { get; set; }

        public string DisplayName => Built;


        public int Flag { get; set; }

        public string CallSign { get; set; }

        public string Type { get; set; }

        public decimal Net { get; set; }

        public decimal Gross { get; set; }

        public decimal DeadWeightSummer { get; set; }

        public decimal DeadWeightWinter { get; set; }

        public bool IsDeactivated { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public string Description { get; set; }
    }
}