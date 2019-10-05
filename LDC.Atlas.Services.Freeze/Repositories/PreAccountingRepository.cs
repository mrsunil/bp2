using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Freeze.Entities;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Freeze.Repositories
{
    public class PreAccountingRepository : BaseRepository, IPreAccountingRepository
    {
        public PreAccountingRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
        }

        public async Task<AccountingSetup> GetAccountingSetup(string companyId)
        {
            var queryParameters = new DynamicParameters();
            AccountingSetup accountingSetup;

            queryParameters.Add("@CompanyId", companyId);
            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetAccountingSetup, queryParameters))
            {
                accountingSetup = (await grid.ReadAsync<AccountingSetup>()).FirstOrDefault();
            }

            return accountingSetup;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetAccountingSetup = "[PreAccounting].[usp_GetAccountingSetup]";
        }
    }
}
