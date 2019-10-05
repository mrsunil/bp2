using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Data;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public class CostTypesRepository : BaseRepository, ICostTypesRepository
    {
        public CostTypesRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(CostType),
                       new ColumnAttributeTypeMapper<CostType>());
        }

        public async Task<IEnumerable<CostType>> GetAllAsync(string company, bool includeDeactivated = false, string costTypeCode = null, string name = null)
        {
            var queryParameters = new DynamicParameters();

            queryParameters.Add("@Company", company);
            queryParameters.Add("@IncludeDeactivated", includeDeactivated);
            queryParameters.Add("@CostTypeCode", costTypeCode);
            queryParameters.Add("@Name", name);

            var costTypes = await ExecuteQueryAsync<CostType>(
                StoredProcedureNames.GetCostTypes,
                queryParameters);

            return costTypes;
        }

        public async Task UpdateCostTypes(ICollection<CostType> listCostType)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@iCostType", ToCostTypeTvp(listCostType));

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateCostType, queryParameters, true);
        }

        private DataTable ToCostTypeTvp(ICollection<CostType> values)
        {
            var table = new DataTable();
            table.SetTypeName("[MasterData].[UDTT_CostType]");

            var costTypeId = new DataColumn("CostTypeId", typeof(long));
            table.Columns.Add(costTypeId);

            var costTypeCode = new DataColumn("CostTypeCode", typeof(string));
            table.Columns.Add(costTypeCode);

            var name = new DataColumn("Name", typeof(string));
            table.Columns.Add(name);

            var isATradeCost = new DataColumn("IsATradeCost", typeof(bool));
            table.Columns.Add(isATradeCost);

            var isACashCost = new DataColumn("IsACashCost", typeof(bool));
            table.Columns.Add(isACashCost);

            var isACommission = new DataColumn("IsACommission", typeof(bool));
            table.Columns.Add(isACommission);

            var nominalAccountId = new DataColumn("NominalAccountId", typeof(long));
            table.Columns.Add(nominalAccountId);

            var otherAcc = new DataColumn("OtherAcc", typeof(string));
            table.Columns.Add(otherAcc);

            var otherAccUse = new DataColumn("OtherAccUse", typeof(string));
            table.Columns.Add(otherAccUse);

            var altCode = new DataColumn("AltCode", typeof(string));
            table.Columns.Add(altCode);

            var clientControl = new DataColumn("ClientControl", typeof(string));
            table.Columns.Add(clientControl);

            var freight = new DataColumn("Freight", typeof(bool));
            table.Columns.Add(freight);

            var insurance = new DataColumn("Insurance", typeof(bool));
            table.Columns.Add(insurance);

            var noAction = new DataColumn("NoAction", typeof(bool));
            table.Columns.Add(noAction);

            var inPL = new DataColumn("InPL", typeof(bool));
            table.Columns.Add(inPL);

            var inStock = new DataColumn("InStock", typeof(bool));
            table.Columns.Add(inStock);

            var accrue = new DataColumn("Accrue", typeof(string));
            table.Columns.Add(accrue);

            var backOff = new DataColumn("BackOff", typeof(bool));
            table.Columns.Add(backOff);

            var interfaceCode = new DataColumn("InterfaceCode", typeof(string));
            table.Columns.Add(interfaceCode);

            var sectionCode = new DataColumn("SectionCode", typeof(string));
            table.Columns.Add(sectionCode);

            var objectCode = new DataColumn("ObjectCode", typeof(string));
            table.Columns.Add(objectCode);

            var isDeactivated = new DataColumn("IsDeactivated", typeof(bool));
            table.Columns.Add(isDeactivated);

            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();
                    row[costTypeId] = value.CostTypeId;
                    row[costTypeCode] = value.CostTypeCode;
                    row[name] = value.Name;
                    row[isATradeCost] = value.IsATradeCost;
                    row[isACashCost] = value.IsATradeCost;
                    row[isACommission] = value.IsACommission;
                    row[nominalAccountId] = value.NominalAccountId;
                    row[otherAcc] = value.OtherAcc;
                    row[otherAccUse] = value.OtherAccUse;
                    row[altCode] = value.AltCode;
                    row[clientControl] = value.ClientControl;
                    row[freight] = value.Freight;
                    row[insurance] = value.Insurance;
                    row[noAction] = value.NoAction;
                    row[inPL] = value.InPNL;
                    row[inStock] = value.InStock;
                    row[accrue] = value.Accrue;
                    row[backOff] = value.BackOff;
                    row[interfaceCode] = value.InterfaceCode;
                    row[sectionCode] = value.SectionCode;
                    row[objectCode] = value.ObjectCode;
                    row[isDeactivated] = value.IsDeactivated;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetCostTypes = "[Masterdata].[usp_ListCostTypes]";
            internal const string UpdateCostType = "[MasterData].[usp_UpdateCostType]";
        }
    }
}
