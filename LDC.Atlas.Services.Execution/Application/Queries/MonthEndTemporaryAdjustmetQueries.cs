using Dapper;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.Execution.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Application.Queries
{
    public class MonthEndTemporaryAdjustmetQueries : BaseRepository, IMonthEndTemporaryAdjustmetQueries
    {
        private readonly IIdentityService _identityService;

        public MonthEndTemporaryAdjustmetQueries(IDapperContext dapperContext, IIdentityService identityService)
            : base(dapperContext)
        {
            _identityService = identityService;
            SqlMapper.SetTypeMap(typeof(MonthEndTemporaryAdjustmentReport), new ColumnAttributeTypeMapper<MonthEndTemporaryAdjustmentReport>());
        }

        public async Task<IEnumerable<MonthEndTemporaryAdjustmentReport>> GetMonthEndTemporaryAdjustmentReportAsync(string company, short type,int? reportType, int? dataVersionId, int? offset, int? limit)
        {
            var queryParameters = new DynamicParameters();

            string storedProcedure = "";
            queryParameters.Add(DataVersionIdParameter, dataVersionId);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@type", type);
            switch (reportType)
            {
                case 1:
                    storedProcedure = StoredProcedureNames.GetTradeCostforMonthEndProcess;
                    break;
                case 2:
                    storedProcedure = StoredProcedureNames.GetTradeCostforUnrealizedForMonthEndProcess;
                    break;
            }

            var tradeCostGenerateMonthEndResults = await ExecuteQueryAsync<MonthEndTemporaryAdjustmentReport>(storedProcedure, queryParameters, false);

            return tradeCostGenerateMonthEndResults.ToList();
        }

        public async Task<IEnumerable<FxDealMonthEndTemporaryAdjustmentReport>> GetFxDealDetailsGenerateMonthEndAsync(string company, int? dataVersionId, int? offset, int? limit)
        {
            var queryParameters = new DynamicParameters();
            string storedProcedure = string.Empty;
            if (dataVersionId != 0)
            {
                queryParameters.Add(DataVersionIdParameter, dataVersionId);
            }

            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@OffsetRows", offset ?? 0);
            queryParameters.Add("@FetchRows", limit ?? int.MaxValue);

            var fxDealGenerateMonthEndResults = await ExecuteQueryAsync<FxDealMonthEndTemporaryAdjustmentReport>(StoredProcedureNames.GetFxDealDetailsForMonthEndProcess, queryParameters, true);

            return fxDealGenerateMonthEndResults.ToList();
        }

        internal static class StoredProcedureNames
        {
            internal const string GetTradeCostforMonthEndProcess = "[Trading].[usp_GetTradeCostforMonthEndProcess]";
            internal const string GetTradeCostforUnrealizedForMonthEndProcess = "[Trading].[usp_GetTradeCostforUnrealisedMonthEndProcess]";
            internal const string GetFxDealDetailsForMonthEndProcess = "[Trading].[usp_GetFxDealForMonthEndProcess]";
        }
    }
}
