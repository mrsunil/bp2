using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Audit.Application.Queries.Dto
{
    /// <summary>
    /// For getting the event history details
    /// </summary>
    public class EventHistoryDto
    {
        public long EventHistoryId { get; set; }

        public long EventId { get; set; }

        public string Action { get; set; }

        public string Message { get; set; }

        public string ResultCode { get; set; }

        public string ResultMessage { get; set; }

        public DateTime CreatedDateTime { get; set; }
    }
}
