using Newtonsoft.Json;
using System;
using System.IO;

namespace LDC.Atlas.Document.Common.Dtos
{
    public class PhysicalDocumentBaseDto
    {
        public string DocumentName { get; set; }

        public string DocumentTemplate { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public string CompanyId { get; set; }

        public long RecordId { get; set; }

        public int TableId { get; set; }

        public int PhysicalDocumentTypeId { get; set; }

        public string PhysicalDocumentTypeLabel { get; set; }

        public int PhysicalDocumentStatusId { get; set; }

        [JsonIgnore]
#pragma warning disable CA1819 // Properties should not return arrays
        public byte[] FileContent { get; set; }
#pragma warning restore CA1819 // Properties should not return arrays

        public string MimeType { get; set; }

        [JsonIgnore]
        public string DocumentExtension { get { return Path.GetExtension(DocumentName); } }
    }
}
