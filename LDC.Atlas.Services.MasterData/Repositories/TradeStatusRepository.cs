using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class TradeStatusRepository : BaseRepository, ITradeStatusRepository
    {
        public TradeStatusRepository(IDapperContext dapperContext)
          : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(EnumEntity),
                       new ColumnAttributeTypeMapper<EnumEntity>());
        }

        public async Task<IEnumerable<EnumEntity>> GetAllAsync()
        {
            var tradeStatuses = await ExecuteQueryAsync<EnumEntity>(
                StoredProcedureNames.GetCounterpartyTradeStatus);

            return tradeStatuses;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetCounterpartyTradeStatus = "[Masterdata].[usp_ListCounterpartyTradeStatus]";
        }
    }
}
