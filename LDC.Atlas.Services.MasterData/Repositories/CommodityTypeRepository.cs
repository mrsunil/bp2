using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class CommodityTypeRepository : BaseRepository, ICommodityTypeRepository
    {
        public CommodityTypeRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(CommodityType),
                       new ColumnAttributeTypeMapper<CommodityType>());
        }

        public async Task<IEnumerable<CommodityType>> GetAllAsync(bool includeDeactivated = false, string code = null, string description = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@IncludeDeactivated", includeDeactivated);
            queryParameters.Add("@Code", code);
            queryParameters.Add("@Description", description);

            var commodityTypes = await ExecuteQueryAsync<CommodityType>(
                StoredProcedureNames.GetCommodityTypes,
                queryParameters);

            return commodityTypes;
        }

        public async Task UpdateCommodityType(ICollection<CommodityType> listCommodity)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@ListCommodity", ToCommodityTvp(listCommodity));

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateCommodityTypes, queryParameters, true);
        }

        public async Task CreateCommodityType(ICollection<CommodityType> listCommodity)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@ListCommodity", ToCommodityTvp(listCommodity));

            await ExecuteNonQueryAsync(StoredProcedureNames.CreateCommodityTypes, queryParameters, true);
        }

        public async Task<IEnumerable<MasterDataDeleteResult>> DeleteCommodityType(IEnumerable<long> commodityTypeIds)
        {
            var queryParameters = new DynamicParameters();

            var ids = ConvertToBigIntListUDTT(commodityTypeIds);

            queryParameters.Add("@CommodityTypeIds", ids);

            return await ExecuteQueryAsync<MasterDataDeleteResult>(StoredProcedureNames.DeleteCommodityTypes, queryParameters, true);
        }

        private DataTable ToCommodityTvp(ICollection<CommodityType> values)
        {
            var table = new DataTable();
            table.SetTypeName("[MasterData].[UDTT_CommodityType]");

            var commodityTypeId = new DataColumn("CommodityTypeId", typeof(long));
            table.Columns.Add(commodityTypeId);

            var code = new DataColumn("Code", typeof(string));
            table.Columns.Add(code);

            var description = new DataColumn("Description", typeof(string));
            table.Columns.Add(description);

            var isDeactivated = new DataColumn("IsDeactivated", typeof(bool));
            table.Columns.Add(isDeactivated);

            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();
                    row[commodityTypeId] = value.CommodityTypeId;
                    row[code] = value.Code;
                    row[description] = value.Description;
                    row[isDeactivated] = value.IsDeactivated;

                    table.Rows.Add(row);
                }
            }

            return table;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetCommodityTypes = "[Masterdata].[usp_ListCommodityTypes]";
            internal const string UpdateCommodityTypes = "[Masterdata].[usp_UpdateCommodityTypes]";
            internal const string CreateCommodityTypes = "[Masterdata].[usp_CreateCommodityTypes]";
            internal const string DeleteCommodityTypes = "[Masterdata].[usp_DeleteCommodityTypes]";
        }
    }
}
