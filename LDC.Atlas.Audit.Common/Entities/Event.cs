using System;

namespace LDC.Atlas.Audit.Common.Entities
{
    public class Event
    {
        public long EventId { get; set; }

        public long EventSubTypeId { get; set; }

        public long SourceId { get; set; }

        public string SourceBusinessCode { get; set; }

        public long StatusId { get; set; }

        public DateTime LastStatusDate { get; set; }

        public string CompanyId { get; set; }

        public string Message { get; set; }

        public Event() { }

        public Event(long eventSubTypeId, long sourceId, string sourceBusinessCode, long statusId, string companyId, string message)

        {
            EventSubTypeId = eventSubTypeId;
            SourceId = sourceId;
            SourceBusinessCode = sourceBusinessCode;
            StatusId = statusId;
            CompanyId = companyId;
            Message = message;
        }

        public Event(long eventId, long statusId,string message)

        {
            EventId = eventId;
            StatusId = statusId;
            Message = message;
        }

    }
}
