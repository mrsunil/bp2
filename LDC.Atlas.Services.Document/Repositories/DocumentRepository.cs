using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Document.Common.Dtos;
using LDC.Atlas.Services.Document.Entities;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Document.Repositories
{
    public class DocumentRepository : BaseRepository, IDocumentRepository
    {
        public DocumentRepository(IDapperContext dapperContext)
        : base(dapperContext)
        {
        }

        public async Task<IEnumerable<PhysicalDocumentDto>> GetGeneratedDocumentsAsync(string companyId, long recordId, int? tableId, int? documentType, int? offset, int? limit)
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

        public async Task<PhysicalDocumentDto> GetGeneratedDocumentByIdAsync(long generatedDocumentId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@DocumentId", generatedDocumentId);

            var document = await ExecuteQueryFirstOrDefaultAsync<PhysicalDocumentDto>(StoredProcedureNames.GetDocumentById, queryParameters);

            return document;
        }

        public async Task<PhysicalDraftDocumentDto> GetDraftDocumentByIdAsync(long generatedDocumentId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@DocumentId", generatedDocumentId);

            var document = await ExecuteQueryFirstOrDefaultAsync<PhysicalDraftDocumentDto>(StoredProcedureNames.GetDraftDocumentById, queryParameters);

            return document;
        }

        public async Task<long> CreateDocument(PhysicalDraftDocumentDto generatedDocument, bool isDraft = false)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@DocumentName", generatedDocument.DocumentName);
            queryParameters.Add("@CreatedBy", generatedDocument.CreatedBy);
            queryParameters.Add("@CompanyId", generatedDocument.CompanyId);
            queryParameters.Add("@DocumentTemplate", generatedDocument.DocumentTemplate);
            queryParameters.Add("@DocumentTypeId", generatedDocument.PhysicalDocumentTypeId);
            queryParameters.Add("@RecordId", generatedDocument.RecordId);
            queryParameters.Add("@TableId", generatedDocument.TableId);
            queryParameters.Add("@MimeType", generatedDocument.MimeType);
            queryParameters.Add("@Extension", generatedDocument.DocumentExtension);
            queryParameters.Add("@FileContent", generatedDocument.FileContent);
            queryParameters.Add("@DocumentId", generatedDocument.FileContent, DbType.Int64, ParameterDirection.Output);

            if (isDraft)
            {
                await ExecuteNonQueryAsync(StoredProcedureNames.CreateDraftDocument, queryParameters, true);
            }
            else
            {
                await ExecuteNonQueryAsync(StoredProcedureNames.CreateDocument, queryParameters, true);
            }

            var documentId = queryParameters.Get<long>("@DocumentId");

            return documentId;
        }

        public async Task<ContractAdviceInfo> GetContractAdviceInfoAsync(long sectionId, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@SectionId", sectionId);
            queryParameters.Add("@CompanyId", company);

            return await ExecuteQueryFirstOrDefaultAsync<ContractAdviceInfo>(StoredProcedureNames.GetContractAdviceInfo, queryParameters);
        }

        private static class StoredProcedureNames
        {
            internal const string GetDocuments = "[Document].[usp_ListPhysicalDocuments]";
            internal const string GetDocumentById = "[Document].[usp_GetPhysicalDocumentById]";
            internal const string GetDraftDocumentById = "[Document].[usp_GetPhysicalDraftDocumentById]";
            internal const string CreateDocument = "[Document].[usp_CreateDocument]";
            internal const string CreateDraftDocument = "[Document].[usp_CreateDraft]";
            internal const string GetContractAdviceInfo = "[Document].[usp_GetContractAdviceInfo]";
        }
    }
}
