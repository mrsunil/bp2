using LDC.Atlas.Services.Execution.Entities;
using MediatR;
using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Execution.Application.Commands
{
    public class AssignSectionsToCharterCommand : IRequest
    {
        internal string Company { get; set; } // internal to avoid the exposure in Swagger

        internal long CharterId { get; set; } // internal to avoid the exposure in Swagger

        public IEnumerable<SectionTraffic> SectionsTraffic { get; set; }
    }

    public class CreateCharterCommand : IRequest<CharterReference>
    {
        internal string Company { get; set; } // internal to avoid the exposure in Swagger

        public string Reference { get; set; }

        public string Description { get; set; }

        public long VesselId { get; set; }

        public string TransportType { get; set; }

        public string LoadingLocation { get; set; }

        public DateTime? DepartureDate { get; set; }

        public string DischargeLocation { get; set; }

        public DateTime? ArrivalDate { get; set; }

        public long? CharterManagerId { get; set; }

        public string Memo { get; set; }

        public DateTime? BlDate { get; set; }

        public string Currency { get; set; }

        public long? DepartmentId { get; set; }

        public string BLRef { get; set; }

        public long WeightUnitId { get; set; }

        public IEnumerable<SectionsAssignedToCharterRecord> SectionsAssigned { get; set; }
    }

    public class RemoveSectionsFromCharterCommand : IRequest
    {
        public string Company { get; set; }

        public long CharterId { get; set; }

        public IEnumerable<long> SectionIds { get; set; }
    }

    public class ReassignSectionsForCharterCommand : IRequest
    {
        public string Company { get; set; }

        public long CharterId { get; set; }

        public long NewCharterId { get; set; }

        public string NewCharterVesselCode { get; set; }

        public IEnumerable<SectionsAssignedToCharterRecord> SectionsAssigned { get; set; }
    }

    public class DeleteCharterCommand : IRequest
    {
        public string Company { get; set; }

        public long CharterId { get; set; }
    }

    public class UpdateCharterCommand : IRequest
    {
        public long CharterId { get; set; } // internal to avoid the exposure in Swagger

        internal string Company { get; set; } // internal to avoid the exposure in Swagger

        public string Reference { get; set; }

        public string Description { get; set; }

        public long VesselId { get; set; }

        public string Vessel { get; set; }

        public string TransportType { get; set; }

        public string LoadingLocation { get; set; }

        public DateTime? DepartureDate { get; set; }

        public string DischargeLocation { get; set; }

        public DateTime? ArrivalDate { get; set; }

        public long? CharterManagerId { get; set; }

        public string Memo { get; set; }

        public DateTime? BlDate { get; set; }

        public string Currency { get; set; }

        public long? DepartmentId { get; set; }

        public string BLRef { get; set; }

        public long WeightUnitId { get; set; }

        public bool IsDeassignSectionRequest { get; set; }

        public IEnumerable<SectionsAssignedToCharterRecord> SectionsAssigned { get; set; }
    }

    public class CharterReference
    {
        public long CharterId { get; set; }

        public string CharterCode { get; set; }
    }

    public class CloseCharterCommand : IRequest
    {
        public string Company { get; set; }

        public long[] CharterIds { get; set; }
        public int? DataVersionid { get; set; }
    }

    public class ReopenCharterCommand : IRequest
    {
        public string Company { get; set; }

        public long[] CharterIds { get; set; }

        public int? DataVersionid { get; set; }
    }
}
