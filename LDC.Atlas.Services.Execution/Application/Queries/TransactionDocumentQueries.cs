using Dapper;
using LDC.Atlas.DataAccess;
using System.Data;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Application.Queries
{
    public class TransactionDocumentQueries : BaseRepository, ITransactionDocumentQueries
    {
        public TransactionDocumentQueries(IDapperContext dapperContext)
             : base(dapperContext)
        {
        }

        /// <summary>
        /// Returns the next available value of the document # for the given type and year
        /// </summary>
        /// <param name="companyId">Company code ('e6')</param>
        /// <param name="transactionDocumentTypeId">type of the document</param>
        /// <param name="year">Pass the year for which to get the transaction doc ref (ex 2019)</param>
        /// <returns>the next available transaction document number</returns>
        public async Task<int> GetNextTransactionDocumentReferenceValues(string companyId, int transactionDocumentTypeId, int year)
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

        private static class StoredProcedureNames
        {
            internal const string GetDocumentReferenceValue = "[Invoicing].[usp_GetDocumentReferenceValue]";
        }
    }
}
