using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Audit.Application.Queries.Dto;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Audit.Application.Queries
{
    public class EventQueries : BaseRepository, IEventQueries
    {
        public EventQueries(IDapperContext dapperContext)
           : base(dapperContext)
        {

        }

        public Task<IEnumerable<EventDto>> GetEventsAsync()
        {
            return ExecuteQueryAsync<EventDto>(StoredProcedureNames.ListEvents);
        }

        public async Task<IEnumerable<EventDto>> GetEventsBySearch(int? interfaceType, int? interfaceStatus, System.DateTime? fromDate, System.DateTime? toDate, string documentReference, int? offset, int? limit)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@InterfaceTypeId", interfaceType);
            queryParameters.Add("@InterfaceStatusId", interfaceStatus);
            queryParameters.Add("@DateFrom", fromDate);
            queryParameters.Add("@Dateto", toDate);
            queryParameters.Add("@DocumentReference", documentReference);
            var filteredEventList = await ExecuteQueryAsync<EventDto>(StoredProcedureNames.GetEventsforInterfaceMonitoring, queryParameters);
            return filteredEventList;
        }

        public Task<IEnumerable<EventHistoryDto>> GetEventHistoryAsync(long eventId, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@EventId", eventId);
            queryParameters.Add("@CompanyId", company);
            return ExecuteQueryAsync<EventHistoryDto>(StoredProcedureNames.GetEventHistory, queryParameters);
        }

        public async Task<TransactionDetailDto> GetTransactionDetailsByIdAsync(long accountingId, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@accountingIds", ToArrayTVP(accountingId));
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CompanyId", company);
            TransactionDetailDto transactionDetail;

            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetTransactionDetailDocumentRecord, queryParameters, true))
            {
                transactionDetail = (await grid.ReadAsync<TransactionDetailDto>()).FirstOrDefault();
            }

            return transactionDetail;
        }

        public async Task<CashDto> GetCashDetailsByIdAsync(long cashId, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@cashId", cashId);
            queryParameters.Add("@DataversionId", null);
            CashDto cash;
            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetCashbyCashId, queryParameters, true))
            {
                cash = (await grid.ReadAsync<CashDto>()).FirstOrDefault();
            }

            return cash;
        }

        private DataTable ToArrayTVP(long accountingId)
        {
            var table = new DataTable();
            table.SetTypeName("[PreAccounting].[UDTT_AccountingId]");

            var transactionDocumentId = new DataColumn("[AccountingId]", typeof(long));
            table.Columns.Add(transactionDocumentId);
            if (accountingId != 0)
            {
                var row = table.NewRow();
                row[transactionDocumentId] = accountingId;
                table.Rows.Add(row);
            }

            return table;
        }
        internal static class StoredProcedureNames
        {
            internal const string ListEvents = "[Audit].[usp_ListEvents]";
            internal const string GetEventHistory = "[Audit].[usp_GetEventHistory]";
            internal const string GetEventsforInterfaceMonitoring = "[Audit].[usp_GetEventsforInterfaceMonitoring]";
            internal const string GetTransactionDetailDocumentRecord = "[PreAccounting].[usp_GetAccountingDocumentTransactionDetailbyAccountingId]";
            internal const string GetCashbyCashId = "[Invoicing].[usp_GetCashbyCashId]";
            internal const string GetInterfaceProcessActiveStatus = "[Process].[usp_GetInterfaceProcessActiveStatus]";
        }
    }
}
