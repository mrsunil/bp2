using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Data;
using System;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class PortRepository : BaseRepository, IPortRepository
    {
        public PortRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(Port),
                       new ColumnAttributeTypeMapper<Port>());
        }

        public async Task<IEnumerable<Port>> GetAllAsync(string company, int? offset, int? limit, bool includeDeactivated = false, string portCode = null, string description = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Company", company);
            queryParameters.Add("@portCode", portCode);
            queryParameters.Add("@Description", description);
            queryParameters.Add("@IncludeDeactivated", includeDeactivated);

            queryParameters.Add("@offsetRows", offset ?? 0);
            queryParameters.Add("@fetchRows", limit ?? int.MaxValue);

            var ports = await ExecuteQueryAsync<Port>(
               StoredProcedureNames.GetPorts,
                queryParameters);

            return ports;
        }

        public async Task UpdatePortsUnit(ICollection<Port> listPort)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@iPort", ToPortTvp(listPort));

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdatePortUnits, queryParameters, true);
        }

        private DataTable ToPortTvp(ICollection<Port> values)
        {
            var table = new DataTable();
            table.SetTypeName("[MasterData].[UDTT_Port]");

            var portId = new DataColumn("PortId", typeof(long));
            table.Columns.Add(portId);

            var portCode = new DataColumn("PortCode", typeof(string));
            table.Columns.Add(portCode);            

            var mDMId = new DataColumn("MDMId", typeof(string));
            table.Columns.Add(mDMId);

            var description = new DataColumn("Description", typeof(string));
            table.Columns.Add(description);

            var countryId = new DataColumn("CountryId", typeof(long));
            table.Columns.Add(countryId);

            var type = new DataColumn("Type", typeof(string));
            table.Columns.Add(type);

            var address = new DataColumn("Address", typeof(string));
            table.Columns.Add(address);

            var provinceId = new DataColumn("ProvinceId", typeof(long));
            table.Columns.Add(provinceId);

            var isDeactivated = new DataColumn("IsDeactivated", typeof(bool));
            table.Columns.Add(isDeactivated);

            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();
                    row[portId] = value.PortId;
                    row[portCode] = value.PortCode;
                    row[description] = value.Description;
                    row[mDMId] = value.MDMId;
                    row[countryId] = value.CountryId;
                    row[type] = value.Type;
                    row[address] = value.Address;
                    row[provinceId] = value.ProvinceId ?? (object)DBNull.Value;
                    row[isDeactivated] = value.IsDeactivated;

                    table.Rows.Add(row);
                }
            }

            return table;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetPorts = "[Masterdata].[usp_ListPorts]";
            internal const string UpdatePortUnits = "[Masterdata].[usp_UpdatePort]";
        }
    }
}