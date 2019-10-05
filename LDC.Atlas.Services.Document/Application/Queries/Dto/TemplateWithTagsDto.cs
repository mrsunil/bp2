using LDC.Atlas.Application.Common.Tags.Dto;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Document.Application.Queries.Dto
{
    public class TemplateWithTagsDto
    {
        public long EntityId { get; set; }

        public string EntityExternalId { get; set; }

        public string Name { get; set; }

        public bool IsDeactivated { get; set; }

        public IEnumerable<TagDto> Tags { get; set; }
    }
}
