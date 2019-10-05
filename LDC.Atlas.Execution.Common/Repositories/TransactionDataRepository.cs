using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Execution.Common.Entities;
using LDC.Atlas.Execution.Common.Queries.Dto;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using System.Linq;

namespace LDC.Atlas.Execution.Common.Repositories
{
    public class TransactionDataRepository : BaseRepository, ITransactionDataRepository
    {
        public TransactionDataRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
        }

        public async Task<TransactionCreationResponse> CreateTransactionDocument(int transactionDocumentTypeId, DateTime docDate, string currencyCode, bool authorizedForPosting, long? physicalDocumentId, string docRefrence, int yearNumber, int docYear, string company, bool toInterface)
        {
            TransactionCreationResponse response = new TransactionCreationResponse();
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@DocumentDate", docDate);
            queryParameters.Add("@CurrencyCode", currencyCode);
            queryParameters.Add("@TransactionDocumentTypeId", transactionDocumentTypeId);
            queryParameters.Add("@AuthorizedForPosting", authorizedForPosting);
            queryParameters.Add("@PhysicalDocumentId", physicalDocumentId);
            queryParameters.Add("@DocumentReference", docRefrence);
            queryParameters.Add("@YearNumber", yearNumber);
            queryParameters.Add("@Year", docYear);
            queryParameters.Add("@ToInterface", toInterface);
            queryParameters.Add("@TransactionDocumentId", response.TransactionDocumentId, DbType.Int64, ParameterDirection.Output);
            await ExecuteNonQueryAsync(StoredProcedureNames.GenerateTransactionDocument, queryParameters, true);
            response.TransactionDocumentId = queryParameters.Get<long>("@TransactionDocumentId");
            return response;
        }

        public async Task InsertReversalTransactionMapping(long transactionDocumentId, long reversalTransactionDocumentId, string company)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@TransactionDocumentId", transactionDocumentId);
            queryParameters.Add("@ReversalTransactionDocumentId", reversalTransactionDocumentId);
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CompanyId", company);
            await ExecuteNonQueryAsync(StoredProcedureNames.CreateReversalTransactionMapping, queryParameters, true);
        }

        public async Task UpdateDocumentTypeForDocumentReversal(long transactionDocumentId, string company)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@TransactionDocumentId", transactionDocumentId);
            queryParameters.Add("@CompanyId", company);
            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateDocumentTypeForDocumentReversal, queryParameters, true);
        }

        public async Task CreateFxDealSettlementMapping(long transactionDocumentId, long fxDealId, string company, int fxSettlementDocumentType)
        {

            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@TransactionDocumentId", transactionDocumentId);
            queryParameters.Add("@FxDealId", fxDealId);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@FxSettlementDocumentTypeId", fxSettlementDocumentType);

            await ExecuteNonQueryAsync(StoredProcedureNames.CreateFxDealSettlementMapping, queryParameters, true);
        }

        public async Task<int> GetInvoiceDocumentReferenceValues(string companyId, int transactionDocumentTypeId, int year)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add("@TransactionDocumentTypeId", transactionDocumentTypeId);
            queryParameters.Add("@Year", year);
            queryParameters.Add("@TransactionTypeYearCounter", 0, DbType.Int32, ParameterDirection.Output);
            await ExecuteNonQueryAsync(StoredProcedureNames.GetDocumentReferenceValue, queryParameters);
            var transactionTypeYearCounter = queryParameters.Get<int>("@TransactionTypeYearCounter");
            return transactionTypeYearCounter;
        }

        public async Task<AccountingSetupDto> GetAccountingSetup(string companyId)
        {
            var queryParameters = new DynamicParameters();
            AccountingSetupDto accountingSetup;

            queryParameters.Add("@CompanyId", companyId);
            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetAccountingSetup, queryParameters))
            {
                accountingSetup = (await grid.ReadAsync<AccountingSetupDto>()).FirstOrDefault();
            }

            return accountingSetup;
        }

        internal static class StoredProcedureNames
        {
            internal const string GenerateTransactionDocument = "[Invoicing].[usp_CreateTransactionDocument]";
            internal const string CreateReversalTransactionMapping = "[Invoicing].[usp_CreateReversalTransactionMapping]";
            internal const string UpdateDocumentTypeForDocumentReversal = "[Invoicing].[usp_UpdateDocumentTypeReversal]";
            internal const string CreateFxDealSettlementMapping = "[Invoicing].[usp_CreateFxDealSettlementMapping]";
            internal const string GetDocumentReferenceValue = "[Invoicing].[usp_GetDocumentReferenceValue]";
            internal const string GetAccountingSetup = "[PreAccounting].[usp_GetAccountingSetup]";
        }
    }
}
