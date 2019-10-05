using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Reporting.Application.Queries.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Reporting.Application.Queries
{
    public class PnlMovementQueries : BaseRepository, IPnlMovementQueries
    {
        public PnlMovementQueries(IDapperContext dapperContext)
          : base(dapperContext)
        {
        }

        public async Task<string> GetPnlMovementSummeryMessage(string company, string dataVersionId, string compDataVersionId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Company", company);
            queryParameters.Add("@Database", dataVersionId);
            queryParameters.Add("@CompDatabase", compDataVersionId);
            var message = await ExecuteScalarAsync<string>(StoredProcedureNames.PnLMovementSummaryMessage, queryParameters);
            return message;
        }

        private static class StoredProcedureNames
        {
            internal const string PnLMovementSummaryMessage = "[Report].[usp_GetPnLMovementSummary_Message]";
        }
    }
}
