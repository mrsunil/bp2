using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Trading.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Repositories
{
    public class CostMatrixRepository : BaseRepository, ICostMatrixRepository
    {
        public CostMatrixRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
        }

        public async Task<long> CreateCostMatrixAsync(CostMatrix costMatrix, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Name", costMatrix.Name);
            queryParameters.Add("@Description", costMatrix.Description);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@CostMatrixLines", ConvertToCostmatrixUDTT(costMatrix.CostMatrixLines));

            queryParameters.Add("@CostMatrixId", dbType: DbType.Int64, direction: ParameterDirection.Output);

            await ExecuteNonQueryAsync(StoredProcedureNames.CreateCostmatrix, queryParameters, true);

            var costMatrixId = queryParameters.Get<long>("@CostMatrixId");

            return costMatrixId;
        }

        public async Task UpdateCostMatrixAsync(CostMatrix costMatrix, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CostmatrixId", costMatrix.CostMatrixId);
            queryParameters.Add("@Description", costMatrix.Description);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@CostMatrixLines", ConvertToCostmatrixUDTT(costMatrix.CostMatrixLines));

            await ExecuteNonQueryAsync(
                       StoredProcedureNames.UpdateCostMatrix,
                       queryParameters,
                       true);
        }

        public async Task DeleteCostMatrixAsync(long costMatrixId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CostmatrixId", costMatrixId);

            await ExecuteNonQueryAsync(StoredProcedureNames.DeleteCostMatrix, queryParameters, true);
        }

        public async Task DeleteCostMatrixLineAsync(long costMatrixLineId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CostmatrixLineId", costMatrixLineId);

            await ExecuteNonQueryAsync(StoredProcedureNames.DeleteCostMatrixLine, queryParameters, true);
        }

        private static DataTable ConvertToCostmatrixUDTT(IEnumerable<CostMatrixLine> costmatrixLines)
        {
            DataTable udtt = new DataTable();
            udtt.SetTypeName("[Trading].[UDTT_CostMatrixLine]");

            DataColumn costMatrixId = new DataColumn("CostMatrixId", typeof(long));
            udtt.Columns.Add(costMatrixId);

            DataColumn costmatrixLineId = new DataColumn("CostMatrixLineId", typeof(long));
            udtt.Columns.Add(costmatrixLineId);

            DataColumn costTypeId = new DataColumn("CostTypeId", typeof(string));
            udtt.Columns.Add(costTypeId);

            DataColumn description = new DataColumn("Description", typeof(string));
            udtt.Columns.Add(description);

            DataColumn supplierId = new DataColumn("SupplierId", typeof(long));
            udtt.Columns.Add(supplierId);

            DataColumn payReceive = new DataColumn("PayReceive", typeof(int));
            udtt.Columns.Add(payReceive);

            DataColumn currencyCode = new DataColumn("CurrencyCode", typeof(string));
            udtt.Columns.Add(currencyCode);

            DataColumn rateType = new DataColumn("RateType", typeof(int));
            udtt.Columns.Add(rateType);

            DataColumn priceUnitId = new DataColumn("PriceUnitId", typeof(long));
            udtt.Columns.Add(priceUnitId);

            DataColumn rateAmount = new DataColumn("RateAmount", typeof(decimal));
            udtt.Columns.Add(rateAmount);

            DataColumn inPL = new DataColumn("InPL", typeof(bool));
            udtt.Columns.Add(inPL);

            DataColumn noAct = new DataColumn("NoAct", typeof(bool));
            udtt.Columns.Add(noAct);

            DataColumn narrative = new DataColumn("Narrative", typeof(string));
            udtt.Columns.Add(narrative);

            DataColumn companyId = new DataColumn("CompanyId", typeof(string));
            udtt.Columns.Add(companyId);

            DataColumn createdDateTime = new DataColumn("CreatedDateTime", typeof(DateTime));
            udtt.Columns.Add(createdDateTime);

            DataColumn createdBy = new DataColumn("CreatedBy", typeof(string));
            udtt.Columns.Add(createdBy);

            DataColumn modifiedDateTime = new DataColumn("ModifiedDateTime", typeof(DateTime));
            udtt.Columns.Add(modifiedDateTime);

            DataColumn modifiedBy = new DataColumn("ModifiedBy", typeof(string));
            udtt.Columns.Add(modifiedBy);

            DataColumn contextInformation = new DataColumn("ContextInformation", typeof(string));
            udtt.Columns.Add(contextInformation);

            DataColumn newFlag = new DataColumn("NewFlag", typeof(bool));
            udtt.Columns.Add(newFlag);

            foreach (var costmatrixLine in costmatrixLines)
            {
                var row = udtt.NewRow();

                row[costMatrixId] = costmatrixLine.CostMatrixId;
                row[costmatrixLineId] = costmatrixLine.CostMatrixLineId;
                row[costTypeId] = costmatrixLine.CostTypeId;
                row[description] = costmatrixLine.Description;
                row[supplierId] = costmatrixLine.SupplierId == null ? (object)DBNull.Value : costmatrixLine.SupplierId;
                row[payReceive] = costmatrixLine.PayReceive;
                row[currencyCode] = costmatrixLine.CurrencyCode;
                row[rateType] = costmatrixLine.RateType;
                row[priceUnitId] = costmatrixLine.PriceUnitId == null ? (object)DBNull.Value : costmatrixLine.PriceUnitId;
                row[rateAmount] = costmatrixLine.RateAmount;
                row[inPL] = costmatrixLine.InPL;
                row[noAct] = costmatrixLine.NoAct;
                row[newFlag] = costmatrixLine.CostMatrixLineId == 0 ? true : false;
                row[narrative] = costmatrixLine.Narrative;
                udtt.Rows.Add(row);
            }

            return udtt;
        }

        private static class StoredProcedureNames
        {
            internal const string CreateCostmatrix = "[Trading].[usp_CreateCostMatrix]";
            internal const string UpdateCostMatrix = "[Trading].[usp_UpdateCostMatrix]";
            internal const string DeleteCostMatrix = "[Trading].[usp_DeleteCostMatrix]";
            internal const string DeleteCostMatrixLine = "[Trading].[usp_DeleteCostMatrixLine]";
        }
    }
}
