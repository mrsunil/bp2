using System.Collections.Generic;

namespace LDC.Atlas.Services.Trading.Application.Queries.Dto
{
    public class CostMatrixParametersDto
    {
        public long CostMatrixId { get; set; }

        public string Company { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public IEnumerable<CostMatrixLineDto> CostMatrixLines { get; set; }

        public IEnumerable<TagLineDto> Tags { get; set; }
    }
}
