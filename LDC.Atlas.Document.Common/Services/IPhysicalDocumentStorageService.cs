using LDC.Atlas.Document.Common.Dtos;
using LDC.Atlas.Document.Common.Entities;
using System.Threading.Tasks;

namespace LDC.Atlas.Document.Common.Services
{
    public interface IPhysicalDocumentStorageService
    {
        Task<long> UploadDocument(UploadDocumentParameters uploadParameters);

        Task<PhysicalDocumentDto> DownloadDocumentByIdAsync(long physicalDocumentId, string company);

        Task<PhysicalDraftDocumentDto> DownloadDraftDocumentByIdAsync(long physicalDocumentId);

        Task<long> MoveDraftDocument(long physicalDocumentId);

        Task UpdateDocumentStatus(long physicalDocumentId, PhysicalDocumentStatus physicalDocumentStatus);
    }
}
