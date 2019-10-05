using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.Execution.Application.Queries.Dto;
using LDC.Atlas.Services.Execution.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Application.Queries
{
    public class TradeAllocationQueries : BaseRepository, ITradeAllocationQueries
    {
        public TradeAllocationQueries(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                    typeof(SectionToAllocate),
                    new ColumnAttributeTypeMapper<SectionToAllocate>());
            SqlMapper.SetTypeMap(
                   typeof(AllocationSummaryDto),
                   new ColumnAttributeTypeMapper<AllocationSummaryDto>());
        }

        public async Task<IEnumerable<SectionToAllocate>> FindContractToAllocateByContractReferenceAsync(long originalsectionId, string contractLabelKeyword, int pricingMethod, string company)
        {
            var originalContract = await GetSectionToAllocateByIdAsync(originalsectionId, company);

            var contractToAllocateType = ContractType.Sale;
            if (originalContract.Type == ContractType.Sale)
            {
                contractToAllocateType = ContractType.Purchase;
            }

            if (string.IsNullOrEmpty(contractLabelKeyword))
            {
                throw new ArgumentNullException(nameof(contractLabelKeyword));
            }

            var queryParameters = new DynamicParameters();
            queryParameters.Add("@ContractLabel", contractLabelKeyword);
            queryParameters.Add("@Type", contractToAllocateType);
            queryParameters.Add("@Quantity", originalContract.Quantity);
            queryParameters.Add("@CommodityId", originalContract.CommodityId);
            queryParameters.Add("@PricingMethod", pricingMethod);
            queryParameters.Add("@CompanyId", company);

            var trades = await ExecuteQueryAsync<SectionToAllocate>(StoredProcedureNames.FindTradeSectionToAllocateByContractLabel, queryParameters);

            return trades;
        }

        public async Task<AllocationInfoDto> GetAllocationInfoAsync(long sectionId, string company, long? dataVersionId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@SectionId", sectionId);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add(DataVersionIdParameter, dataVersionId);

            AllocationInfoDto allocation = await ExecuteQueryFirstOrDefaultAsync<AllocationInfoDto>(StoredProcedureNames.GetTradeAllocationDetails, queryParameters, true);
            return allocation;
        }

        private Task<SectionToAllocate> GetSectionToAllocateByIdAsync(long sectionId, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@SectionId", sectionId);
            queryParameters.Add("@CompanyId", company);

            return ExecuteQueryFirstOrDefaultAsync<SectionToAllocate>(StoredProcedureNames.GetSectionExecution, queryParameters);
        }

        public async Task<SectionTrafficDto> GetSectionTrafficBySectionIdAsync(long sectionId, string company, long? dataVersionId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@SectionId", sectionId);
            queryParameters.Add("@CompanyID", company);
            queryParameters.Add(DataVersionIdParameter, dataVersionId);

            SectionTrafficDto sectionTraffic;

            sectionTraffic = await ExecuteQueryFirstOrDefaultAsync<SectionTrafficDto>(StoredProcedureNames.GetSectionTrafficDetails, queryParameters, true);

            return sectionTraffic;
        }

        public async Task<IEnumerable<AllocationMessageDto>> GetAllocationMessages(long sectionId, long allocatedSectionId, string companyId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add("@SectionDetails", ToSingleTvp(sectionId, allocatedSectionId));

            var allocationMessages = await ExecuteQueryAsync<AllocationMessageDto>(StoredProcedureNames.ValidateTradeAllocation, queryParameters);
            return allocationMessages;
        }

        public async Task<IEnumerable<AllocationSummaryDto>> GetPossibleAllocationByCharterAsync(long charterId, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@CharterID", charterId);
            queryParameters.Add("@companyId", company);

            var sections = await ExecuteQueryAsync<AllocationSummaryDto>(StoredProcedureNames.GetContractsForTradeAllocationByCharter, queryParameters, true);

            return sections.ToList();
        }

        public async Task<IEnumerable<AllocationSummaryDto>> GetPossibleDeallocationByCharterAsync(long charterId, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add(DataVersionIdParameter, null);
            queryParameters.Add("@companyId", company);
            queryParameters.Add("@CharterID", charterId);

            var sections = await ExecuteQueryAsync<AllocationSummaryDto>(StoredProcedureNames.GetContractsForDeAllocatedByCharter, queryParameters, true);

            return sections.ToList();
        }

        private static DataTable ToSingleTvp(long sectionId, long allocatedSectionId)
        {
            var table = new DataTable();
            table.SetTypeName("[Logistic].[UDTT_Section]");

            var sectionid = new DataColumn("SectionId", typeof(long));
            table.Columns.Add(sectionid);

            var dataVersionId = new DataColumn("DataVersionId", typeof(int));
            table.Columns.Add(dataVersionId);

            var allocatedSectionid = new DataColumn("AllocatedSectionId", typeof(long));
            table.Columns.Add(allocatedSectionid);

            var allocatedQuantity = new DataColumn("AllocatedQuantity", typeof(double));
            table.Columns.Add(allocatedQuantity);

            var contractInvoiceTypeId = new DataColumn("[ContractInvoiceTypeId]", typeof(int));
            table.Columns.Add(contractInvoiceTypeId);

            var row = table.NewRow();
            row[sectionid] = sectionId;
            row[allocatedSectionid] = allocatedSectionId;
            table.Rows.Add(row);

            return table;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetSectionExecution = "[Trading].[usp_GetSectionExecution]";
            internal const string FindTradeSectionToAllocateByContractLabel = "[Trading].[usp_GetPhysicalSectionToAllocateByContractLabel]";
            internal const string GetTradeAllocationDetails = "[Logistic].[usp_getTradeAllocationDetails]";
            internal const string GetSectionTrafficDetails = "[Logistic].[usp_GetSectionTraffic]";
            internal const string ValidateTradeAllocation = "[Logistic].[usp_ValidateTradeAllocation]";
            internal const string GetContractsForTradeAllocationByCharter = "[Logistic].[usp_getContractsForTradeAllocationByCharter]";
            internal const string GetContractsForDeAllocatedByCharter = "[Logistic].[usp_getContractsForDeAllocatedByCharter]";
        }
    }
}
