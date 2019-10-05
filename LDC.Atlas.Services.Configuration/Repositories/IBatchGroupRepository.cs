using LDC.Atlas.Services.Configuration.Entities;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Repositories
{
    public interface IBatchGroupRepository
    {
        Task<BatchGroup> GetBatchGroupById(int batchGroupId);

        Task<BatchConfig> GetBatchConfig(int batchGroupId, int batchActionId);

        Task CreateBatchHistory(BatchHistory batchHistory);
    }
}
