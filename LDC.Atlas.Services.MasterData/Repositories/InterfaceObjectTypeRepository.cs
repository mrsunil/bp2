using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class InterfaceObjectTypeRepository: BaseRepository, IInterfaceObjectTypeRepository
    {
        public InterfaceObjectTypeRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(InterfaceObjectType),
                       new ColumnAttributeTypeMapper<InterfaceObjectType>());
        }

        public async Task<IEnumerable<InterfaceObjectType>> GetAllAsync()
        {
            return await ExecuteQueryAsync<InterfaceObjectType>(StoredProcedureNames.ListInterfaceObjectType);
        }

        internal static class StoredProcedureNames
        {
            internal const string ListInterfaceObjectType = "[MasterData].[usp_ListInterfaceObjectTypes]";
        }
    }
}
