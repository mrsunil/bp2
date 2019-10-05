using Dapper;
using LDC.Atlas.DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Controlling.Repositories
{
    public class FreezeRecalculationRepository : BaseRepository, IFreezeRecalculationRepository
    {
        public FreezeRecalculationRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
        }

        public async Task LaunchFreezeRecalculationAsync(string userId, long dataVersionId, long sectionId, bool recalculateAccEntries)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@UserId", userId);
            queryParameters.Add("@SectionId", sectionId);
            queryParameters.Add("@DataVersionId", dataVersionId);
            queryParameters.Add("@RecalculateAccEntries", recalculateAccEntries);

            await ExecuteNonQueryAsync(StoredProcedureNames.FreezeRecalc, queryParameters, true);
        }

        private static class StoredProcedureNames
        {
            internal const string FreezeRecalc = "[Controlling].[usp_RecalculateAmounts]";
        }
    }
}
