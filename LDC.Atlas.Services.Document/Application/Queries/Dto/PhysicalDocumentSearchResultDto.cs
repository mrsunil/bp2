using LDC.Atlas.Application.Core.Entities;
using LDC.Atlas.Document.Common.Entities;
using System;

namespace LDC.Atlas.Services.Document.Application.Queries
{
    public class PhysicalDocumentSearchResultDto : PaginatedItem
    {
        public string DocumentType { get; set; }

        public string DocumentName { get; set; }

        public string DocumentReference { get; set; }

        public string DocumentStatus { get; set; }

        public string Counterparty { get; set; }

        public string Contract { get; set; }

        public string Charter { get; set; }

        public string Department { get; set; }

        public DateTime CreatedOn { get; set; }

        public string CreatedBy { get; set; }

        public long PhysicalDocumentId { get; set; }

        public long RecordId { get; set; }

        public PhysicalDocumentStatus PhysicalDocumentStatus { get; set; }

        public PhysicalDocumentType PhysicalDocumentType { get; set; }

        public string DocumentTemplate { get; set; }
    }
}
