using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Data;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class WeightUnitRepository : BaseRepository, IWeightUnitRepository
    {
        public WeightUnitRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(WeightUnit),
                       new ColumnAttributeTypeMapper<WeightUnit>());
        }

        public async Task<IEnumerable<WeightUnit>> GetAllAsync(string company, bool includeDeactivated = false, string weightCode = null, string description = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Company", company);
            queryParameters.Add("@IncludeDeactivated", includeDeactivated);
            queryParameters.Add("@WeightCode", weightCode);
            queryParameters.Add("@Description", description);

            var weightUnits = await ExecuteQueryAsync<WeightUnit>(StoredProcedureNames.GetWeightUnits, queryParameters);

            return weightUnits;
        }

        public async Task<IEnumerable<CompanyAssignment>> GetAssignmentsAsync(IEnumerable<long> weightUnitIds)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@iWeightUnitIds", ConvertToBigIntListUDTT(weightUnitIds));

            var assignments = await ExecuteQueryAsync<CompanyAssignment>(
                StoredProcedureNames.GetWeightUnitAssignments,
                queryParameters);

            return assignments;
        }

        public async Task UpdateweightUnit(ICollection<WeightUnit> listWeightUnit)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@iWeightUnit", ToWeightUnitTvp(listWeightUnit));

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateWeightUnit, queryParameters, true);
        }

        private DataTable ToWeightUnitTvp(ICollection<WeightUnit> values)
        {
            var table = new DataTable();
            table.SetTypeName("[MasterData].[UDTT_WeightUnit]");

            var weightUnitId = new DataColumn("WeightUnitId", typeof(long));
            table.Columns.Add(weightUnitId);

            var weightCode = new DataColumn("WeightCode", typeof(string));
            table.Columns.Add(weightCode);

            var description = new DataColumn("Description", typeof(string));
            table.Columns.Add(description);

            var conversionFactor = new DataColumn("ConversionFactor", typeof(decimal));
            table.Columns.Add(conversionFactor);

            var isDeactivated = new DataColumn("IsDeactivated", typeof(bool));
            table.Columns.Add(isDeactivated);

            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();
                    row[weightUnitId] = value.WeightUnitId;
                    row[weightCode] = value.WeightCode;
                    row[description] = value.Description;
                    row[conversionFactor] = value.ConversionFactor;
                    row[isDeactivated] = value.IsDeactivated;

                    table.Rows.Add(row);
                }
            }

            return table;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetWeightUnits = "[Masterdata].[usp_ListWeightUnits]";
            internal const string UpdateWeightUnit = "[Masterdata].[usp_UpdateWeightUnit]";
            internal const string GetWeightUnitAssignments = "[MasterData].[usp_GetWeightUnitAssignments]";
        }
    }
}
