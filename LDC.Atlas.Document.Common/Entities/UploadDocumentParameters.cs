namespace LDC.Atlas.Document.Common.Entities
{
    public class UploadDocumentParameters
    {
        public string CompanyId { get; set; }

        public PhysicalDocumentType PhysicalDocumentTypeId { get; set; }

        public PhysicalDocumentStatus PhysicalDocumentStatus { get; set; }

        public string DocumentName { get; set; }

        public string DocumentTemplatePath { get; set; }

        public long RecordId { get; set; }

        public int TableId { get; set; }

#pragma warning disable CA1819 // Properties should not return arrays
        public byte[] File { get; set; }
#pragma warning restore CA1819 // Properties should not return arrays

        public bool IsDraft { get; set; }
    }
}
