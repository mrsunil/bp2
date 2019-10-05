using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace LDC.Atlas.Application.Common.Configuration.Dto
{
    public class FunctionalObjectDto
    {
        public int FunctionalObjectId { get; set; }

        public string FunctionalObjectName { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public IEnumerable<ApplicationTableDto> Tables { get; set; }
    }

    public class FunctionalObjectTableDto : ApplicationTableDto
    {
        public int FunctionalObjectId { get; set; }
    }

    public class FunctionalObjectFieldDto : ApplicationFieldDto
    {
        public int TableId { get; set; }
    }
}
