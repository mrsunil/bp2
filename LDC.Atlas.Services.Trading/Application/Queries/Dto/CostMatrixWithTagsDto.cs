
using LDC.Atlas.Application.Common.Tags.Dto;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Trading.Application.Queries.Dto
{
    public class CostMatrixWithTagsDto
    {
        public long CostMatrixId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public IEnumerable<TagDto> Tags { get; set; }
    }
}
