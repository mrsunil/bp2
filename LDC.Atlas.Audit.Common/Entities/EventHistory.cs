using System;

namespace LDC.Atlas.Audit.Common.Entities
{
        public class EventHistory
        {
        public long EventHistoryId { get; set; }

        public long EventId { get; set; }

        public string Action { get; set; }

        public string Message { get; set; }

        public string ResultCode { get; set; }

        public string ResultMessage { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public EventHistory() { }

        public EventHistory(long eventId, string action, string message, string resultCode, string resultMessage) {
            EventId = eventId;
            Action = action;
            Message = message;
            ResultCode = resultCode;
            ResultMessage = resultMessage;
        }
    }
}
