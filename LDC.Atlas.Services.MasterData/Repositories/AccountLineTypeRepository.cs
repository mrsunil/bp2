using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class AccountLineTypeRepository : BaseRepository, IAccountLineTypeRepository
    {
        public AccountLineTypeRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(AccountLineType),
                       new ColumnAttributeTypeMapper<AccountLineType>());
        }

        public async Task<IEnumerable<AccountLineType>> GetAllAsync()
        {
            var accountLineTypes = await ExecuteQueryAsync<AccountLineType>(
                StoredProcedureNames.GetAccountLineType);

            return accountLineTypes;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetAccountLineType = "[MasterData].[usp_ListAccountLineTypes]";
        }
    }
}
