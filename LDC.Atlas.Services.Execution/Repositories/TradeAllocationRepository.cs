using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.Execution.Application.Commands;
using LDC.Atlas.Services.Execution.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Repositories
{
    public class TradeAllocationRepository : BaseRepository, ITradeAllocationRepository
    {
        public TradeAllocationRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                    typeof(SectionToAllocate),
                    new ColumnAttributeTypeMapper<SectionToAllocate>());
        }

        public Task<SectionToAllocate> GetSectionToAllocateByIdAsync(long sectionId, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@SectionId", sectionId);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add(DataVersionIdParameter, (object)DBNull.Value);

            return ExecuteQueryFirstOrDefaultAsync<SectionToAllocate>(StoredProcedureNames.GetSectionExecution, queryParameters);
        }

        public async Task<long> AllocateAsync(AllocationOperation allocationOperation)
        {
            var allocationOperationList = new List<AllocationOperation>();
            allocationOperationList.Add(allocationOperation);
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId ", allocationOperation.Company);
            queryParameters.Add(DataVersionIdParameter, allocationOperation.DataVersionId);
            queryParameters.Add("@TransferShipping", (int)allocationOperation.ShippingType);
            queryParameters.Add("@AllocationSourceType", (int)allocationOperation.allocationSourceType);
            queryParameters.Add("@AllocationTargetType", (int)allocationOperation.allocationTargetType);
            queryParameters.Add("@Section", ToArrayTVP(allocationOperationList));
            //queryParameters.Add("@ContractInvoiceTypeId", allocationOperation.ContractInvoiceTypeId);
            var groupNumber = await ExecuteQueryFirstOrDefaultAsync<long>(StoredProcedureNames.AllocateSections, queryParameters, true);
            return groupNumber;
        }

        public async Task<long> AllocateSectionListAsync(IEnumerable<AllocationOperation> sections, string company, long? dataVersionId)
        {
            AllocationOperation firstSection = sections.First<AllocationOperation>();
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@TransferShipping", firstSection.ShippingType);
            queryParameters.Add("@AllocationSourceType", (int)firstSection.allocationSourceType);
            queryParameters.Add("@AllocationTargetType", (int)firstSection.allocationTargetType);
            queryParameters.Add("@Section", ToArrayTVP(sections));
            queryParameters.Add(DataVersionIdParameter, dataVersionId);

            var result = await ExecuteNonQueryAsync(StoredProcedureNames.AllocateSections, queryParameters, true);
            return result;
        }

        public async Task<long> AllocateImageSectionListAsync(IEnumerable<AllocationOperation> allocationOperations, string company, long? dataVersionId)
        {
            List<long> groupNumbers = new List<long>();

            foreach (var allocationOperation in allocationOperations)
            {
                allocationOperation.Company = company;
                var allocationOperationList = new List<AllocationOperation>();
                allocationOperationList.Add(allocationOperation);
                var queryParameters = new DynamicParameters();
                queryParameters.Add("@CompanyId", allocationOperation.Company);
                queryParameters.Add(DataVersionIdParameter, allocationOperation.DataVersionId);
                queryParameters.Add("@TransferShipping", (int)allocationOperation.ShippingType);
                queryParameters.Add("@AllocationSourceType", (int)allocationOperation.allocationSourceType);
                queryParameters.Add("@AllocationTargetType", (int)allocationOperation.allocationTargetType);
                queryParameters.Add("@Section", ToArrayTVP(allocationOperationList));
                var groupNumber = await ExecuteQueryFirstOrDefaultAsync<long>(StoredProcedureNames.AllocateSections, queryParameters, true);
                groupNumbers.Add(groupNumber);
            }

            return groupNumbers[0];
        }

        private DataTable ToArrayTVP(IEnumerable<AllocationOperation> allocationOperationDetails)
        {
            var table = new DataTable();
            table.SetTypeName("[Logistic].[UDTT_Section]");

            var sectionId = new DataColumn("[SectionId]", typeof(long));
            table.Columns.Add(sectionId);

            var dataVersionId = new DataColumn("DataVersionId", typeof(int));
            table.Columns.Add(dataVersionId);

            var allocatedSectionId = new DataColumn("[AllocatedSectionId]", typeof(long));
            table.Columns.Add(allocatedSectionId);

            var allocatedQuantity = new DataColumn("[AllocatedQuantity]", typeof(decimal));
            table.Columns.Add(allocatedQuantity);

            var contractInvoiceTypeId = new DataColumn("[ContractInvoiceTypeId]", typeof(int));
            table.Columns.Add(contractInvoiceTypeId);

            if (allocationOperationDetails != null)
            {
                foreach (AllocationOperation allocatedOperation in allocationOperationDetails)
                {
                    var row = table.NewRow();
                    row[sectionId] = allocatedOperation.SectionId;
                    row[allocatedSectionId] = allocatedOperation.AllocatedSectionId;
                    row[allocatedQuantity] = allocatedOperation.Quantity;
                    row[contractInvoiceTypeId] = allocatedOperation.ContractInvoiceTypeId == 0  ? (object)DBNull.Value : allocatedOperation.ContractInvoiceTypeId;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        public async Task<int> DeallocateAsync(long sectionId, bool reInstateTrafficDetails, string company, long? dataVersionId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@SectionId", sectionId);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@ReInstateTrafficDetails", reInstateTrafficDetails);
            queryParameters.Add(DataVersionIdParameter, dataVersionId);

            return await ExecuteNonQueryAsync(StoredProcedureNames.DeallocateSections, queryParameters, true);
        }

        public async Task<int> BulkDeallocateAsync(BulkDeallocateSectionCommand command)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", command.Company);
            queryParameters.Add("@AllocationDetails", ToBulkArrayTVP(command.DeallocateBulkSections));
            queryParameters.Add(DataVersionIdParameter, command.DataVersionId);

            return await ExecuteNonQueryAsync(StoredProcedureNames.DeallocateBulkSections, queryParameters, true);
        }

        private DataTable ToBulkArrayTVP(IEnumerable<DeallocateBulkSections> deallocateBulkSections)
        {
            var table = new DataTable();
            table.SetTypeName("[Logistic].[UDTT_BulkDeallocation]");

            var sectionId = new DataColumn("[SectionId]", typeof(long));
            table.Columns.Add(sectionId);

            var reInstateTrafficDetails = new DataColumn("[ReInstateTrafficDetails]", typeof(bool));
            table.Columns.Add(reInstateTrafficDetails);

            if (deallocateBulkSections != null)
            {
                foreach (DeallocateBulkSections sections in deallocateBulkSections)
                {
                    var row = table.NewRow();
                    row[sectionId] = sections.SectionId;
                    row[reInstateTrafficDetails] = sections.ReInstateTrafficDetails;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetSectionExecution = "[Trading].[usp_GetSectionExecution]";
            internal const string AllocateSections = "[Logistic].[usp_CreateTradeAllocation]";
            internal const string DeallocateSections = "[Logistic].[usp_DeleteTradeAllocation]";
            internal const string DeallocateBulkSections = "[Logistic].[usp_DeleteBulkTradeAllocation]";
        }
    }
}
