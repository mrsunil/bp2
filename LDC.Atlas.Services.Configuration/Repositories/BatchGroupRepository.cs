using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Configuration.Entities;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Repositories
{
    public class BatchGroupRepository : BaseRepository, IBatchGroupRepository
    {
        public BatchGroupRepository(IDapperContext dapperContext)
          : base(dapperContext)
        {
        }

        public async Task<BatchGroup> GetBatchGroupById(int batchGroupId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@BatchGroupId", batchGroupId);

            BatchGroup batchGroup;
            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetBatchGroup, queryParameters, true))
            {
                batchGroup = grid.Read<BatchGroup>().FirstOrDefault();
                if (batchGroup != null)
                {
                    batchGroup.Companies = grid.Read<BatchCompany>().ToList();
                }
            }

            return batchGroup;
        }

        public async Task<BatchConfig> GetBatchConfig(int batchGroupId, int batchActionId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@BatchGroupId", batchGroupId);
            queryParameters.Add("@BatchActionId", batchActionId);

            var batchConfig = await ExecuteQueryFirstOrDefaultAsync<BatchConfig>(StoredProcedureNames.GetBatchConfig, queryParameters, true);

            return batchConfig;
        }

        public async Task CreateBatchHistory(BatchHistory batchHistory)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@BatchGroupId", batchHistory.GroupId);
            queryParameters.Add("@BatchActionId", batchHistory.ActionId);
            queryParameters.Add("@StartTime", batchHistory.StartTime);
            queryParameters.Add("@EndTime", batchHistory.EndTime);
            queryParameters.Add("@BatchStatusId", (int)batchHistory.Status);
            queryParameters.Add("@Message", batchHistory.Message);

            await ExecuteNonQueryAsync(StoredProcedureNames.CreateBatchHistory, queryParameters);
        }

        private static class StoredProcedureNames
        {
            internal const string GetBatchGroup = "[Process].[usp_GetBatchGroup]";
            internal const string GetBatchConfig = "[Process].[usp_GetBatchConfig]";
            internal const string CreateBatchHistory = "[Process].[usp_CreateBatchHistory]";
        }
    }
}
