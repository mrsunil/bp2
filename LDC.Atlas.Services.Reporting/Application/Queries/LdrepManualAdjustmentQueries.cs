using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Reporting.Application.Queries.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Reporting.Application.Queries
{
    public class LdrepManualAdjustmentQueries : BaseRepository, ILdrepManualAdjustmentQueries
    {
        public LdrepManualAdjustmentQueries(IDapperContext dapperContext)
           : base(dapperContext)
        {
        }

        public async Task<IEnumerable<LdrepManualAdjustmentDto>> GetLdrepManualAdjustments(DateTime fromDate, DateTime? toDate, string company)
        {
            try
            {
                var queryParameters = new DynamicParameters();

                queryParameters.Add("@CompanyId", company);
                queryParameters.Add("@FromDate", fromDate);
                queryParameters.Add("@ToDate", toDate);
                queryParameters.Add(DataVersionIdParameter, null);
                var ldrepManualAdjustmentList = await ExecuteQueryAsync<LdrepManualAdjustmentDto>(StoredProcedureNames.ListLdrepManualAdjustment, queryParameters);

                return ldrepManualAdjustmentList.ToList();
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        private static class StoredProcedureNames
        {
            internal const string ListLdrepManualAdjustment = "[Report].[usp_ListLdrepManualAdjustments]";
        }
    }
}
