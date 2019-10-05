using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class ProcessStatusRepository : BaseRepository, IProcessStatusRepository
    {
        public ProcessStatusRepository(IDapperContext dapperContext)
           : base(dapperContext)
        {
        }

        public async Task<IEnumerable<ProcessStatus>> GetAllAsync()
        {
            var queryParameters = new DynamicParameters();

            var processStatuses = await ExecuteQueryAsync<ProcessStatus>(
                StoredProcedureNames.GetProcessStatuses, queryParameters);

            return processStatuses;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetProcessStatuses = "[Masterdata].[usp_ListProcessStatus]";
        }
    }
}
