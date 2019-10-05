using LDC.Atlas.Document.Common.Entities;

namespace LDC.Atlas.Services.Document.Models
{
    public class CreateDocumentCommand
    {
        public string SharePointFileId { get; set; }

        public PhysicalDocumentType PhysicalDocumentTypeId { get; set; }

        public string DocumentName { get; set; }

        public string DocumentTemplateLabel { get; set; }

        public long RecordId { get; set; }

        public int TableId { get; set; }
    }
}
