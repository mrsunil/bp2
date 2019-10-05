using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.AccountingInterface.Application.Commands;
using LDC.Atlas.Services.AccountingInterface.Entities;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.AccountingInterface.Repositories
{
    public class AccountingInterfaceRepository : BaseRepository, IAccountingInterfaceRepository
    {
        public AccountingInterfaceRepository(IDapperContext dapperContext)
         : base(dapperContext)
        {
        }

        public async Task<string> GetESBMessageAsync(long documentId, string companyId)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@AccountingDocumentId", documentId);
            queryParameters.Add("@CompanyId", companyId);
            return await ExecuteScalarAsync<string>(StoredProcedureNames.GetEsbXmlMessage, queryParameters);
        }

        public async Task InsertOrUpdateInterfaceStatusAsync(ProcessInterfaceDataChangeLogsRequest request, InterfaceStatus interfaceStatus)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@TransactionDocumentId", request.TransactionDocumentId);
            queryParameters.Add("@AccountingDocumentId", request.DocumentId);
            queryParameters.Add("@DocumentReference", request.DocumentReference);
            queryParameters.Add("@StatusId", interfaceStatus);
            queryParameters.Add("@InterfaceTypeId", request.BusinessApplicationType);
            queryParameters.Add("@AcknowledgementId", request.AcknowledgementId);
            queryParameters.Add("@BackOfficeJournalNumber", request.JournalNumber);
            queryParameters.Add("@CompanyId", request.CompanyId);
            queryParameters.Add("@TransactionDate", request.TransactionDate);
            queryParameters.Add("@TimeStamp", request.TimeStamp);
            queryParameters.Add("@Uuid", request.UUID);
            await ExecuteNonQueryAsync(StoredProcedureNames.InsertOrUpdateInterfaceStatus, queryParameters, true);
        }

        public async Task InsertInterfaceLogsAsync(ProcessInterfaceDataChangeLogsRequest request, InterfaceStatus interfaceStatus, string message)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@TransactionDocumentId", request.TransactionDocumentId);
            queryParameters.Add("@AccountingDocumentId", request.DocumentId);
            queryParameters.Add("@DocumentReference", request.DocumentReference);
            queryParameters.Add("@StatusId", interfaceStatus);
            queryParameters.Add("@InterfaceTypeId", request.BusinessApplicationType);
            queryParameters.Add("@Message", message);
            queryParameters.Add("@CompanyId", request.CompanyId);
            queryParameters.Add("@ESBResponse", request.ESBMessage);
            await ExecuteNonQueryAsync(StoredProcedureNames.InsertInterfaceLogs, queryParameters, true);
        }

        public async Task<InterfaceStatus> GetDocumentStatus(int interfaceType, string companyId, string documentReference, long? transactionDocumentId = null, long? accountingDocumentId = null)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@DocumentReference", documentReference);
            queryParameters.Add("@InterfaceTypeId", interfaceType);
            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add("@TransactionDocumentId", transactionDocumentId);
            queryParameters.Add("@AccountingDocumentId", accountingDocumentId);
            var status = await ExecuteScalarAsync<long?>(StoredProcedureNames.CheckStatusByDocRef, queryParameters);

            return (status != null) ? (InterfaceStatus)status : InterfaceStatus.None;
        }

        public async Task<int> GetTATypeIdAsync(long transactionDocumentId, DocumentType documentTypeId, string companyId)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@TransactionDocumentId", transactionDocumentId);
            queryParameters.Add("@TransactionDocumentTypeId", documentTypeId);
            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add("@DataVersionId", null);
            return await ExecuteScalarAsync<int>(StoredProcedureNames.GetTATypeId, queryParameters);
        }

        public async Task<int> GetJLTypeIdAsync(long transactionDocumentId, DocumentType documentTypeId, string companyId)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@TransactionDocumentId", transactionDocumentId);
            queryParameters.Add("@TransactionDocumentTypeId", documentTypeId);
            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add("@DataVersionId", null);
            return await ExecuteScalarAsync<int>(StoredProcedureNames.GetJLTypeId, queryParameters);
        }

        public async Task<string> GetDocumentReferenceByAccountingId(long documentId, int transactionDocumentTypeId, string companyId)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@AccountingId", documentId);
            queryParameters.Add("@TransactionDocumentTypeId", transactionDocumentTypeId);
            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add("@DataVersionId", null);
            return await ExecuteScalarAsync<string>(StoredProcedureNames.GetDocumentReferenceByAccountingId, queryParameters);
        }

        private static class StoredProcedureNames
        {
            internal const string InsertOrUpdateInterfaceStatus = "[Interface].[usp_InsertAndUpdateDocumentInterfaceStatus]";
            internal const string InsertInterfaceLogs = "[Interface].[usp_InsertInterfaceLogs]";
            internal const string GetEsbXmlMessage = "[Interface].[usp_GetXMLForAccountingInterface]";
            internal const string CheckStatusByDocRef = "[Interface].[usp_GetDocumentStatus]";
            internal const string GetTATypeId = "[Interface].[usp_GetTATypeIdbyTransactionDocumentId]";
            internal const string GetJLTypeId = "[Interface].[usp_GetJLTypeIdbyTransactionDocumentId]";
            internal const string GetDocumentReferenceByAccountingId = "[Interface].[usp_GetDocumentReferenceByAccountingId]";
        }
    }
}