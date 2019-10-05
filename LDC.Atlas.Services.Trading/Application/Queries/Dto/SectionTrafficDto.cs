using System;

namespace LDC.Atlas.Services.Trading.Application.Queries.Dto
{
    public class SectionTrafficDto
    {
        public long SectionId { get; set; }

        public DateTime? BLDate { get; set; }

        public string BLReference { get; set; }

        public long? VesselId { get; set; }

        public string VesselCode { get; set; }

        public long? ShippingStatusId { get; set; }

        public string ShippingStatusCode { get; set; }

        public string CompanyId { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public DateTime? ContractDate { get; set; }
    }
}
