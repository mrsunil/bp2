using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class PostingStatusRepository : BaseRepository, IPostingStatusRepository
    {
        public PostingStatusRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
        }

        public async Task<IEnumerable<EnumEntity>> GetAllAsync(string company)
        {
            var postingStatus = await ExecuteQueryAsync<EnumEntity>(
                StoredProcedureNames.GetPostingStatus);

            return postingStatus;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetPostingStatus = "[Masterdata].[usp_ListPostingStatus]";
        }
    }
}
