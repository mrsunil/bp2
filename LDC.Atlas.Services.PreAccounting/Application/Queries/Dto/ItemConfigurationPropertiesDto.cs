using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Application.Queries.Dto
{
    /// <summary>
    /// Dto To Read Accounting Entries Configuration
    /// </summary>
    public class ItemConfigurationPropertiesDto
    {
        public string Id { get; set; }

        public string DisplayName { get; set; }

        public bool IsMandatory { get; set; }

        public string DefaultValue { get; set; }

        public string Format { get; set; }

        public bool IsEditable { get; set; }
    }
}
