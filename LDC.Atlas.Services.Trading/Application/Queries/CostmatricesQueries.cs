using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Trading.Application.Queries.Dto;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Queries
{
    public class CostMatricesQueries : BaseRepository, ICostMatricesQueries
    {

        public CostMatricesQueries(IDapperContext dapperContext)
            : base(dapperContext)
        {
        }

        public async Task<IEnumerable<CostMatriceDto>> GetCostMatrixListAsync(string company)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            var costMatrices = await ExecuteQueryAsync<CostMatriceDto>(StoredProcedureNames.ListCostMatrix, queryParameters);

            return costMatrices;
        }

        public async Task<CostMatriceDto> GetCostMatrixByIdAsync(long costmatrixId)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@CostmatrixId", costmatrixId);

            CostMatriceDto result;

            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetCostMatrixById, queryParameters))
            {
                result = (await grid.ReadAsync<CostMatriceDto>()).FirstOrDefault();

                if (result != null)
                {
                    result.CostMatrixLines = await grid.ReadAsync<CostMatrixLineDto>();
                }
            }

            return result;
        }

        public async Task<bool> CheckCostMatrixNameExistsAsync(string company, string name)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Name", name);
            queryParameters.Add("@CompanyId", company);

            var exists = await ExecuteQueryFirstOrDefaultAsync<bool>(StoredProcedureNames.CheckCostMatrixName, queryParameters);

            return exists;
        }

        private static class StoredProcedureNames
        {
            internal const string ListCostMatrix = "[Trading].[usp_ListCostMatrix]";
            internal const string GetCostMatrixById = "[Trading].[usp_GetCostmatrixById]";
            internal const string CheckCostMatrixName = "[Invoicing].[usp_CheckCostMatrix]";
        }
    }
}
