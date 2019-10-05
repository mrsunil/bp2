using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class AccountTypeRepository : BaseRepository, IAccountTypeRepository
    {
        public AccountTypeRepository(IDapperContext dapperContext)
          : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(AccountType),
                       new ColumnAttributeTypeMapper<AccountType>());
        }

        public async Task<IEnumerable<AccountType>> GetAllAsync()
        {
            var accountTypes = await ExecuteQueryAsync<AccountType>(
                StoredProcedureNames.GetAccountLineType);

            return accountTypes;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetAccountLineType = "[MasterData].[usp_ListAccountTypes]";
        }
    }
}
