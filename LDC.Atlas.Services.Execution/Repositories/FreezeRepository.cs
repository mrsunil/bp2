using Dapper;
using LDC.Atlas.DataAccess;
using System;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Repositories
{
    public class FreezeRepository : BaseRepository, IFreezeRepository
    {
        public FreezeRepository(IDapperContext dapperContext)
          : base(dapperContext)
        {
        }

        public async Task<DateTime?> GetFreezeNotClosedAsync(string company, long dataVersionId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Company", company);
            queryParameters.Add(DataVersionIdParameter, dataVersionId);

            var freeze = await ExecuteQueryFirstOrDefaultAsync<DateTime?>(StoredProcedureNames.GetFreezeByIdNotClosed, queryParameters);

            return freeze;
        }

        private static class StoredProcedureNames
        {
            internal const string GetFreezeByIdNotClosed = "[Freeze].[usp_GetFreezeByIdNotClosed]";
        }
    }
}
