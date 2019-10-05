using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Queries.Dto
{
    public class ItemConfigurationPropertiesDto
    {
        public string Id { get; set; }

        public string DisplayName { get; set; }

        public bool IsMandatory { get; set; }

        public string DefaultValue { get; set; }

        public string Format { get; set; }

    }
}
