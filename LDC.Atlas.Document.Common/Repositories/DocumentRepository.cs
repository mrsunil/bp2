using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Document.Common.Dtos;
using LDC.Atlas.Document.Common.Entities;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace LDC.Atlas.Document.Common.Repositories
{
    public class DocumentRepository : BaseRepository, IDocumentRepository
    {
        public DocumentRepository(IDapperContext dapperContext)
        : base(dapperContext)
        {
        }

        public async Task<IEnumerable<PhysicalDocumentDto>> GetGeneratedDocumentsAsync(string companyId, long recordId, int tableId, int? documentType, int? offset, int? limit)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Company", companyId);
            queryParameters.Add("@RecordId", recordId);
            queryParameters.Add("@TableId", tableId);
            queryParameters.Add("@DocumentTypeId", documentType);

            queryParameters.Add("@offsetRows", offset ?? 0);
            queryParameters.Add("@fetchRows", limit ?? int.MaxValue);

            var documents = await ExecuteQueryAsync<PhysicalDocumentDto>(StoredProcedureNames.GetDocuments, queryParameters);

            return documents;
        }

        public async Task<PhysicalDocumentDto> GetGeneratedDocumentByIdAsync(long documentId, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@DocumentId", documentId);
            queryParameters.Add("@Company", company);

            var document = await ExecuteQueryFirstOrDefaultAsync<PhysicalDocumentDto>(StoredProcedureNames.GetDocumentById, queryParameters);

            return document;
        }

        public async Task<long> CreateDocument(PhysicalDocumentDto document)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@DocumentName", document.DocumentName);
            queryParameters.Add("@CreatedBy", document.CreatedBy);
            queryParameters.Add("@CompanyId", document.CompanyId);
            queryParameters.Add("@DocumentTemplate", document.DocumentTemplate);
            queryParameters.Add("@DocumentTypeId", document.PhysicalDocumentTypeId);
            queryParameters.Add("@DocumentStatusId", document.PhysicalDocumentStatusId);
            queryParameters.Add("@RecordId", document.RecordId);
            queryParameters.Add("@TableId", document.TableId);
            queryParameters.Add("@MimeType", document.MimeType);
            queryParameters.Add("@Extension", document.DocumentExtension);
            queryParameters.Add("@FileContent", document.FileContent);
            queryParameters.Add("@DocumentId", document.FileContent, DbType.Int64, ParameterDirection.Output);

            await ExecuteNonQueryAsync(StoredProcedureNames.CreateDocument, queryParameters, true);

            var documentId = queryParameters.Get<long>("@DocumentId");

            return documentId;
        }

        public async Task<long> CreateDraftDocument(PhysicalDraftDocumentDto document)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@DocumentName", document.DocumentName);
            queryParameters.Add("@CreatedBy", document.CreatedBy);
            queryParameters.Add("@CompanyId", document.CompanyId);
            queryParameters.Add("@DocumentTemplate", document.DocumentTemplate);
            queryParameters.Add("@DocumentTypeId", document.PhysicalDocumentTypeId);
            queryParameters.Add("@RecordId", document.RecordId);
            queryParameters.Add("@TableId", document.TableId);
            queryParameters.Add("@MimeType", document.MimeType);
            queryParameters.Add("@FileContent", document.FileContent);
            queryParameters.Add("@DocumentId", document.FileContent, DbType.Int64, ParameterDirection.Output);

            await ExecuteNonQueryAsync(StoredProcedureNames.CreateDraftDocument, queryParameters, true);

            var documentId = queryParameters.Get<long>("@DocumentId");

            return documentId;
        }

        public async Task<PhysicalDraftDocumentDto> GetDraftDocumentByIdAsync(long documentId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@DocumentId", documentId);

            var document = await ExecuteQueryFirstOrDefaultAsync<PhysicalDraftDocumentDto>(StoredProcedureNames.GetDraftDocumentById, queryParameters);

            return document;
        }

        public async Task<long> CreateDocumentFromDraft(long documentId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@DraftDocumentId", documentId);
            queryParameters.Add("@DocumentId", dbType: DbType.Int64, direction: ParameterDirection.Output);

            await ExecuteNonQueryAsync(StoredProcedureNames.CreateDocumentFromDraft, queryParameters);

            return queryParameters.Get<long>("@DocumentId");
        }

        public async Task UpdateDocumentStatus(long documentId, PhysicalDocumentStatus documentStatus)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@PhysicalDocumentId", documentId);
            queryParameters.Add("@PhysicalDocumentStatusId", documentStatus);

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateDocumentStatus, queryParameters, true);
        }

        private static class StoredProcedureNames
        {
            internal const string GetDocuments = "[Document].[usp_ListPhysicalDocuments]";
            internal const string GetDocumentById = "[Document].[usp_GetPhysicalDocumentById]";
            internal const string CreateDocument = "[Document].[usp_CreateDocument]";
            internal const string CreateDraftDocument = "[Document].[usp_CreateDraft]";
            internal const string GetDraftDocumentById = "[Document].[usp_GetPhysicalDraftDocumentById]";
            internal const string CreateDocumentFromDraft = "[Document].[usp_SaveDraftPhysicalDocument]";
            internal const string UpdateDocumentStatus = "[Document].[usp_UpdatePhysicalDocumentStatus]";
        }
    }
}
