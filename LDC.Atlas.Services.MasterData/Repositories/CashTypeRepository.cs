using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class CashTypeRepository : BaseRepository, ICashTypeRepository
    {
        public CashTypeRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(CashType),
                       new ColumnAttributeTypeMapper<CashType>());
        }

        public async Task<IEnumerable<CashType>> GetAllAsync()
        {
            var cashType = await ExecuteQueryAsync<CashType>(StoredProcedureNames.GetCashType);
            return cashType;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetCashType = "[Masterdata].[usp_ListCashType]";
        }
    }
}
