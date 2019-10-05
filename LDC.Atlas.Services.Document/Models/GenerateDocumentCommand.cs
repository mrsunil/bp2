using LDC.Atlas.Document.Common.Entities;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LDC.Atlas.Services.Document.Models
{
    public class GenerateDocumentCommand
    {
        public PhysicalDocumentType PhysicalDocumentTypeId { get; set; }

        public string DocumentTemplatePath { get; set; }

        [Required]
        public string DocumentName { get; set; }

        public long RecordId { get; set; }

        public int TableId { get; set; }

        public IDictionary<string, string> Parameters { get; set; }

        public bool IsDraft { get; set; }
    }
}
