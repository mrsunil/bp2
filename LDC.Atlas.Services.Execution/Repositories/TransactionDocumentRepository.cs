using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Execution.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Repositories
{
    public class TransactionDocumentRepository : BaseRepository, ITransactionDocumentRepository
    {
        public TransactionDocumentRepository(IDapperContext dapperContext)
        : base(dapperContext)
        {
        }

        public async Task<long> ReverseDocument(
            long reversedTransactionDocumentId,
            string companyCode,
            int yearOfReversalDoc,
            int yearNumberOfReversalDoc,
            string docRefOfReversal,
            DateTime docDateOfReversal)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@ReversedTransactionDocumentId", reversedTransactionDocumentId);
            queryParameters.Add("@CompanyCode", companyCode);
            queryParameters.Add("@ReversalYear", yearOfReversalDoc);
            queryParameters.Add("@ReversalYearNumber", yearNumberOfReversalDoc);
            queryParameters.Add("@ReversalDocRef", docRefOfReversal);
            queryParameters.Add("@ReversalDocumentDate", docDateOfReversal);
            queryParameters.Add("@ReversalTransactionId", null, DbType.Int64, ParameterDirection.Output);
            await ExecuteNonQueryAsync(StoredProcedureNames.ReverseDocument, queryParameters, true);
            return queryParameters.Get<long?>("ReversalTransactionId").Value;
        }

        public async Task<RevaluationInformation> CreateRevaluation(
          string companyId,
          long? cashByPickingTransactionDocumentId,
          string currencyCode,
          long matchFlagId,
          DateTime glDate,
          DateTime paymentDocumentDate,
          DateTime documentDate)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CurrencyCode", currencyCode);
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add("@MatchingStatusId", null);
            queryParameters.Add("@DocumentDate", documentDate);
            queryParameters.Add("@AuthorizedForPosting", true);
            queryParameters.Add("@PhysicalDocumentId", null);
            queryParameters.Add("@Year", null);
            queryParameters.Add("@PaymentDocumentDate", paymentDocumentDate);
            queryParameters.Add("@MatchFlagId", matchFlagId);
            queryParameters.Add("@DocumentReference", dbType: DbType.String, direction: ParameterDirection.Output, size: 10);
            queryParameters.Add("@CurrentDocumentReferenceNumber", dbType: DbType.Int32, direction: ParameterDirection.Output);
            queryParameters.Add("@TransactionDocumentId", dbType: DbType.Int64, direction: ParameterDirection.Output);
            queryParameters.Add("@TransactionDocumentTypeId", (int)MasterDocumentType.JL);
            queryParameters.Add("@JLTypeId", (int)JLType.Revaluation);
            queryParameters.Add("@CashByPickingTransactionDocumentId", cashByPickingTransactionDocumentId);
            queryParameters.Add("@IsPickTransaction", true);
            queryParameters.Add("@GLDate", glDate);
            queryParameters.Add("@RevaluationId", dbType: DbType.Int64, direction: ParameterDirection.Output);
            await ExecuteNonQueryAsync(StoredProcedureNames.CreateRevalulation, queryParameters, true);
            return new RevaluationInformation()
            {
                RevaluationId = queryParameters.Get<long>("RevaluationId"),
                TransactionDocumentId = queryParameters.Get<long>("TransactionDocumentId"),
                DocumentReference = queryParameters.Get<string>("DocumentReference"),
                CurrentDocumentReferenceNumber = queryParameters.Get<int>("CurrentDocumentReferenceNumber"),
            };
        }

        public async Task DeleteManualJLOrRevaluation(long transactionDocumentId, string companyCode)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@TransactionDocumentId", transactionDocumentId);
            queryParameters.Add("@CompanyId", companyCode);
            await ExecuteNonQueryAsync(
               StoredProcedureNames.DeleteManualJLOrRevaluation, queryParameters, true);
        }

        public async Task<IEnumerable<TransactionDocumentRateOfExchange>> GetTransactionDocumentRateOfExchangeList(IEnumerable<long> transactionDocumentIds, string companyCode)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@TransactionDocumentIds", ToArrayTvp(transactionDocumentIds));
            queryParameters.Add("@companyId", companyCode);

            return await ExecuteQueryAsync<TransactionDocumentRateOfExchange>(StoredProcedureNames.GetTransactionDocumentRateOfExchangeList, queryParameters);
        }

        private static DataTable ToArrayTvp(IEnumerable<long> values)
        {
            var table = new DataTable();
            table.SetTypeName("[dbo].[UDTT_BigIntList]");

            var sectionId = new DataColumn("Value", typeof(long));
            table.Columns.Add(sectionId);

            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();
                    row[sectionId] = value;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        private static class StoredProcedureNames
        {
            internal const string ReverseDocument = "[Invoicing].[usp_ReverseDocument]";
            internal const string CreateRevalulation = "[Invoicing].[usp_CreateRevaluation]";
            internal const string GetTransactionDocumentRateOfExchangeList = "[Invoicing].[usp_GetTransactionDocumentRateOfExchangeList]";
            internal const string DeleteManualJLOrRevaluation = "[Invoicing].usp_DeleteManualJLOrRevaluation";
        }
    }
}