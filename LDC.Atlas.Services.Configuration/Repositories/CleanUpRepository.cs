using Dapper;
using LDC.Atlas.DataAccess;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Repositories
{
    public class CleanUpRepository : BaseRepository, ICleanUpRepository
    {
        public CleanUpRepository(IDapperContext dapperContext)
          : base(dapperContext)
        {
        }

        public async Task CleanUpAudit(int companyId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyId);

            await ExecuteNonQueryAsync(StoredProcedureNames.CleanUpAudit, queryParameters, false);
        }

        public async Task CleanUpProcessMessages(int companyId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyId);

            await ExecuteNonQueryAsync(StoredProcedureNames.CleanUpProcessMessages, queryParameters, false);
        }

        public async Task CleanUpSSRSPredicates(int companyId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyId);

            await ExecuteNonQueryAsync(StoredProcedureNames.CleanUpSSRSPredicates, queryParameters, false);
        }

        private static class StoredProcedureNames
        {
            internal const string CleanUpAudit = "[Configuration].[usp_CleanUpAudit]";
            internal const string CleanUpProcessMessages = "[Configuration].[usp_CleanUpProcessMessages]";
            internal const string CleanUpSSRSPredicates = "[Configuration].[usp_CleanUpSSRSPredicates]";
        }
    }
}
