using Newtonsoft.Json;
using System.Collections.Generic;

namespace LDC.Atlas.Application.Common.Configuration.Dto
{
    public class ApplicationTableDto
    {
        public int TableId { get; set; }

        public string TableName { get; set; }

        public string TableSchema { get; set; }

        public string Description { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public IEnumerable<ApplicationFieldDto> Fields { get; set; }
    }
}
