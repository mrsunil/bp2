using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Data;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class RegionRepository : BaseRepository, IRegionRepository
    {
        public RegionRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(Region),
                       new ColumnAttributeTypeMapper<Region>());
        }

        public async Task<IEnumerable<MasterDataDeleteResult>> DeleteRegions(IEnumerable<long> regionIds)
        {
            var queryParameters = new DynamicParameters();

            var ids = ConvertToBigIntListUDTT(regionIds);

            queryParameters.Add("@RegionIds", ids);

            return await ExecuteQueryAsync<MasterDataDeleteResult>(StoredProcedureNames.DeleteRegions, queryParameters, true);
        }

        public async Task<IEnumerable<Region>> GetAllAsync(bool includeDeactivated = false, string ldcRegionCode = null, string description = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@IncludeDeactivated", includeDeactivated);
            queryParameters.Add("@LdcRegionCode", ldcRegionCode);
            queryParameters.Add("@Description", description);

            var regions = await ExecuteQueryAsync<Region>(
                StoredProcedureNames.GetRegions,
                queryParameters);

            return regions;
        }

        public async Task UpdateRegions(ICollection<Region> listRegion)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@iRegion", ToRegionTvp(listRegion));

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateRegion, queryParameters, true);
        }

        private DataTable ToRegionTvp(ICollection<Region> values)
        {
            var table = new DataTable();
            table.SetTypeName("[MasterData].[UDTT_Region]");

            var ldcRegionId = new DataColumn("LdcRegionId", typeof(long));
            table.Columns.Add(ldcRegionId);

            var ldcRegionCode = new DataColumn("LdcRegionCode", typeof(string));
            table.Columns.Add(ldcRegionCode);

            var description = new DataColumn("Description", typeof(string));
            table.Columns.Add(description);

            var isDeactivated = new DataColumn("IsDeactivated", typeof(bool));
            table.Columns.Add(isDeactivated);

            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();
                    row[ldcRegionId] = value.LdcRegionId;
                    row[ldcRegionCode] = value.LdcRegionCode;
                    row[description] = value.Description;
                    row[isDeactivated] = value.IsDeactivated;

                    table.Rows.Add(row);
                }
            }

            return table;
        }


        internal static class StoredProcedureNames
        {
            internal const string GetRegions = "[Masterdata].[usp_ListRegions]";
            internal const string UpdateRegion = "[Masterdata].[usp_UpdateRegion]";
            internal const string DeleteRegions = "[Masterdata].[usp_DeleteRegions]";
        }
    }
}
