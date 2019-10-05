using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Application.Queries.Dto
{
    public class ProcessMessageDto
    {
        public string Name { get; set; }

        public string Content { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string Status { get; set; }

        public long Retry { get; set; }

        public string Error { get; set; }

        public long MessageId { get; set; }
    }
}
