using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class CommodityRepository : BaseRepository, ICommodityRepository
    {
        public CommodityRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(Commodity),
                       new ColumnAttributeTypeMapper<Commodity>());
        }

        public async Task<IEnumerable<Commodity>> GetAllAsync(string companyId, CommoditySearchTerm commoditySearchTerm, int? offset, int? limit, bool includeDeactivated = false, string description = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add("@PrincipalCommodity", commoditySearchTerm.PrincipalCommodity);
            queryParameters.Add("@CommodityOrigin", commoditySearchTerm.Part2);
            queryParameters.Add("@CommodityGrade", commoditySearchTerm.Part3);
            queryParameters.Add("@CommodityLvl4", commoditySearchTerm.Part4);
            queryParameters.Add("@CommodityLvl5", commoditySearchTerm.Part5);
            queryParameters.Add("@offsetRows", offset ?? 0);
            queryParameters.Add("@fetchRows", limit ?? int.MaxValue);
            queryParameters.Add("@IncludeDeactivated", includeDeactivated);
            queryParameters.Add("@Description", description);

            var commodities = await ExecuteQueryAsync<Commodity>(
                StoredProcedureNames.GetCommodities,
                queryParameters);

            return commodities;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetCommodities = "[Masterdata].[usp_ListCommodities]";
        }
    }
}
