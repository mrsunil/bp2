using System;
using System.Collections.Generic;
using System.Text;

namespace LDC.Atlas.Document.Common.Dtos
{
    public class TemplatesBestMatchDto
    {
        public long EntityId { get; set; }
        public string PhysicalDocumentId { get; set; }

        /// <summary>
        /// BestMatch field.
        /// </summary>
        public int BestMatch { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }
    }
}
