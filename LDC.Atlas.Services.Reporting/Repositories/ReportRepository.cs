using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Reporting.Entities;
using LDC.Atlas.Services.Reporting.Repositories;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Freeze.Repositories
{
    public class ReportRepository : BaseRepository, IReportRepository
    {
        public ReportRepository(IDapperContext dapperContext)
          : base(dapperContext)
        {
        }

        public async Task<int> CreateReportCriteriasAsync(ReportPredicate predicate)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", predicate.CompanyId);

            queryParameters.Add("@Criterias", ToArrayTVP(predicate.Criterias));

            queryParameters.Add("@PredicateId", dbType: DbType.Int32, direction: ParameterDirection.Output);

            await ExecuteNonQueryAsync(StoredProcedureNames.CreatePredicate, queryParameters, true);

            var predicateId = queryParameters.Get<int>("@PredicateId");

            return predicateId;
        }

        private static DataTable ToArrayTVP(IEnumerable<ReportCriteria> criterias)
        {
            var table = new DataTable();
            table.SetTypeName("[Report].[UDTT_Criteria]");

            var tableAlias = new DataColumn("TableAlias", typeof(string));
            table.Columns.Add(tableAlias);

            var valueColumn = new DataColumn("Value", typeof(string));
            table.Columns.Add(valueColumn);

            if (criterias != null)
            {
                foreach (var criteria in criterias)
                {
                    var row = table.NewRow();
                    row[tableAlias] = criteria.TableAlias;
                    row[valueColumn] = criteria.Value;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        private static class StoredProcedureNames
        {
            internal const string CreatePredicate = "[Report].[usp_CreatePredicate]";
        }
    }
}
