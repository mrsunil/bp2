using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Trading.Application.Queries.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Queries
{
    public class TraderQueries : BaseRepository, ITraderQueries
    {
        public TraderQueries(IDapperContext dapperContext)
            : base(dapperContext)
        {
        }

        public async Task<IEnumerable<TraderDto>> GetTradersAsync(string company, string name)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@Name", name);

            return await ExecuteQueryAsync<TraderDto>(StoredProcedureNames.GetTraders, queryParameters);
        }

        private static class StoredProcedureNames
        {
            internal const string GetTraders = "[Trading].[usp_ListTradersByCompany]";
        }
    }
}
