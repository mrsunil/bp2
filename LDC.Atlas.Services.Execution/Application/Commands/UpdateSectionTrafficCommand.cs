using MediatR;
using System;

namespace LDC.Atlas.Services.Execution.Application.Commands
{
    public class UpdateSectionTrafficCommand : IRequest
    {
        internal string CompanyId { get; set; }

        public long? DataVersionId { get; set; }

        public long SectionId { get; set; }

        public DateTime? BLDate { get; set; }

        public string BLReference { get; set; }

        public string VesselCode { get; set; }

        public string ShippingStatusCode { get; set; }

        public DateTime? ContractDate { get; set; }
    }
}
