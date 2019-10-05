using System;

namespace LDC.Atlas.Services.Audit.Application.Queries.Dto
{
    public class EventDto
    {
        public long EventId { get; set; }

        public string Interface { get; set; }

        public string BusinessObject { get; set; }

        public string DocumentReference { get; set; }

        public string Status { get; set; }

        public DateTime StatusDateTime { get; set; }

        public string CompanyId { get; set; }

        public string Error { get; set; }

        public int? InterfaceStatus { get; set; }

        public int? InterfaceType { get; set; }

        public long SourceId { get; set; }
    }
}
