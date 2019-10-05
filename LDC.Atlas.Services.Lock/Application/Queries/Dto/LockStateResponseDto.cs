using LDC.Atlas.Infrastructure.Json;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Lock.Application.Queries.Dto
{
    public class LockStateResponseDto
    {
        public bool IsLocked { get; set; }

        public long LockId { get; set; }

        public string CompanyId { get; set; }

        public long ResourceId { get; set; }

        public string ResourceCode { get; set; }

        public int DataVersionId { get; set; }

        public string ResourceType { get; set; }

        public string LockOwner { get; set; }

        [JsonConverter(typeof(IsoDateConverter))]
        public DateTime LockAcquisitionDateTime { get; set; }

        public LockFunctionalContext? FunctionalContext { get; set; }

        public string ApplicationSessionId { get; set; }
    }
}
