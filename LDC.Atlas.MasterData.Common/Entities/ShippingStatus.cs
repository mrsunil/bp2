using System;

namespace LDC.Atlas.MasterData.Common.Entities
{
    public class ShippingStatus
    {
        public long ShippingStatusId { get; set; }

        public string MdmId { get; set; }

        public string ShippingStatusCode { get; set; }

        public string Description { get; set; }

        public bool InclWrhseReport { get; set; }

        public bool InclAfloatReport { get; set; }

        public bool ActAsDelivered { get; set; }

        public bool ActAsWrittenOff { get; set; }

        public bool ActAsCallOff { get; set; }

        public bool ActAsRouted { get; set; }

        public bool ActAsOnRoad { get; set; }

        public bool ActAsManufactured { get; set; }

        public bool ActAsOnHold { get; set; }

        public bool ActAsBeingMoved { get; set; }

        public bool ReadyForForwarder { get; set; }

        public bool IsDeactivated { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }
    }
}
