using LDC.Atlas.Application.Common.Tags.Dto;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Document.Application.Queries.Dto
{
    public class CreateOrUpdateTagsForTemplatesDto
    {
        public int EntityId { get; set; }

        public string EntityExternalId { get; set; }

        public ICollection<TagDto> Tags { get; set; }

        public bool IsDeactivated { get; set; }
    }
}
