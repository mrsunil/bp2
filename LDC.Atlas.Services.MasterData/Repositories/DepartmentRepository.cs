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
    public class DepartmentRepository : BaseRepository, IDepartmentRepository
    {
        public DepartmentRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(Department),
                       new ColumnAttributeTypeMapper<Department>());
        }

        public async Task<IEnumerable<Department>> GetAllAsync(string[] company, string departmentCode, int? offset, int? limit, bool flag = false, bool includeDeactivated = false, string description = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@company", ToSelectedCompanyTVP(company));
            queryParameters.Add("@departmentCode", departmentCode);
            queryParameters.Add("@IncludeDeactivated", includeDeactivated);
            queryParameters.Add("@Description", description);

            queryParameters.Add("@offsetRows", offset ?? 0);
            queryParameters.Add("@fetchRows", limit ?? int.MaxValue);

            var departments = await ExecuteQueryAsync<Department>(
                StoredProcedureNames.GetDepartments,
                queryParameters,
                !flag);

            return departments;
        }

        public async Task<IEnumerable<MasterDataDeleteResult>> DeleteDepartments(IEnumerable<long> departmentIds)
        {
            var queryParameters = new DynamicParameters();

            var ids = ConvertToBigIntListUDTT(departmentIds);

            queryParameters.Add("@DepartmentIds", ids);

            return await ExecuteQueryAsync<MasterDataDeleteResult>(StoredProcedureNames.DeleteDepartments, queryParameters, true);
        }

        public async Task UpdateDepartments(ICollection<Department> listDepartments)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@iDepartment", ToDepartmentsTvp(listDepartments));

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateDepartments, queryParameters, true);
        }

        private DataTable ToDepartmentsTvp(ICollection<Department> values)
        {
            var table = new DataTable();
            table.SetTypeName("[MasterData].[UDTT_Department]");

            var departmentId = new DataColumn("DepartmentId", typeof(long));
            table.Columns.Add(departmentId);

            var departmentCode = new DataColumn("DepartmentCode", typeof(string));
            table.Columns.Add(departmentCode);

            var description = new DataColumn("Description", typeof(string));
            table.Columns.Add(description);

            var countryId = new DataColumn("CountryId", typeof(long));
            table.Columns.Add(countryId);

            var profitCenterId = new DataColumn("ProfitCenterId", typeof(long));
            table.Columns.Add(profitCenterId);

            var altCode = new DataColumn("AltCode", typeof(string));
            table.Columns.Add(altCode);

            var addInformation1 = new DataColumn("AddInformation1", typeof(string));
            table.Columns.Add(addInformation1);

            var addInformation2 = new DataColumn("AddInformation2", typeof(string));
            table.Columns.Add(addInformation2);

            var addInformation3 = new DataColumn("AddInformation3", typeof(string));
            table.Columns.Add(addInformation3);

            var traxPortfolio = new DataColumn("TraxPortfolio", typeof(string));
            table.Columns.Add(traxPortfolio);

            var fOCode = new DataColumn("FOCode", typeof(string));
            table.Columns.Add(fOCode);

            var specDept = new DataColumn("SpecDept", typeof(string));
            table.Columns.Add(specDept);

            var isDeactivated = new DataColumn("IsDeactivated", typeof(bool));
            table.Columns.Add(isDeactivated);
            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();
                    row[departmentId] = value.DepartmentId;
                    row[departmentCode] = value.DepartmentCode;
                    row[description] = value.Description;
                    row[countryId] = value.CountryId;
                    row[profitCenterId] = value.ProfitCenterId;
                    row[altCode] = value.AltCode;
                    row[addInformation1] = value.AddInformation1;
                    row[addInformation2] = value.AddInformation2;
                    row[addInformation3] = value.AddInformation3;
                    row[traxPortfolio] = value.TraxPortfolio;
                    row[fOCode] = value.FOCode;
                    row[specDept] = value.SpecDept;
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
            foreach (string company in selectedCompanies)
            {
                var row = table.NewRow();
                row[name] = company;
                table.Rows.Add(row);
            }

            return table;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetDepartments = "[Masterdata].[usp_ListDepartments]";
            internal const string UpdateDepartments = "[Masterdata].[usp_UpdateDepartment]";
            internal const string DeleteDepartments = "[Masterdata].[usp_DeleteDepartments]";
        }
    }
}
