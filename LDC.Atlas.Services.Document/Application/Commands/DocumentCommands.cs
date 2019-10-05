using LDC.Atlas.Document.Common.Entities;
using MediatR;

namespace LDC.Atlas.Services.Document.Application.Commands
{
    public class GenerateContractAdviceCommand : IRequest<long>
    {
        internal string CompanyId { get; set; } // internal to avoid the exposure in Swagger

        internal int TableId { get; set; } // internal to avoid the exposure in Swagger

        public string DocumentTemplatePath { get; set; }

        public long SectionId { get; set; }
    }

    public class UploadDocumentCommand : IRequest<long>
    {
        internal string CompanyId { get; set; } // internal to avoid the exposure in Swagger

        internal byte[] File { get; set; } // internal to avoid the exposure in Swagger

        internal bool IsDraft { get; set; } // internal to avoid the exposure in Swagger

        internal int TableId { get; set; } // internal to avoid the exposure in Swagger

        public PhysicalDocumentType PhysicalDocumentTypeId { get; set; }

        public string DocumentName { get; set; }

        public string DocumentTemplatePath { get; set; }

        public long RecordId { get; set; }
    }
}
