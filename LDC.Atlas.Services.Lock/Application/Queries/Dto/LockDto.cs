using LDC.Atlas.Infrastructure.Json;
using Newtonsoft.Json;
using System;

namespace LDC.Atlas.Services.Lock.Application.Queries.Dto
{
    public class LockDto
    {
        public long LockId { get; set; }

        public string CompanyId { get; set; }

        public long ResourceId { get; set; }

        public string ResourceCode { get; set; }

        public int DataVersionId { get; set; }

        public string ResourceType { get; set; }

        public string LockOwner { get; set; }

        public DateTime LockAcquisitionDateTime { get; set; }

        public LockFunctionalContext FunctionalContext { get; set; }

        public string ApplicationSessionId { get; set; }

        public string CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public string ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }
    }
}