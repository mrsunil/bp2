using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Data;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class ArbitrationRepository : BaseRepository, IArbitrationRepository
    {
        public ArbitrationRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(Arbitration),
                       new ColumnAttributeTypeMapper<Arbitration>());
        }

        public async Task<IEnumerable<MasterDataDeleteResult>> DeleteArbitrations(IEnumerable<long> arbitrationIds)
        {
            var queryParameters = new DynamicParameters();

            var ids = ConvertToBigIntListUDTT(arbitrationIds);

            queryParameters.Add("@ArbitrationIds", ids);

            return await ExecuteQueryAsync<MasterDataDeleteResult>(StoredProcedureNames.DeleteArbitrations, queryParameters, true);
        }

        public async Task<IEnumerable<Arbitration>> GetAllAsync(string company, bool includeDeactivated = false, string arbitrationCode = null, string description = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Company", company);
            queryParameters.Add("@IncludeDeactivated", includeDeactivated);
            queryParameters.Add("@ArbitrationCode", arbitrationCode);
            queryParameters.Add("@Description", description);

            var arbitrations = await ExecuteQueryAsync<Arbitration>(
                StoredProcedureNames.GetArbitrations,
                queryParameters);

            return arbitrations;
        }

        public async Task UpdateArbitration(ICollection<Arbitration> listArbitration)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@iArbitration", ToArbitrationTvp(listArbitration));

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateArbitration, queryParameters, true);
        }

        private DataTable ToArbitrationTvp(ICollection<Arbitration> values)
        {
            var table = new DataTable();
            table.SetTypeName("[MasterData].[UDTT_Arbitration]");

            var arbitrationId = new DataColumn("ArbitrationId", typeof(long));
            table.Columns.Add(arbitrationId);

            var arbitrationCode = new DataColumn("ArbitrationCode", typeof(string));
            table.Columns.Add(arbitrationCode);

            var description = new DataColumn("Description", typeof(string));
            table.Columns.Add(description);

            var text = new DataColumn("Text", typeof(string));
            table.Columns.Add(text);

            var text2 = new DataColumn("Text2", typeof(string));
            table.Columns.Add(text2);

            var isDeactivated = new DataColumn("IsDeactivated", typeof(bool));
            table.Columns.Add(isDeactivated);


            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();
                    row[arbitrationId] = value.ArbitrationId;
                    row[arbitrationCode] = value.ArbitrationCode;
                    row[description] = value.Description;
                    row[text] = value.Text;
                    row[text2] = value.Text2;
                    row[isDeactivated] = value.IsDeactivated;

                    table.Rows.Add(row);
                }
            }

            return table;
        }
        public async Task CreateArbitration(ICollection<Arbitration> listArbitration)
        {
            //var queryParameters = new DynamicParameters();
            //queryParameters.Add("@ListCommodity", ToArbitrationTvp(listArbitration));

            //await ExecuteNonQueryAsync(StoredProcedureNames.CreateCommodityTypes, queryParameters, true);
        }

        internal static class StoredProcedureNames
        {
            internal const string GetArbitrations = "[Masterdata].[usp_ListArbitrations]";
            internal const string UpdateArbitration = "[Masterdata].[usp_UpdateArbitration]";
            internal const string CreateCommodityTypes = "[Masterdata].[usp_CreateCommodityTypes]";
            internal const string DeleteArbitrations = "[Masterdata].[usp_DeleteArbitrations]";
        }
    }
}
