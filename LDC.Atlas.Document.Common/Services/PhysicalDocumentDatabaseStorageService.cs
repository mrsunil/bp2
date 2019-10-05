using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.Document.Common.Dtos;
using LDC.Atlas.Document.Common.Entities;
using LDC.Atlas.Document.Common.Repositories;
using LDC.Atlas.Document.Common.Services;
using LDC.Atlas.Document.Common.Utils;
using Microsoft.AspNetCore.StaticFiles;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Document.Common
{
    public class PhysicalDocumentDatabaseStorageService : IPhysicalDocumentStorageService
    {
        private readonly IDocumentRepository _documentRepository;
        private readonly IIdentityService _identityService;

        public PhysicalDocumentDatabaseStorageService(IDocumentRepository documentRepository, IIdentityService identityService)
        {
            _documentRepository = documentRepository;
            _identityService = identityService;
        }

        public async Task<PhysicalDocumentDto> DownloadDocumentByIdAsync(long physicalDocumentId, string company)
        {
            if (physicalDocumentId <= 0)
            {
                throw new AtlasBusinessException("Invalid physical document ID.");
            }

            var document = await _documentRepository.GetGeneratedDocumentByIdAsync(physicalDocumentId, company);
            return document;
        }

        public async Task<PhysicalDraftDocumentDto> DownloadDraftDocumentByIdAsync(long physicalDocumentId)
        {
            if (physicalDocumentId <= 0)
            {
                throw new AtlasBusinessException("Invalid physical document ID.");
            }

            var document = await _documentRepository.GetDraftDocumentByIdAsync(physicalDocumentId);
            return document;
        }

        public async Task<long> MoveDraftDocument(long physicalDocumentId)
        {
            if (physicalDocumentId <= 0)
            {
                throw new AtlasBusinessException("Invalid physical document ID.");
            }

            return await _documentRepository.CreateDocumentFromDraft(physicalDocumentId);
        }

        public async Task UpdateDocumentStatus(long physicalDocumentId, PhysicalDocumentStatus physicalDocumentStatus)
        {
            if (physicalDocumentId <= 0)
            {
                throw new AtlasBusinessException("Invalid physical document ID.");
            }

            await _documentRepository.UpdateDocumentStatus(physicalDocumentId, physicalDocumentStatus);
        }

        public async Task<long> UploadDocument(UploadDocumentParameters uploadParameters)
        {
            if (uploadParameters.File.Length == 0)
            {
                throw new AtlasBusinessException(PhysicalDocumentMessages.GenerateErrorMessage(uploadParameters.PhysicalDocumentTypeId, PhysicalDocumentErrors.General));
            }

            if (uploadParameters.File.Length > 3000 * 1024)
            {
                throw new AtlasBusinessException(PhysicalDocumentMessages.GenerateErrorMessage(uploadParameters.PhysicalDocumentTypeId, PhysicalDocumentErrors.Size));
            }

            if (!DocumentFormats.AcceptedFormats.Any(s => s.ToUpperInvariant() == Path.GetExtension(uploadParameters.DocumentName).ToUpperInvariant()))
            {
                throw new AtlasBusinessException(PhysicalDocumentMessages.GenerateErrorMessage(uploadParameters.PhysicalDocumentTypeId, PhysicalDocumentErrors.Format));
            }

            long documentId;

            if (uploadParameters.IsDraft)
            {
                documentId = await _documentRepository.CreateDraftDocument(
               new PhysicalDraftDocumentDto
               {
                   CompanyId = uploadParameters.CompanyId,
                   DocumentName = uploadParameters.DocumentName,
                   DocumentTemplate = uploadParameters.DocumentTemplatePath,
                   PhysicalDocumentTypeId = (int)uploadParameters.PhysicalDocumentTypeId,
                   RecordId = uploadParameters.RecordId,
                   TableId = uploadParameters.TableId,
                   CreatedDateTime = DateTime.UtcNow,
                   CreatedBy = _identityService.GetUserName(),
                   MimeType = GetMimeType(uploadParameters.DocumentName),
                   FileContent = uploadParameters.File
               });
            }
            else
            {
                documentId = await _documentRepository.CreateDocument(
              new PhysicalDocumentDto
              {
                  CompanyId = uploadParameters.CompanyId,
                  DocumentName = uploadParameters.DocumentName,
                  DocumentTemplate = uploadParameters.DocumentTemplatePath,
                  PhysicalDocumentTypeId = (int)uploadParameters.PhysicalDocumentTypeId,
                  PhysicalDocumentStatusId = (int)uploadParameters.PhysicalDocumentStatus,
                  RecordId = uploadParameters.RecordId,
                  TableId = uploadParameters.TableId,
                  CreatedDateTime = DateTime.UtcNow,
                  CreatedBy = _identityService.GetUserName(),
                  MimeType = GetMimeType(uploadParameters.DocumentName),
                  FileContent = uploadParameters.File
              });
            }

            return documentId;
        }

        private string GetMimeType(string fileName)
        {
            var provider = new FileExtensionContentTypeProvider();

            if (!provider.TryGetContentType(fileName, out string contentType))
            {
                contentType = "application/octet-stream";
            }

            return contentType;
        }
    }
}
