using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.MasterData.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class BusinessSectorRepository : BaseRepository, IBusinessSectorRepository
    {
        public BusinessSectorRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(BusinessSector),
                       new ColumnAttributeTypeMapper<BusinessSector>());
        }

        public async Task<IEnumerable<BusinessSector>> GetAllAsync(string companyId, bool includeDeactivated = false, string sectorCode = null, string description = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@companyId", companyId);
            queryParameters.Add("@IncludeDeactivated", includeDeactivated);
            queryParameters.Add("@SectorCode", sectorCode);
            queryParameters.Add("@Description", description);

            var businessSectors = await ExecuteQueryAsync<BusinessSector>(
                StoredProcedureNames.GetBusinessSectors, queryParameters);

            return businessSectors;
        }

        public async Task UpdateBusinessSector(ICollection<BusinessSector> listBusinessSector)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@iBusinessSector", ToBusinessSectorTvp(listBusinessSector));

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateBusinessSector, queryParameters, true);
        }

        private DataTable ToBusinessSectorTvp(ICollection<BusinessSector> values)
        {
            var table = new DataTable();
            table.SetTypeName("[MasterData].[UDTT_BusinessSector]");

            var sectorId = new DataColumn("SectorId", typeof(long));
            table.Columns.Add(sectorId);

            var sectorCode = new DataColumn("SectorCode", typeof(string));
            table.Columns.Add(sectorCode);

            var description = new DataColumn("Description", typeof(string));
            table.Columns.Add(description);

            var isDeactivated = new DataColumn("IsDeactivated", typeof(bool));
            table.Columns.Add(isDeactivated);

            var costTypeId = new DataColumn("CostTypeId", typeof(long));
            table.Columns.Add(costTypeId);

            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();
                    row[sectorId] = value.SectorId;
                    row[sectorCode] = value.SectorCode;
                    row[description] = value.Description;
                    row[isDeactivated] = value.IsDeactivated;
                    row[costTypeId] = value.CostTypeId != null ? value.CostTypeId : (object)DBNull.Value;

                    table.Rows.Add(row);
                }
}

            return table;
        }


        internal static class StoredProcedureNames
        {
            internal const string GetBusinessSectors = "[Masterdata].[usp_ListBusinessSectors]";
            internal const string UpdateBusinessSector = "[MasterData].[usp_UpdateBusinessSector]";
        }
    }
}
