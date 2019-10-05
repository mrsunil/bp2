using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Reporting.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Reporting.Repositories
{
    public class LdrepManualAdjustmentRepository : BaseRepository, ILdrepManualAdjustmentRepository
    {
        public LdrepManualAdjustmentRepository(IDapperContext dapperContext)
      : base(dapperContext)
        {
        }

        public async Task<LdrepManualAdjustment> CreateUpdateLdrepManualAdjustment(LdrepManualAdjustment ldrepManualAdjustment)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CompanyId", ldrepManualAdjustment.Company);
            queryParameters.Add("@ManualAdjustments", ToArrayTvp(ldrepManualAdjustment.LdrepManualAdjustmentRecords));

            LdrepManualAdjustment res = await ExecuteQueryFirstOrDefaultAsync<LdrepManualAdjustment>(StoredProcedureNames.CreateUpdateLdrepManualAdjustments, queryParameters, true);

            return res;
        }

        public async Task DeleteLdrepManualAdjustment(LdrepManualAdjustment ldrepManualAdjustment)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@ManualAdjustments", ToArrayTvp(ldrepManualAdjustment.LdrepManualAdjustmentRecords));
            queryParameters.Add("@CompanyId", ldrepManualAdjustment.Company);

            await ExecuteNonQueryAsync(StoredProcedureNames.DeleteLdrepManualAdjustment, queryParameters);
        }

        private static DataTable ToArrayTvp(IEnumerable<LdrepManualAdjustmentRecords> values)
        {
            var table = new DataTable();
            table.SetTypeName("[Report].[UDTT_ManualAdjustment]");

            var manualAdjustmentId = new DataColumn("ManualAdjustmentId", typeof(int));
            table.Columns.Add(manualAdjustmentId);

            var fromDateFormat = new DataColumn("FromDateFormat", typeof(bool));
            table.Columns.Add(fromDateFormat);

            var dateFrom = new DataColumn("DateFrom", typeof(DateTime));
            table.Columns.Add(dateFrom);

            var toDateFormat = new DataColumn("ToDateFormat", typeof(bool));
            table.Columns.Add(toDateFormat);

            var dateTo = new DataColumn("DateTo", typeof(DateTime));
            table.Columns.Add(dateTo);

            var departmentId = new DataColumn("DepartmentId", typeof(long));
            table.Columns.Add(departmentId);

            var pnlTypeId = new DataColumn("PNLTypeId", typeof(byte));
            table.Columns.Add(pnlTypeId);

            var realized = new DataColumn("Realized", typeof(bool));
            table.Columns.Add(realized);

            var functionalCCYAdjustment = new DataColumn("FunctionalCCYAdjustment", typeof(decimal));
            table.Columns.Add(functionalCCYAdjustment);

            var statutoryCCYAdjustment = new DataColumn("StatutoryCCYAdjustment", typeof(decimal));
            table.Columns.Add(statutoryCCYAdjustment);

            var narrative = new DataColumn("Narrative", typeof(string));
            table.Columns.Add(narrative);

            var charterRefrenceId = new DataColumn("CharterRefrenceId", typeof(int));
            table.Columns.Add(charterRefrenceId);

            var sectionId = new DataColumn("SectionId", typeof(long));
            table.Columns.Add(sectionId);

            var commodityId = new DataColumn("CommodityId", typeof(long));
            table.Columns.Add(commodityId);

            var cropYear = new DataColumn("CropYear", typeof(string));
            table.Columns.Add(cropYear);

            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();
                    row[manualAdjustmentId] = value.ManualAdjustmentId != 0 ? value.ManualAdjustmentId : (object)DBNull.Value;
                    row[fromDateFormat] = value.FromDateFormat;
                    row[dateFrom] = value.DateFrom;
                    row[toDateFormat] = value.ToDateFormat != null ? value.ToDateFormat : (object)DBNull.Value;
                    row[dateTo] = value.DateTo != null ? value.DateTo : (object)DBNull.Value;
                    row[departmentId] = value.DepartmentId;
                    row[pnlTypeId] = value.PNLTypeId;
                    row[realized] = value.Realized;
                    row[functionalCCYAdjustment] = value.FunctionalCCYAdjustment;
                    row[statutoryCCYAdjustment] = value.StatutoryCCYAdjustment;
                    row[narrative] = value.Narrative;
                    row[charterRefrenceId] = value.CharterRefrenceId != null ? value.CharterRefrenceId : (object)DBNull.Value;
                    row[sectionId] = value.SectionId != null ? value.SectionId : (object)DBNull.Value;
                    row[commodityId] = value.CommodityId != null ? value.CommodityId : (object)DBNull.Value;
                    row[cropYear] = value.CropYear;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        private static class StoredProcedureNames
        {
            internal const string CreateUpdateLdrepManualAdjustments = "[Report].[usp_CreateUpdateLdrepManualAdjustments]";
            internal const string DeleteLdrepManualAdjustment = "[Report].[usp_DeleteLdrepManualAdjustments]";
        }
    }
}
