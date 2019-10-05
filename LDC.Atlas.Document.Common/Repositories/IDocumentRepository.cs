using LDC.Atlas.Document.Common.Dtos;
using LDC.Atlas.Document.Common.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Document.Common.Repositories
{
    public interface IDocumentRepository
    {
        Task<IEnumerable<PhysicalDocumentDto>> GetGeneratedDocumentsAsync(string companyId, long recordId, int tableId, int? documentType, int? offset, int? limit);

        Task<PhysicalDocumentDto> GetGeneratedDocumentByIdAsync(long documentId, string company);

        Task<PhysicalDraftDocumentDto> GetDraftDocumentByIdAsync(long documentId);

        Task<long> CreateDocument(PhysicalDocumentDto document);

        Task<long> CreateDraftDocument(PhysicalDraftDocumentDto document);

        Task<long> CreateDocumentFromDraft(long documentId);

        Task UpdateDocumentStatus(long documentId, PhysicalDocumentStatus documentStatus);
    }
}
