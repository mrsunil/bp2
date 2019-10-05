using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Lock.Application.Queries.Dto
{
    public class UnlockDto
    {
        public string CompanyId { get; set; }

        public string ResourceType { get; set; }

        public long ResourceId { get; set; }

        public string ApplicationSessionId { get; set; }
    }
}
