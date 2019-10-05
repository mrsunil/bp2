using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using System.Data;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class ProfitCenterRepository : BaseRepository, IProfitCenterRepository
    {
        public ProfitCenterRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(ProfitCenter),
                       new ColumnAttributeTypeMapper<ProfitCenter>());
        }

        public async Task<IEnumerable<ProfitCenter>> GetAllAsync(string[] company, bool includeDeactivated = false, string profitCenterCode = null, string description = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Company", ToSelectedCompanyTVP(company));
            queryParameters.Add("@IncludeDeactivated", includeDeactivated);
            queryParameters.Add("@ProfitCenterCode", profitCenterCode);
            queryParameters.Add("@Description", description);

            var profitCenters = await ExecuteQueryAsync<ProfitCenter>(
                StoredProcedureNames.GetProfitCenters,
                queryParameters);

            return profitCenters;
        }

        public async Task UpdateProfitCenters(ICollection<ProfitCenter> listProfitCenters)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@iProfitCenter", ToProfitCentersTvp(listProfitCenters));

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateProfitCenters, queryParameters, true);
        }

        private DataTable ToProfitCentersTvp(ICollection<ProfitCenter> values)
        {
            var table = new DataTable();
            table.SetTypeName("[MasterData].[UDTT_ProfitCenter]");

            var profitCenterId = new DataColumn("ProfitCenterId", typeof(long));
            table.Columns.Add(profitCenterId);

            var mDMId = new DataColumn("MDMId", typeof(string));
            table.Columns.Add(mDMId);

            var profitCenterCode = new DataColumn("ProfitCenterCode", typeof(string));
            table.Columns.Add(profitCenterCode);

            var description = new DataColumn("Description", typeof(string));
            table.Columns.Add(description);

            var altCode = new DataColumn("AltCode", typeof(string));
            table.Columns.Add(altCode);

            var isDeactivated = new DataColumn("IsDeactivated", typeof(bool));
            table.Columns.Add(isDeactivated);

            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();
                    row[profitCenterId] = value.ProfitCenterId;
                    row[mDMId] = value.MdmId;
                    row[profitCenterCode] = value.ProfitCenterCode;
                    row[description] = value.Description;
                    row[altCode] = value.AltCode;
                    row[isDeactivated] = value.IsDeactivated;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        private static DataTable ToSelectedCompanyTVP(string[] selectedCompanies)
        {
            DataTable table = new DataTable();
            table.SetTypeName("[dbo].[UDTT_VarcharList]");
            var name = new DataColumn("[Name]", typeof(string));
            table.Columns.Add(name);
            if (selectedCompanies != null)
            {
                foreach (string company in selectedCompanies)
                {
                    var row = table.NewRow();
                    row[name] = company;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetProfitCenters = "[Masterdata].[usp_ListProfitCenters]";
            internal const string UpdateProfitCenters = "[Masterdata].[usp_UpdateProfitCenter]";
        }
    }
}
