using System;

namespace LDC.Atlas.Services.Trading.Entities
{
    public class SectionTraffic
    {
        public long SectionId { get; set; }

        public DateTime? BLDate { get; set; }

        public string BLReference { get; set; }

        public string VesselCode { get; set; }

        public string CompanyId { get; set; }

        public long? DataVersionId { get; set; }

        public DateTime? ContractDate { get; set; }

        public string PortDestination { get; set; }

        public string PortOrigin { get; set; }

        public string MarketSector { get; set; }

        public string ShippingStatusCode { get; set; }
    }
}
