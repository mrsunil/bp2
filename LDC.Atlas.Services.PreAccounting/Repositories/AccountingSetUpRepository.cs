using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.PreAccounting.Entities;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Repositories
{
    public class AccountingSetUpRepository : BaseRepository, IAccountingSetUpRepository
    {
        public AccountingSetUpRepository(IDapperContext dapperContext)
         : base(dapperContext)
        {
        }

        public async Task UpdateAccountingSetUpAsync(AccountingSetup accountingSetup)
        {
            var queryParameters = new DynamicParameters();

            queryParameters.Add("@CompanyId", accountingSetup.CompanyId);
            queryParameters.Add("@LastMonthClosed", accountingSetup.LastMonthClosed);
            queryParameters.Add("@LastMonthClosedForOperation", accountingSetup.LastMonthClosedForOperation);
            queryParameters.Add("@NumberOfOpenPeriod", accountingSetup.NumberOfOpenPeriod);
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@OpenPeriodCounter", accountingSetup.OpenPeriodCounter);
            queryParameters.Add("@MaximumNumberofOpenFinancialYears", accountingSetup.MaximumNumberofOpenFinancialYears);
            queryParameters.Add("@LastMonthofFinancialYear", accountingSetup.LastMonthofFinancialYear);
            queryParameters.Add("@LastFinancialYearClosed", accountingSetup.LastFinancialYearClosed);
            await ExecuteNonQueryAsync(
                        StoredProcedureNames.UpdateAccountingSetUp,
                        queryParameters,
                        true);
        }

        private static class StoredProcedureNames
        {
            internal const string UpdateAccountingSetUp = "[PreAccounting].[usp_UpdateAccountingSetup]";
        }
    }
}
