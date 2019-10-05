using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class CounterPartyBankAccountsRepository : BaseRepository, ICounterPartyBankAccountsRepository
    {
        public CounterPartyBankAccountsRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
        }

        public async Task<IEnumerable<CounterPartyBankAccount>> GetAllAsync(string company, int counterParty, string currency)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@CounterParty", counterParty);
            queryParameters.Add("@Currencycode", currency);

            var counterPartyBankAccounts = await ExecuteQueryAsync<CounterPartyBankAccount>(
                StoredProcedureNames.GetCounterpartyBankAccounts, queryParameters);

            return counterPartyBankAccounts;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetCounterpartyBankAccounts = "[Masterdata].[usp_GetCounterPartyBankAccount]";
        }
    }
}
