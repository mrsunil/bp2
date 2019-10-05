using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Trading.Application.Queries.Dto
{
    public class RecommendedCostMatriceDto
    {
        public long CostMatrixId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public IEnumerable<CostMatrixLineDto> CostMatrixLines { get; set; }

        public int BestMatch { get; set; }
    }
}
