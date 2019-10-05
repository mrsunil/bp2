using LDC.Atlas.Document.Common.Dtos;
using LDC.Atlas.Services.Document.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Document.Repositories
{
    public interface IDocumentRepository
    {
        Task<IEnumerable<PhysicalDocumentDto>> GetGeneratedDocumentsAsync(string companyId, long recordId, int? tableId, int? documentType, int? offset, int? limit);

        Task<PhysicalDocumentDto> GetGeneratedDocumentByIdAsync(long generatedDocumentId);

        Task<PhysicalDraftDocumentDto> GetDraftDocumentByIdAsync(long generatedDocumentId);

        Task<long> CreateDocument(PhysicalDraftDocumentDto generatedDocument, bool isDraft = false);

        Task<ContractAdviceInfo> GetContractAdviceInfoAsync(long sectionId, string company);
    }
}
