using System;
using System.Collections.Generic;
using System.Text;

namespace LDC.Atlas.Audit.Common.Queries.Dto
{
    public class EventHistoryDto
    {
        public long EventHistoryId { get; set; }

        public string Action { get; set; }

        public string Message { get; set; }

        public string ResultCode { get; set; }

        public string ResultMessage { get; set; }
    }
}
