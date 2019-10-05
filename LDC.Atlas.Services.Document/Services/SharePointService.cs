using LDC.Atlas.Services.Document.Models;
using Microsoft.Extensions.Options;
using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Document.Services
{
    public class SharePointService : ISharePointService
    {
        private readonly IOptions<SharePointConfiguration> _sharePointConfigurations;
        private readonly IGraphClientProvider _graphClientProvider;

        public SharePointService(IOptions<SharePointConfiguration> sharePointConfigurations, IGraphClientProvider graphClientProvider)
        {
            _sharePointConfigurations = sharePointConfigurations ?? throw new ArgumentNullException(nameof(sharePointConfigurations));
            _graphClientProvider = graphClientProvider ?? throw new ArgumentNullException(nameof(graphClientProvider));
        }

        public async Task<Site> GetAtlasSiteAsync()
        {
            // https://github.com/microsoftgraph/msgraph-sdk-dotnet
            var graphClient = _graphClientProvider.GetGraphServiceClient();

            var site = await graphClient.Sites.GetByPath(_sharePointConfigurations.Value.SiteRelativePath, _sharePointConfigurations.Value.Hostname).Request().GetAsync();

            return site;
        }

        public async Task<Drive> GetGeneratedDocumentDriveAsync()
        {
            var graphClient = _graphClientProvider.GetGraphServiceClient();

            var site = await GetAtlasSiteAsync();

            var drives = await graphClient.Sites[site.Id].Drives.Request().GetAsync();

            var drive = drives.FirstOrDefault(d => d.Name == _sharePointConfigurations.Value.DriveName);

            return drive;
        }

        public async Task<IDriveItemChildrenCollectionPage> GetGeneratedDocumentDriveItemsAsync(string folderName)
        {
            var graphClient = _graphClientProvider.GetGraphServiceClient();

            var drive = await GetGeneratedDocumentDriveAsync();

            IDriveItemChildrenCollectionPage filesCollection;
            if (string.IsNullOrWhiteSpace(folderName))
            {
                // List the files in the folder
                filesCollection = await graphClient.Drives[drive.Id].Root.ItemWithPath(folderName).Children.Request().GetAsync();
            }
            else
            {
                filesCollection = await graphClient.Drives[drive.Id].Root.Children.Request().GetAsync();
            }

            return filesCollection;
        }

        public async Task<DriveItem> SaveFile(string filename, byte[] file)
        {
            // https://github.com/OneDrive/onedrive-sdk-csharp/blob/master/docs/chunked-uploads.md
            // https://stackoverflow.com/questions/44625083/object-reference-not-set-to-an-object-while-file-upload-in-onedrive
            var drive = await GetGeneratedDocumentDriveAsync();

            var graphClient = _graphClientProvider.GetGraphServiceClient();

            var path = System.Net.WebUtility.UrlEncode(filename);

            var uploadSession = await graphClient.Drives[drive.Id].Root.ItemWithPath(path).CreateUploadSession().Request().PostAsync();

            MemoryStream memoryStream = new MemoryStream();
            memoryStream.Write(file);
            memoryStream.Seek(0, SeekOrigin.Begin);

            var provider = new ChunkedUploadProvider(uploadSession, graphClient, memoryStream);

            var uploadedItem = await provider.UploadAsync();

            return uploadedItem;
        }

        public async Task AddPermissions(string fileId, string userEmail)
        {
            var graphClient = _graphClientProvider.GetGraphServiceClient();

            var drive = await GetGeneratedDocumentDriveAsync();

            List<DriveRecipient> recipients = new List<DriveRecipient> { new DriveRecipient { Email = userEmail } };

            List<string> roles = new List<string> { "write" };

            await graphClient.Drives[drive.Id].Items[fileId].Invite(recipients, true, roles, false).Request().PostAsync();
        }

        public async Task<DriveItem> GetFile(string fileId)
        {
            var drive = await GetGeneratedDocumentDriveAsync();

            var graphClient = _graphClientProvider.GetGraphServiceClient();

            var driveItem = await graphClient.Drives[drive.Id].Items[fileId].Request().GetAsync();

            return driveItem;
        }

        public async Task<byte[]> DownloadFile(string fileId, bool pdf = false)
        {
            var drive = await GetGeneratedDocumentDriveAsync();

            var graphClient = _graphClientProvider.GetGraphServiceClient();

            List<QueryOption> options = null;
            if (pdf)
            {
                options = new List<QueryOption>
                {
                    new QueryOption("format", "pdf")
                };
            }

            var contentStream = await graphClient.Drives[drive.Id].Items[fileId].Content.Request(options).GetAsync();

            if (contentStream is MemoryStream stream)
            {
                return stream.ToArray();
            }

            // https://stackoverflow.com/questions/221925/creating-a-byte-array-from-a-stream
            using (MemoryStream ms = new MemoryStream())
            {
                contentStream.Seek(0, SeekOrigin.Begin);
                contentStream.CopyTo(ms);
                return ms.ToArray();
            }
        }

        public async Task DeleteFile(string fileId)
        {
            var drive = await GetGeneratedDocumentDriveAsync();

            var graphClient = _graphClientProvider.GetGraphServiceClient();

            await graphClient.Drives[drive.Id].Items[fileId].Request().DeleteAsync();
        }
    }
}
