using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class VesselRepository : BaseRepository, IVesselRepository
    {
        public VesselRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                        typeof(Vessel),
                        new ColumnAttributeTypeMapper<Vessel>());
        }

        public async Task<IEnumerable<Vessel>> GetAllAsync(string company, bool includeDeactivated = false, string vesselName = null, string vesselDescription = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Company", company);
            queryParameters.Add("@IncludeDeactivated", includeDeactivated);
            queryParameters.Add("@VesselName", vesselName);
            queryParameters.Add("@Description", vesselDescription);

            var vessels = await ExecuteQueryAsync<Vessel>(StoredProcedureNames.GetVessels, queryParameters);

            return vessels;
        }

        public async Task UpdateVessel(ICollection<Vessel> listVessel)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@iVessel", ToVesselTvp(listVessel));

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateVessel, queryParameters, true);
        }

        private DataTable ToVesselTvp(ICollection<Vessel> values)
        {
            var table = new DataTable();
            table.SetTypeName("[MasterData].[UDTT_Vessel]");

            var vesselId = new DataColumn("VesselId", typeof(long));
            table.Columns.Add(vesselId);

            var mdmId = new DataColumn("MDMId", typeof(string));
            table.Columns.Add(mdmId);

            var vesselName = new DataColumn("VesselName", typeof(string));
            table.Columns.Add(vesselName);

            var description = new DataColumn("Description", typeof(string));
            table.Columns.Add(description);

            var imo = new DataColumn("Imo", typeof(string));
            table.Columns.Add(imo);

            var built = new DataColumn("Built", typeof(int));
            table.Columns.Add(built);

            var flag = new DataColumn("Flag", typeof(long));
            table.Columns.Add(flag);

            var callSign = new DataColumn("CallSign", typeof(string));
            table.Columns.Add(callSign);

            var type = new DataColumn("Type", typeof(string));
            table.Columns.Add(type);

            var net = new DataColumn("Net", typeof(decimal));
            table.Columns.Add(net);

            var gross = new DataColumn("Gross", typeof(decimal));
            table.Columns.Add(gross);

            var deadWeightSummer = new DataColumn("DeadWeightSummer", typeof(decimal));
            table.Columns.Add(deadWeightSummer);

            var deadWeightWinter = new DataColumn("DeadWeightWinter", typeof(decimal));
            table.Columns.Add(deadWeightWinter);

            var isDeactivated = new DataColumn("IsDeactivated", typeof(bool));
            table.Columns.Add(isDeactivated);

            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();
                    row[vesselId] = value.VesselId;
                    row[mdmId] = value.MDMId;
                    row[vesselName] = value.VesselName;
                    row[description] = value.Description;
                    row[imo] = value.Imo;
                    row[built] = value.Built;
                    row[flag] = value.Flag;
                    row[callSign] = value.CallSign;
                    row[type] = value.Type;
                    row[net] = value.Net;
                    row[gross] = value.Gross;
                    row[deadWeightSummer] = value.DeadWeightSummer;
                    row[deadWeightWinter] = value.DeadWeightWinter;
                    row[isDeactivated] = value.IsDeactivated;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetVessels = "[Masterdata].[usp_ListVessels]";
            internal const string UpdateVessel = "[MasterData].[usp_UpdateVessel]";
        }
    }
}
