using System;
using System.Collections.Generic;
using System.Text;

namespace LDC.Atlas.Audit.Common.Queries.Dto
{
    public class EventDto
    {
        public long EventId { get; set; }

        public long EventTypeId { get; set; }

        public long EventSubTypeId { get; set; }

        public long SourceId { get; set; }

        public short StatusId { get; set; }

        public string LastMessage { get; set; }

        public string CompanyId { get; set; }

        public string SourceBusinessCode { get; set; }

        public long InterfaceObjectTypeId { get; set; }

        public EventDto() { }

        public EventDto(long sourceId, string sourceBusinessCode, long interfaceObjectTypeId, string companyId) {
            SourceId = sourceId;
            SourceBusinessCode = sourceBusinessCode;
            InterfaceObjectTypeId = interfaceObjectTypeId;
            CompanyId = companyId;
        }
    }
}
