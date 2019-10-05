using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.MasterData.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class InterfaceTypeRepository: BaseRepository, IInterfaceTypeRepository
    {
        public InterfaceTypeRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(InterfaceTypes),
                       new ColumnAttributeTypeMapper<InterfaceTypes>());
        }

        public async Task<IEnumerable<InterfaceTypes>> GetAllAsync()
        {
            var interfaceType = await ExecuteQueryAsync<InterfaceTypes>(StoredProcedureNames.ListInterfaceType);
            return interfaceType;
        }

        internal static class StoredProcedureNames
        {
            internal const string ListInterfaceType = "[MasterData].[usp_ListInterfaceType]";
        }
    }
}
