using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Execution.Entities;
using System;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Repositories
{
    public class ManualDocumentMatchingRepository : BaseRepository, IManualDocumentMatchingRepository
    {
        public ManualDocumentMatchingRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
        }

        public async Task<ManualDocumentMatchingRecord> CreateUpdateDocumentMatching(ManualDocumentMatchingRecord document)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@MatchFlagId", null);
            queryParameters.Add("@IsPrematch", false);
            queryParameters.Add("@CurrencyCode", document.CurrencyCode);
            queryParameters.Add("@CounterpartyId", document.CounterpartyId);
            queryParameters.Add("@DocumentMatching", DocumentMatchingTvp(document));
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CompanyId", document.Company);
            queryParameters.Add("@MatchingStatusId", null);
            queryParameters.Add("@MatchFlagIdInserted", dbType: DbType.Int64, direction: ParameterDirection.Output);
            queryParameters.Add("@PaymentDocumentDate", document.PaymentDocumentDate);
            queryParameters.Add("@DocumentDate", document.DocumentMatchings.FirstOrDefault().DocumentDate);
            queryParameters.Add("@JLTypeId", (int)JLType.Revaluation);
            queryParameters.Add("@AuthorizedForPosting", true);
            queryParameters.Add("@PhysicalDocumentId", null);
            queryParameters.Add("@Year", null);
            queryParameters.Add("@TransactionDocumentTypeId", (int)MasterDocumentType.JL);
            queryParameters.Add("@DocumentReference", dbType: DbType.String, direction: ParameterDirection.Output, size: 10);
            queryParameters.Add("@CurrentDocumentReferenceNumber", dbType: DbType.Int32, direction: ParameterDirection.Output);
            queryParameters.Add("@MatchFlagCodeInserted", dbType: DbType.String, direction: ParameterDirection.Output, size: 10);
            queryParameters.Add("@TransactionDocumentId", dbType: DbType.Int64, direction: ParameterDirection.Output);
            queryParameters.Add("@TransactionDocumentIdRevarsal", dbType: DbType.Int64, direction: ParameterDirection.Output);
            await ExecuteNonQueryAsync(StoredProcedureNames.CreateUpdateDocumentMatching, queryParameters, true);
            var matchFlagId = queryParameters.Get<long>("@MatchFlagIdInserted");
            var revalJournalCode = queryParameters.Get<string>("@DocumentReference");
            var matchFlagCode = queryParameters.Get<string>("@MatchFlagCodeInserted");
            var transactionDocumentId = queryParameters.Get<long?>("TransactionDocumentId");

            return new ManualDocumentMatchingRecord()
            {
                MatchFlagId = matchFlagId,
                JournalId = revalJournalCode,
                MatchFlagCode = matchFlagCode,
                TransactionDocumentId = transactionDocumentId
            };
        }

        public async Task UpdateDocumentAsync(ManualDocumentMatchingRecord manualDocumentMatching)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("CompanyId", manualDocumentMatching.Company);
            queryParameters.Add("DataVersionId", null);
            queryParameters.Add("PaymentDocumentDate", manualDocumentMatching.PaymentDocumentDate);
            queryParameters.Add("MatchFlagId", manualDocumentMatching.MatchFlagId);
            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateRevaluationPaymentDocumentDate, queryParameters, true);
        }

        public async Task<long?> DeleteMatchFlag(long?id, string companyCode)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("MatchFlagId", id);
            queryParameters.Add("CompanyId", companyCode);
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("RevaluationToBeReversedTransactionId", null, DbType.Int64, ParameterDirection.Output);
            await ExecuteNonQueryAsync(StoredProcedureNames.DeleteMatchFlag, queryParameters, true);
            return queryParameters.Get<long?>("RevaluationToBeReversedTransactionId");
        }

        private static DataTable DocumentMatchingTvp(ManualDocumentMatchingRecord value)
        {
            DataTable table = new DataTable();
            table.SetTypeName("[Invoicing].[UDTT_DocumentMatching]");

            DataColumn transactionDocumentId = new DataColumn("TransactionDocumentId", typeof(long));
            table.Columns.Add(transactionDocumentId);
            DataColumn amount = new DataColumn("MatchedAmount", typeof(decimal));
            table.Columns.Add(amount);
            DataColumn matchingStatusId = new DataColumn("MatchingStatusId", typeof(short));
            table.Columns.Add(matchingStatusId);
            DataColumn isCash = new DataColumn("IsCash", typeof(bool));
            table.Columns.Add(isCash);
            DataColumn amountInFunctionalCurrency = new DataColumn("AmountInFunctionalCurrency", typeof(decimal));
            table.Columns.Add(amountInFunctionalCurrency);
            DataColumn amountInStatutoryCurrency = new DataColumn("AmountInStatutoryCurrency", typeof(decimal));
            table.Columns.Add(amountInStatutoryCurrency);
            DataColumn valueDate = new DataColumn("ValueDate", typeof(DateTime));
            table.Columns.Add(valueDate);
            DataColumn departmentId = new DataColumn("DepartmentId", typeof(long));
            table.Columns.Add(departmentId);
            DataColumn transactionDirectionId = new DataColumn("TransactionDirectionId", typeof(int));
            table.Columns.Add(transactionDirectionId);
            DataColumn lineId = new DataColumn("[LineId]", typeof(int));
            table.Columns.Add(lineId);
            DataColumn secondaryReferenceId = new DataColumn("[SecondaryDocumentReferenceId]", typeof(long));
            table.Columns.Add(secondaryReferenceId);
            var sourceJournalLineId = new DataColumn("SourceJournalLineId", typeof(long));
            table.Columns.Add(sourceJournalLineId);
            var sourceInvoiceId = new DataColumn("SourceInvoiceId", typeof(long));
            table.Columns.Add(sourceInvoiceId);
            var sourceCashLineId = new DataColumn("SourceCashLineId", typeof(long));
            table.Columns.Add(sourceCashLineId);
            var matchedJournalLineId = new DataColumn("MatchedJournalLineId", typeof(long));
            table.Columns.Add(matchedJournalLineId);
            var matchedInvoiceId = new DataColumn("MatchedInvoiceId", typeof(long));
            table.Columns.Add(matchedInvoiceId);
            var matchedCashLineId = new DataColumn("MatchedCashLineId", typeof(long));
            table.Columns.Add(matchedCashLineId);

            foreach (var item in value.DocumentMatchings)
            {
                var row = table.NewRow();
                row[transactionDocumentId] = item.TransactionDocumentId;
                row[amount] = item.Amount;
                row[matchingStatusId] = item.MatchingStatusId;
                row[isCash] = false;
                row[amountInFunctionalCurrency] = item.FunctionalCcyAmount;
                row[amountInStatutoryCurrency] = item.StatutoryCcyAmount;
                row[lineId] = item.LineId == null ? (object)DBNull.Value : item.LineId;
                row[valueDate] = value.PaymentDocumentDate;
                row[departmentId] = item.DepartmentId;
                row[transactionDirectionId] = item.TransactionDirectionId;
                row[secondaryReferenceId] = item.TransactionDocumentId;
                row[sourceCashLineId] = item.SourceCashLineId.HasValue ? item.SourceCashLineId.Value : (object)DBNull.Value;
                row[matchedInvoiceId] = DBNull.Value;
                row[sourceJournalLineId] = item.SourceJournalLineId.HasValue ? item.SourceJournalLineId.Value : (object)DBNull.Value;
                row[matchedJournalLineId] = DBNull.Value;
                row[sourceInvoiceId] = item.SourceInvoiceId.HasValue ? item.SourceInvoiceId.Value : (object)DBNull.Value;
                row[matchedCashLineId] = DBNull.Value;
                table.Rows.Add(row);
            }

            return table;
        }

        private static class StoredProcedureNames
        {
            internal const string CreateUpdateDocumentMatching = "[Invoicing].[usp_CreateUpdateDocumentMatching]";
            internal const string UpdateRevaluationPaymentDocumentDate = "[Invoicing].[usp_UpdateRevaluationPaymentDocumentDate]";
            internal const string DeleteMatchFlag = "[Invoicing].[usp_DeleteMatchFlag]";
            internal const string CreateRevaluation = "[Invoicing].[usp_CreateRevaluation]";
        }
    }
}
