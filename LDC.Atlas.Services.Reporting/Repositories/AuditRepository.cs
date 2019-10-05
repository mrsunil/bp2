using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Reporting.Repositories;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Freeze.Repositories
{
    public class AuditRepository : BaseRepository, IAuditRepository
    {
        public AuditRepository(IDapperContext dapperContext)
          : base(dapperContext)
        {
        }

        public async Task ProcessDataChangeLogAsync(int dataChangeLogId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@DataChangeLogId", dataChangeLogId);

            await ExecuteNonQueryAsync(StoredProcedureNames.ProcessDataChangeLog, queryParameters);
        }

        private static class StoredProcedureNames
        {
            internal const string ProcessDataChangeLog = "[Audit].[usp_ProcessDataChangeLog]";
        }
    }
}
