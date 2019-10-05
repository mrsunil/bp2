using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class BankAccountStatusRepository : BaseRepository, IBankAccountStatusRepository
    {
        public BankAccountStatusRepository(IDapperContext dapperContext)
           : base(dapperContext)
        {
        }

        public async Task<IEnumerable<BankAccountStatus>> GetAllAsync()
        {
            var queryParameters = new DynamicParameters();

            var bankAccountStatuses = await ExecuteQueryAsync<BankAccountStatus>(
                StoredProcedureNames.GetBankAccountStatuses, queryParameters);

            return bankAccountStatuses;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetBankAccountStatuses = "[Masterdata].[usp_ListBankAccountStatus]";
        }
    }
}
