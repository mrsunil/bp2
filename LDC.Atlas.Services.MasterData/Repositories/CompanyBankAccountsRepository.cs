using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class CompanyBankAccountsRepository : BaseRepository, ICompanyBankAccountsRepository
    {
        public CompanyBankAccountsRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
        }

        public async Task<IEnumerable<CompanyBankAccount>> GetAllAsync(string company, string currency)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@CurrencyCode", currency);

            var companyBankAccounts = await ExecuteQueryAsync<CompanyBankAccount>(
                StoredProcedureNames.GetCompanyBankAccounts, queryParameters);

            return companyBankAccounts;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetCompanyBankAccounts = "[MasterData].[usp_GetCompanyBankAccount]";
        }
    }
}
