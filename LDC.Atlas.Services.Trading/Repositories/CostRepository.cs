using Dapper;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.Trading.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Repositories
{
    public class CostRepository : BaseRepository, ICostRepository
    {
        private readonly ISystemDateTimeService _systemDateTimeService;

        public CostRepository(IDapperContext dapperContext, ISystemDateTimeService systemDateTimeService)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(Cost),
                       new ColumnAttributeTypeMapper<Cost>());
            _systemDateTimeService = systemDateTimeService ?? throw new ArgumentNullException(nameof(systemDateTimeService));
        }

        public async Task<IEnumerable<Cost>> AddCostsAsync(IEnumerable<Cost> costs, string company, long? dataVersionId)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@Cost", ConvertToCostUDTT(costs));
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add(DataVersionIdParameter, dataVersionId);

            return await ExecuteQueryAsync<Cost>(StoredProcedureNames.CreateCost, queryParameters, true);
        }

        public async Task<IEnumerable<Cost>> AddUpdateCostsAsync(IEnumerable<Cost> costs, string company, long? dataVersionId)
        {
            DynamicParameters queryParameters = new DynamicParameters();

            queryParameters.Add("@Cost", ConvertToCostUDTT(costs));
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add(DataVersionIdParameter, dataVersionId);

            var sec = await ExecuteQueryAsync<Cost>(StoredProcedureNames.UpdateCosts, queryParameters, true);
            return sec;
        }

        public async Task DeleteCostsAsync(string company, long sectionId, IEnumerable<long> costIds, long? dataVersionId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@companyId", company);
            queryParameters.Add("@SectionId", sectionId);
            queryParameters.Add("@CostLines", ConvertToCostLineUDTT(costIds));
            queryParameters.Add(DataVersionIdParameter, dataVersionId);

            await ExecuteNonQueryAsync(StoredProcedureNames.DeleteCost, queryParameters, true);
        }

        public async Task UpdateCostAsync(Cost cost, string company)
        {
            DynamicParameters queryParameters = new DynamicParameters();

            queryParameters.Add("@CostId", cost.CostId);
            queryParameters.Add("@SectionId", cost.SectionId);
            queryParameters.Add("@CostTypeCode", cost.CostTypeCode);
            queryParameters.Add("@SupplierCode", cost.SupplierCode);
            queryParameters.Add("@CostDirection", cost.CostDirectionId);
            queryParameters.Add("@CurrencyCode", cost.CurrencyCode);
            queryParameters.Add("@RateType", cost.RateTypeId);
            queryParameters.Add("@PriceUnitId", cost.PriceUnitId);
            queryParameters.Add("@Rate", cost.Rate);
            queryParameters.Add("@InPL", cost.InPL);
            queryParameters.Add("@NoAction", cost.NoAction);
            queryParameters.Add("@Narrative", cost.Narrative);
            queryParameters.Add("@CostMatrixLineId", cost.CostMatrixLineId);
            queryParameters.Add("@OriginalEstPMT", cost.OriginalEstimatedPMTValue);
            queryParameters.Add("@OrigEstRateTypeId", cost.OriginalEstRateTypeId);
            queryParameters.Add("@OrigEstPriceUnitId", cost.OriginalEstPriceUnitId);
            queryParameters.Add("@OrigEstCurrencyCode", cost.OriginalEstCurrencyCode);
            queryParameters.Add("@OrigEstRate", cost.OriginalEstRate);
            queryParameters.Add("@CompanyId", cost.CompanyId);
            queryParameters.Add("@InvoicePercent", ConvertToInvoicePercentUDTT(cost.CostInvoiceMarkingLines));
            queryParameters.Add(DataVersionIdParameter, cost.DataVersionId);

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateCost, queryParameters, true);
        }

        private static DataTable ConvertToInvoicePercentUDTT(IEnumerable<InvoiceMarkingCostLines> invoiceCostMarkingLines)
        {

            DataTable udtt = new DataTable();
            udtt.SetTypeName("[Trading].[UDTT_InvoicePercent]");
            DataColumn invoiceLineId = new DataColumn("[InvoiceLineId]", typeof(long));
            udtt.Columns.Add(invoiceLineId);
            DataColumn invoicePercent = new DataColumn("[InvoicePercent]", typeof(decimal));
            udtt.Columns.Add(invoicePercent);

            if (invoiceCostMarkingLines != null)
            {
                foreach (var costMarkingInvoice in invoiceCostMarkingLines)
                {
                    var row = udtt.NewRow();
                    row[invoiceLineId] = costMarkingInvoice.InvoiceLineId;
                    row[invoicePercent] = costMarkingInvoice.InvoicePercent;
                    udtt.Rows.Add(row);
                }
            }

            return udtt;
        }       

        public async Task<IEnumerable<Cost>> LoadSectionCostsAsync(long sectionId, string company, long? dataVersionId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@sectionId", sectionId);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add(DataVersionIdParameter, dataVersionId);

            var sec = await ExecuteQueryAsync<Cost>(StoredProcedureNames.LoadSectionCosts, queryParameters, true);
            return sec;
        }

        public async Task<IEnumerable<CostBulkEdit>> AddBulkCostsAsync(IEnumerable<CostBulkEdit> costs, string company, long? dataVersionId)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@Cost", ConvertToCostUDTTForBulkCosts(costs, company));
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add(DataVersionIdParameter, dataVersionId);
            var newCosts = await ExecuteQueryAsync<CostBulkEdit>(StoredProcedureNames.CreateCost, queryParameters, true);
            return newCosts;
        }

        public async Task<IEnumerable<CostBulkEdit>> UpdateBulkCostsAsync(IEnumerable<CostBulkEdit> costs,IEnumerable<InvoiceMarkingCostLines> costInvoiceLinesToUpdate, string company, long? dataVersionId)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@Cost", ConvertToCostUDTTForBulkCosts(costs, company));
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@InvoicePercent", ConvertToInvoicePercentUDTT(costInvoiceLinesToUpdate));
            queryParameters.Add(DataVersionIdParameter, dataVersionId);

            var sec = await ExecuteQueryAsync<CostBulkEdit>(StoredProcedureNames.UpdateCosts, queryParameters, true);
            return sec;
        }

        private static DataTable ConvertToCostUDTT(IEnumerable<Cost> costs)
        {
            var udtt = new DataTable();
            udtt.SetTypeName("[Trading].[UDTT_Cost]");

            var costId = new DataColumn("CostId", typeof(long));
            udtt.Columns.Add(costId);

            var sectionId = new DataColumn("SectionId", typeof(long));
            udtt.Columns.Add(sectionId);

            var costTypeCode = new DataColumn("CostTypeCode", typeof(string));
            udtt.Columns.Add(costTypeCode);

            var description = new DataColumn("Description", typeof(string));
            udtt.Columns.Add(description);

            var supplierCode = new DataColumn("SupplierCode", typeof(string));
            udtt.Columns.Add(supplierCode);

            var costDirectionId = new DataColumn("CostDirectionId", typeof(int));
            udtt.Columns.Add(costDirectionId);

            var currencyCode = new DataColumn("CurrencyCode", typeof(string));
            udtt.Columns.Add(currencyCode);

            var rateTypeId = new DataColumn("RateTypeId", typeof(int));
            udtt.Columns.Add(rateTypeId);

            var priceUnitId = new DataColumn("PriceUnitId", typeof(long));
            udtt.Columns.Add(priceUnitId);

            var rate = new DataColumn("Rate", typeof(decimal));
            udtt.Columns.Add(rate);

            var inPL = new DataColumn("InPL", typeof(bool));
            udtt.Columns.Add(inPL);

            var noAction = new DataColumn("NoAction", typeof(bool));
            udtt.Columns.Add(noAction);

            var invoiceStatus = new DataColumn("InvoiceStatus", typeof(short));
            udtt.Columns.Add(invoiceStatus);

            var narrative = new DataColumn("Narrative", typeof(string));
            udtt.Columns.Add(narrative);

            var costMatrixLineId = new DataColumn("CostMatrixLineId", typeof(long));
            udtt.Columns.Add(costMatrixLineId);

            var costMatrixName = new DataColumn("CostMatrixName", typeof(string));
            udtt.Columns.Add(costMatrixName);

            var origEstPMT = new DataColumn("OrigEstPMT", typeof(decimal));
            udtt.Columns.Add(origEstPMT);

            var origEstRateTypeId = new DataColumn("OrigEstRateTypeId", typeof(int));
            udtt.Columns.Add(origEstRateTypeId);

            var origEstPriceUnitId = new DataColumn("OrigEstPriceUnitId", typeof(long));
            udtt.Columns.Add(origEstPriceUnitId);

            var origEstCurrencyCode = new DataColumn("OrigEstCurrencyCode", typeof(string));
            udtt.Columns.Add(origEstCurrencyCode);

            var origEstRate = new DataColumn("OrigEstRate", typeof(decimal));
            udtt.Columns.Add(origEstRate);

            var companyId = new DataColumn("CompanyId", typeof(string));
            udtt.Columns.Add(companyId);

            DataColumn isDraft = new DataColumn("IsDraft", typeof(bool));
            udtt.Columns.Add(isDraft);

            var createdDateTime = new DataColumn("CreatedDateTime", typeof(DateTime));
            udtt.Columns.Add(createdDateTime);
            var createdBy = new DataColumn("CreatedBy", typeof(string));
            udtt.Columns.Add(createdBy);

            var modifiedDateTime = new DataColumn("ModifiedDateTime", typeof(DateTime));
            udtt.Columns.Add(modifiedDateTime);

            var modifiedBy = new DataColumn("ModifiedBy", typeof(string));
            udtt.Columns.Add(modifiedBy);

            foreach (var cost in costs)
            {
                var row = udtt.NewRow();

                row[costId] = cost.CostId;
                row[sectionId] = cost.SectionId;
                row[costTypeCode] = cost.CostTypeCode;
                row[description] = cost.Description;
                row[supplierCode] = cost.SupplierCode;
                row[costDirectionId] = cost.CostDirectionId;
                row[currencyCode] = cost.CurrencyCode;
                row[rateTypeId] = cost.RateTypeId;
                row[priceUnitId] = cost.PriceUnitId == null ? (object)DBNull.Value : cost.PriceUnitId;
                row[rate] = cost.Rate;
                row[inPL] = cost.InPL;
                row[noAction] = cost.NoAction;
                row[invoiceStatus] = cost.InvoiceStatus;
                row[narrative] = cost.Narrative;
                row[costMatrixLineId] = cost.CostMatrixLineId;
                row[costMatrixName] = cost.CostMatrixName;
                row[origEstPMT] = cost.OriginalEstimatedPMTValue == null ? (object)DBNull.Value : cost.OriginalEstimatedPMTValue;
                row[origEstRateTypeId] = cost.OriginalEstRateTypeId == null ? (object)DBNull.Value : cost.OriginalEstRateTypeId;
                row[origEstPriceUnitId] = cost.OriginalEstPriceUnitId == null ? (object)DBNull.Value : cost.OriginalEstPriceUnitId;
                if (cost.OriginalEstCurrencyCode != null)
                {
                    row[origEstCurrencyCode] = cost.OriginalEstCurrencyCode.Length == 0 ? (object)DBNull.Value : cost.OriginalEstCurrencyCode;
                }
                else
                {
                    row[origEstCurrencyCode] = cost.OriginalEstCurrencyCode;
                }

                row[origEstRate] = cost.OriginalEstRate == null ? (object)DBNull.Value : cost.OriginalEstRate;
                row[companyId] = cost.CompanyId;
                udtt.Rows.Add(row);
            }

            return udtt;
        }

        private static DataTable ConvertToCostUDTTForBulkCosts(IEnumerable<CostBulkEdit> costs, string company)
        {
            var udtt = new DataTable();
            udtt.SetTypeName("[Trading].[UDTT_Cost]");

            var costId = new DataColumn("CostId", typeof(long));
            udtt.Columns.Add(costId);

            var sectionId = new DataColumn("SectionId", typeof(long));
            udtt.Columns.Add(sectionId);

            var costTypeCode = new DataColumn("CostTypeCode", typeof(string));
            udtt.Columns.Add(costTypeCode);

            var description = new DataColumn("Description", typeof(string));
            udtt.Columns.Add(description);

            var supplierCode = new DataColumn("SupplierCode", typeof(string));
            udtt.Columns.Add(supplierCode);

            var costDirectionId = new DataColumn("CostDirectionId", typeof(int));
            udtt.Columns.Add(costDirectionId);

            var currencyCode = new DataColumn("CurrencyCode", typeof(string));
            udtt.Columns.Add(currencyCode);

            var rateTypeId = new DataColumn("RateTypeId", typeof(int));
            udtt.Columns.Add(rateTypeId);

            var priceUnitId = new DataColumn("PriceUnitId", typeof(long));
            udtt.Columns.Add(priceUnitId);

            var rate = new DataColumn("Rate", typeof(decimal));
            udtt.Columns.Add(rate);

            var inPL = new DataColumn("InPL", typeof(bool));
            udtt.Columns.Add(inPL);

            var noAction = new DataColumn("NoAction", typeof(bool));
            udtt.Columns.Add(noAction);

            var invoiceStatus = new DataColumn("InvoiceStatus", typeof(short));
            udtt.Columns.Add(invoiceStatus);

            var narrative = new DataColumn("Narrative", typeof(string));
            udtt.Columns.Add(narrative);

            var costMatrixLineId = new DataColumn("CostMatrixLineId", typeof(long));
            udtt.Columns.Add(costMatrixLineId);

            var costMatrixName = new DataColumn("CostMatrixName", typeof(string));
            udtt.Columns.Add(costMatrixName);

            var origEstPMT = new DataColumn("OrigEstPMT", typeof(decimal));
            udtt.Columns.Add(origEstPMT);

            var origEstRateTypeId = new DataColumn("OrigEstRateTypeId", typeof(int));
            udtt.Columns.Add(origEstRateTypeId);

            var origEstPriceUnitId = new DataColumn("OrigEstPriceUnitId", typeof(long));
            udtt.Columns.Add(origEstPriceUnitId);

            var origEstCurrencyCode = new DataColumn("OrigEstCurrencyCode", typeof(string));
            udtt.Columns.Add(origEstCurrencyCode);

            var origEstRate = new DataColumn("OrigEstRate", typeof(decimal));
            udtt.Columns.Add(origEstRate);

            var companyId = new DataColumn("CompanyId", typeof(string));
            udtt.Columns.Add(companyId);

            DataColumn isDraft = new DataColumn("IsDraft", typeof(bool));
            udtt.Columns.Add(isDraft);

            var createdDateTime = new DataColumn("CreatedDateTime", typeof(DateTime));
            udtt.Columns.Add(createdDateTime);
            var createdBy = new DataColumn("CreatedBy", typeof(string));
            udtt.Columns.Add(createdBy);

            var modifiedDateTime = new DataColumn("ModifiedDateTime", typeof(DateTime));
            udtt.Columns.Add(modifiedDateTime);

            var modifiedBy = new DataColumn("ModifiedBy", typeof(string));
            udtt.Columns.Add(modifiedBy);

            foreach (var cost in costs)
            {
                var row = udtt.NewRow();

                row[costId] = cost.CostId;
                row[sectionId] = cost.SectionId;
                row[costTypeCode] = cost.CostTypeCode;
                row[description] = DBNull.Value;
                row[supplierCode] = cost.SupplierCode;
                row[costDirectionId] = cost.CostDirectionId;
                row[currencyCode] = cost.CurrencyCode;
                row[rateTypeId] = cost.RateTypeId;
                row[priceUnitId] = cost.PriceUnitId == null ? (object)DBNull.Value : cost.PriceUnitId;
                row[rate] = cost.Rate;
                row[inPL] = cost.InPL;
                row[noAction] = cost.NoAction;
                row[invoiceStatus] = cost.InvoicingStatusId;
                row[narrative] = DBNull.Value;
                row[costMatrixLineId] = DBNull.Value;
                row[costMatrixName] = cost.CostMatrixName;
                row[origEstPMT] = DBNull.Value;
                row[origEstRateTypeId] = DBNull.Value;
                row[origEstPriceUnitId] = DBNull.Value;
                row[origEstCurrencyCode] = DBNull.Value;
                row[origEstRate] = DBNull.Value;
                row[companyId] = company;
                row[isDraft] = DBNull.Value;
                udtt.Rows.Add(row);
            }

            return udtt;
        }

        private static DataTable ConvertToCostLineUDTT(IEnumerable<long> costIds)
        {
            var udtt = new DataTable();
            udtt.SetTypeName("[Trading].[UDTT_CostLines]");

            var costId = new DataColumn("CostId", typeof(long));
            udtt.Columns.Add(costId);

            foreach (var uninvoicedCostId in costIds)
            {
                var row = udtt.NewRow();

                row[costId] = uninvoicedCostId;
                udtt.Rows.Add(row);
            }

            return udtt;
        }

        public async Task CreateSplitCostAsync(string company, long sectionId, long costOriginId, Cost cost, decimal? invoiceMarkingAmount, long? dataVersionId)
        {
            DynamicParameters queryParameters = new DynamicParameters();

            queryParameters.Add("@SectionId", sectionId);
            queryParameters.Add("@Rate", cost.Rate);
            queryParameters.Add("@OrigEstPMT", cost.OriginalEstimatedPMTValue);
            queryParameters.Add("@OrigEstRate", cost.OriginalEstRate);
            queryParameters.Add("@CostOriginId", costOriginId);
            queryParameters.Add("@InvoiceMarkingAmount", invoiceMarkingAmount);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add(DataVersionIdParameter, cost.DataVersionId);

            await ExecuteNonQueryAsync(StoredProcedureNames.CreateSplitCost, queryParameters, true);
        }

        public async Task UpdateCostInvoicingStatusAsync(long costId, int invoicingStatusId, string companyCode, long? dataVersionId = null)
        {
            DynamicParameters queryParameters = new DynamicParameters();

            queryParameters.Add("@CostId", costId);
            queryParameters.Add("@InvoicingStatusId", invoicingStatusId);
            queryParameters.Add("@CompanyId", companyCode);
            queryParameters.Add(DataVersionIdParameter, dataVersionId);

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateCostInvoicingStatus, queryParameters, true);
        }

        public async Task<IEnumerable<long>> DeleteCostsForTradeCostBulkEditAsync(string company, IEnumerable<CostBulkEdit> costs, long? dataVersionId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@companyId", company);
            queryParameters.Add("@CostLines", ConvertToUDTTForTradeCostBulkDelete(costs));
            queryParameters.Add(DataVersionIdParameter, dataVersionId);

            var costsDeleted = await ExecuteQueryAsync<long>(StoredProcedureNames.DeleteCostsinBulk, queryParameters);
            return costsDeleted;
        }

        private static DataTable ConvertToUDTTForTradeCostBulkDelete(IEnumerable<CostBulkEdit> costs)
        {
            var udtt = new DataTable();
            udtt.SetTypeName("[dbo].[UDTT_bigIntCoupleList]");

            var costId = new DataColumn("Value1", typeof(long));
            udtt.Columns.Add(costId);

            var sectionId = new DataColumn("Value2", typeof(long));
            udtt.Columns.Add(sectionId);

            foreach (var cost in costs)
            {
                var row = udtt.NewRow();

                row[costId] = cost.CostId;
                row[sectionId] = cost.SectionId;
                udtt.Rows.Add(row);
            }

            return udtt;
        }

        private static class StoredProcedureNames
        {
            internal const string CreateCost = "[Trading].[usp_CreateCost]";
            internal const string UpdateCost = "[Trading].[usp_UpdateCost]";
            internal const string LoadSectionCosts = "[Trading].[usp_ListCostsBySectionId]";
            internal const string DeleteCost = "[Trading].[usp_DeleteCost]";
            internal const string UpdateCosts = "[Trading].[usp_UpdateCosts]";
            internal const string CreateSplitCost = "[Trading].[usp_CreateSplitCost]";
            internal const string UpdateCostInvoicingStatus = "[Trading].[usp_UpdateCostInvoicingStatus]";
            internal const string DeleteCostsinBulk = "[Trading].[usp_DeleteCostsinBulk]";
        }
    }
}
