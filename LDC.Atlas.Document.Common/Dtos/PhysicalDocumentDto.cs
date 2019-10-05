using System;

namespace LDC.Atlas.Document.Common.Dtos
{
    public class PhysicalDocumentDto : PhysicalDocumentBaseDto
    {
        public long PhysicalDocumentId { get; set; }

        public int VersionNumber { get; set; }

        public long DmsId { get; set; }

        public DateTime DmsSentDate { get; set; }
    }
}
