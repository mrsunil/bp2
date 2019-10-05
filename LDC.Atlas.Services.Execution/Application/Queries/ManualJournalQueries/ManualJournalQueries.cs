using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Execution.Application.Queries.Dto;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Application.Queries
{
    public class ManualJournalQueries : BaseRepository, IManualJournalQueries
    {
        public ManualJournalQueries(IDapperContext dapperContext)
           : base(dapperContext)
        {
        }

        public async Task<int> GetManualDocumentReferenceValues(string companyId, int transactionDocumentTypeId, int year)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add("@TransactionDocumentTypeId", transactionDocumentTypeId);
            queryParameters.Add("@Year", year);
            queryParameters.Add("@TransactionTypeYearCounter", 0, DbType.Int32, ParameterDirection.Output);
            await ExecuteNonQueryAsync(StoredProcedureNames.GetDocumentReferenceValue, queryParameters);
            var transactionTypeYearCounter = queryParameters.Get<int>("@TransactionTypeYearCounter");
            return transactionTypeYearCounter;
        }

        /// <summary>
        /// Get Manual Journal Field Configuration
        /// </summary>
        /// <param name="company"></param>
        /// <returns></returns>
        public async Task<IEnumerable<ItemConfigurationPropertiesDto>> GetManualJournalFieldsConfiguration(string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            var mandatoryFieldsResults = await ExecuteQueryAsync<ItemConfigurationPropertiesDto>(StoredProcedureNames.GetManualJournalFieldsConfiguration, queryParameters);
            return mandatoryFieldsResults.ToList();
        }

        private static class StoredProcedureNames
        {
            internal const string GetDocumentReferenceValue = "[Invoicing].[usp_GetDocumentReferenceValue]";
            internal const string GetManualJournalFieldsConfiguration = "[PreAccounting].[usp_GetFieldsConfigurationAccountingEntries]";
        }
    }
}
