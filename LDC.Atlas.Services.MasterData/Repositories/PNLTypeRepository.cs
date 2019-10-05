using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class PNLTypeRepository : BaseRepository, IPNLTypeRepository
    {
        public PNLTypeRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(PNLType),
                       new ColumnAttributeTypeMapper<PNLType>());
        }

        public async Task<IEnumerable<PNLType>> GetAllAsync(string company)
        {
            var queryParameters = new DynamicParameters();

            var pnlTypes = await ExecuteQueryAsync<PNLType>(
                StoredProcedureNames.GetPNLTypes,
                queryParameters);

            return pnlTypes;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetPNLTypes = "[MasterData].[usp_ListPNLTypes]";
        }
    }
}