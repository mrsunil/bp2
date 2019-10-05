using System;

namespace LDC.Atlas.Services.Document.Entities
{
    public class PhysicalDocumentTemplateDto
    {
        public string DocumentTemplateId { get; set; }

        public string Name { get; set; }

        public string Path { get; set; }

        public string Description { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }
    }
}