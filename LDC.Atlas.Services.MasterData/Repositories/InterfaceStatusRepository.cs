using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.MasterData.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class InterfaceStatusRepository : BaseRepository, IInterfaceStatusRepository
    {
        public InterfaceStatusRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
        }

        public async Task<IEnumerable<InterfaceStatus>> GetAllAsync()
        {
            var interfaceStatus = await ExecuteQueryAsync<InterfaceStatus>(StoredProcedureNames.ListInterfaceStatus);
            return interfaceStatus;
        }

        internal static class StoredProcedureNames
        {
            internal const string ListInterfaceStatus = "[MasterData].[usp_ListInterfaceStatus]";
        }
    }
}
