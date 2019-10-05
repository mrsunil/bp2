using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.PaymentRequestInterface.Application.Commands;
using LDC.Atlas.Services.PaymentRequestInterface.Entities;
using System;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PaymentRequestInterface.Repositories
{
    public class PaymentRequestRepository : BaseRepository, IPaymentRequestRepository
    {
        public PaymentRequestRepository(IDapperContext dapperContext)
         : base(dapperContext)
        {
        }

        public async Task<string> GetTRAXMessageAsync(long cashId, string companyId)
         {
             DynamicParameters queryParameters = new DynamicParameters();
             queryParameters.Add("@CashId", cashId);
             queryParameters.Add("@CompanyId", companyId);

            return await ExecuteScalarAsync<string>(StoredProcedureNames.GetTraxCsvMessage, queryParameters);
        }

        public async Task InsertOrUpdateInterfaceStatusAsync(ProcessInterfaceDataChangeLogsRequest request, InterfaceStatus interfaceStatus)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@TransactionDocumentId", request.TransactionDocumentId);
            queryParameters.Add("@DocumentReference", request.CashDocumentRef);
            queryParameters.Add("@StatusId", interfaceStatus);
            queryParameters.Add("@InterfaceTypeId", request.BusinessApplicationType);
            queryParameters.Add("@AcknowledgementId", request.AcknowledgementId);
            queryParameters.Add("@CompanyId", request.CompanyId);
            queryParameters.Add("@DocumentDate", request.DocumentDate.GetValueOrDefault() == default(DateTime) ? DateTime.UtcNow : request.DocumentDate);
            queryParameters.Add("@Uuid", request.UUID);

            await ExecuteNonQueryAsync(StoredProcedureNames.InsertOrUpdateInterfaceStatus, queryParameters, true);
        }

        public async Task InsertInterfaceLogsAsync(ProcessInterfaceDataChangeLogsRequest request, InterfaceStatus interfaceStatus, string message)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@TransactionDocumentId", request.TransactionDocumentId);
            queryParameters.Add("@DocumentReference", request.CashDocumentRef);
            queryParameters.Add("@StatusId", interfaceStatus);
            queryParameters.Add("@InterfaceTypeId", request.BusinessApplicationType);
            queryParameters.Add("@Message", message);
            queryParameters.Add("@ESBResponse", request.ESBMessage);
            queryParameters.Add("@CompanyId", request.CompanyId);

            await ExecuteNonQueryAsync(StoredProcedureNames.InsertInterfaceLogs, queryParameters, true);
        }

        public async Task<string> GetLegalEntityCodeAsync(string companyId, long businessTypeId)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add("@InterfaceTypeId", businessTypeId);

            return await ExecuteScalarAsync<string>(StoredProcedureNames.GetLegalEntity, queryParameters);
        }

        public async Task<PaymentRequestStatus> GetPaymentRequestStatus(int interfaceType, string companyId, string documentReference, long? transactionDocumentId = null)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@DocumentReference", documentReference);
            queryParameters.Add("@InterfaceTypeId", interfaceType);
            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add("@TransactionDocumentId", transactionDocumentId);

            var paymentRequest = await ExecuteQueryFirstOrDefaultAsync<PaymentRequestStatus>(StoredProcedureNames.CheckRequestStatusByDocRef, queryParameters);
            return paymentRequest;
        }

        private static class StoredProcedureNames
        {
            internal const string InsertOrUpdateInterfaceStatus = "[Interface].[usp_InsertAndUpdateDocumentInterfaceStatus]";
            internal const string InsertInterfaceLogs = "[Interface].[usp_InsertInterfaceLogs]";
            internal const string GetTraxCsvMessage = "[Invoicing].[usp_GetTraxMessage]";
            internal const string GetLegalEntity = "[Interface].[usp_GetLegalEntityCode]";
            internal const string CheckRequestStatusByDocRef = "[Interface].[usp_GetPaymentRequestStatus]";
        }
    }
}
