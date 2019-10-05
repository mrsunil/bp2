using Newtonsoft.Json;
using System.Collections.Generic;

namespace LDC.Atlas.Application.Common.Configuration.Dto
{
    public class UserFilterSetDto
    {
        public int FilterSetId { get; set; }

        public string Name { get; set; }

        public bool IsDefault { get; set; }

        public bool IsSharedWithAllUsers { get; set; }

        public bool IsSharedWithAllCompanies { get; set; }

        public string CompanyId { get; set; }

        public bool IsUserDefault { get; set; }

        public long OwnerId { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public IEnumerable<FilterDto> Filters { get; set; }
    }
}