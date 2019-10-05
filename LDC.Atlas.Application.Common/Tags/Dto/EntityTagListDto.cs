using System.Collections.Generic;

namespace LDC.Atlas.Application.Common.Tags.Dto
{
    public class EntityTagListDto
    {
        public long EntityId { get; set; }

        public string EntityExternalId { get; set; }

        public string EntityTypeName { get; set; }

        public bool IsDeactivated { get; set; }

        public List<TagDto> Tags { get; set; }
    }
}