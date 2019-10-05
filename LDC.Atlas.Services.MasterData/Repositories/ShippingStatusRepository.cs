using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Data;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class ShippingStatusRepository : BaseRepository, IShippingStatusRepository
    {
        public ShippingStatusRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(ShippingStatus),
                       new ColumnAttributeTypeMapper<ShippingStatus>());
        }

        public async Task<IEnumerable<ShippingStatus>> GetAllAsync(string company, bool includeDeactivated = false, string shippingStatusCode = null, string description = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@ShippingStatusCode", shippingStatusCode);
            queryParameters.Add("@Description", description);

            var shippingStatus = await ExecuteQueryAsync<ShippingStatus>(
                StoredProcedureNames.GetShippingStatus,
                queryParameters);

            return shippingStatus;
        }

        public async Task UpdateShippingStatu(ICollection<ShippingStatus> listShippingStatus)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@iShippingStatus", ToShippingStatusTvp(listShippingStatus));

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdatePriceUnits, queryParameters, true);
        }

        private DataTable ToShippingStatusTvp(ICollection<ShippingStatus> values)
        {
            var table = new DataTable();
            table.SetTypeName("[MasterData].[UDTT_ShippingStatus]");

            var shippingStatusId = new DataColumn("ShippingStatusId", typeof(long));
            table.Columns.Add(shippingStatusId);

            var shippingStatusCode = new DataColumn("ShippingStatusCode", typeof(string));
            table.Columns.Add(shippingStatusCode);

            var description = new DataColumn("Description", typeof(string));
            table.Columns.Add(description);

            var actAsDelivered = new DataColumn("ActAsDelivered", typeof(bool));
            table.Columns.Add(actAsDelivered);

            var actAsWrittenOff = new DataColumn("ActAsWrittenOff", typeof(bool));
            table.Columns.Add(actAsWrittenOff);

            var actAsCallOff = new DataColumn("ActAsCallOff", typeof(bool));
            table.Columns.Add(actAsCallOff);

            var actAsWeightLoss = new DataColumn("ActAsWeightLoss", typeof(bool));
            table.Columns.Add(actAsWeightLoss);

            var isDeactivated = new DataColumn("IsDeactivated", typeof(bool));
            table.Columns.Add(isDeactivated);

            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();
                    row[shippingStatusId] = value.ShippingStatusId;
                    row[shippingStatusCode] = value.ShippingStatusCode;
                    row[description] = value.Description;
                    row[actAsDelivered] = value.ActAsDelivered;
                    row[actAsWrittenOff] = value.ActAsWrittenOff;
                    row[actAsCallOff] = value.ActAsCallOff;
                    row[actAsWeightLoss] = value.ActAsWeightLoss;
                    row[isDeactivated] = value.IsDeactivated;

                    table.Rows.Add(row);
                }
            }

            return table;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetShippingStatus = "[Masterdata].[usp_ListShippingStatus]";
            internal const string UpdatePriceUnits = "[Masterdata].[usp_UpdateShippingStatus]";
        }
    }
}
