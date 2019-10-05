using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.Controlling.Entities;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Controlling.Repositories
{
    public class ReportingRepository : BaseRepository, IReportingRepository
    {
        public ReportingRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
           typeof(Accrual),
           new ColumnAttributeTypeMapper<Accrual>());

            SqlMapper.SetTypeMap(
                typeof(Aggregation),
                new ColumnAttributeTypeMapper<Aggregation>());
        }

        public Task<IEnumerable<Accrual>> GetAccrualsForLdeomReport(string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@company", company);

            var accruals = ExecuteQueryAsync<Accrual>(
                StoredProcedureNames.GetAccruals,
                queryParameters);

            return accruals;
        }

        public Task<IEnumerable<Aggregation>> GetAggregationsForLdeomReport(string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@company", company);

            var aggregations = ExecuteQueryAsync<Aggregation>(
                StoredProcedureNames.GetAggregations,
                queryParameters);

            return aggregations;
        }

        private static class StoredProcedureNames
        {
            internal const string GetAccruals = "[Controlling].[GET_Accruals]";
            internal const string GetAggregations = "[Controlling].[GET_AccrualsAggregated]";
        }
    }
}
