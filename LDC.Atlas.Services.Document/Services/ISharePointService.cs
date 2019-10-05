using Microsoft.Graph;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Document.Services
{
    public interface ISharePointService
    {
        Task<Site> GetAtlasSiteAsync();

        Task<Drive> GetGeneratedDocumentDriveAsync();

        Task<IDriveItemChildrenCollectionPage> GetGeneratedDocumentDriveItemsAsync(string folderName);

        Task<DriveItem> SaveFile(string filename, byte[] file);

        Task<DriveItem> GetFile(string fileId);

        Task<byte[]> DownloadFile(string fileId, bool pdf = false);

        Task DeleteFile(string fileId);

        Task AddPermissions(string fileId, string userEmail);
    }
}