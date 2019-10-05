using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Trading.Application.Queries.Dto;
using LDC.Atlas.Services.Trading.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Repositories
{
    public class SectionMergeRepository : BaseRepository, ISectionMergeRepository
    {
        public SectionMergeRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
        }

        /// <summary>
        /// For creating trade merge
        /// </summary>
        /// <param name="mergeContracts">list of contracts to be merged</param>
        /// <param name="costDetailsForMerge">list of costs to be updated after merge</param>
        /// <param name="company">company code</param>
        /// <param name="dataVersionId">data version Id</param>
        /// <returns>the list of section ids modified</returns>
        public async Task<IEnumerable<long>> MergeSectionAsync(IEnumerable<MergeContracts> mergeContracts, IEnumerable<CostDto> costDetailsForMerge, string company, int? dataVersionId = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@MergedFromSection", ConvertToBigIntListUDTT(GetMergedFromSectionIds(mergeContracts)));
            queryParameters.Add("@MergedToSection", ConvertToMergedToSectionUDTT(mergeContracts));
            queryParameters.Add("@Cost", ConvertToCostUDTT(costDetailsForMerge));
            queryParameters.Add("@MappingSections", ConvertToUDTTForTradeMergeForReversalInvoice(mergeContracts, GetMergedFromSectionIds(mergeContracts)));
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add(DataVersionIdParameter, dataVersionId);

            var mergedSection = await ExecuteQueryAsync<long>(StoredProcedureNames.CreateTradeMerge, queryParameters, true);
            return mergedSection;
        }

        private static DataTable ConvertToUDTTForTradeMergeForReversalInvoice(IEnumerable<MergeContracts> mergeContracts, IEnumerable<long> mergeFromSectionIds)
        {
            var udtt = new DataTable();
            udtt.SetTypeName("[dbo].[UDTT_bigIntCoupleList]");

            var mergeToSectionId = new DataColumn("Value1", typeof(long));
            udtt.Columns.Add(mergeToSectionId);

            var mergeFromSectionId = new DataColumn("Value2", typeof(long));
            udtt.Columns.Add(mergeFromSectionId);

            foreach (var contracts in mergeContracts)
            {
                foreach (var sectionId in mergeFromSectionIds)
                {
                    var row = udtt.NewRow();

                    row[mergeToSectionId] = contracts.MergeToSectionId;
                    row[mergeFromSectionId] = sectionId;
                    udtt.Rows.Add(row);
                }
            }

            return udtt;
        }

        private static DataTable ConvertToMergedToSectionUDTT(IEnumerable<MergeContracts> mergeContracts)
        {
            DataTable table = new DataTable();
            table.SetTypeName("[Trading].[UDTT_MergedToSection]");

            DataColumn mergedToSectionId = new DataColumn("[MergedToSectionId]", typeof(long));
            table.Columns.Add(mergedToSectionId);
            DataColumn quantity = new DataColumn("[Quantity]", typeof(decimal));
            table.Columns.Add(quantity);
            DataColumn contractedValue = new DataColumn("[ContractedValue]", typeof(long));
            table.Columns.Add(contractedValue);
            if (mergeContracts.Any())
            {
                mergeContracts.ToList().ForEach(contract =>
                {
                    var row = table.NewRow();
                    row[mergedToSectionId] = contract.MergeToSectionId;
                    row[quantity] = contract.Quantity;
                    row[contractedValue] = contract.ContractedValue;
                    table.Rows.Add(row);
                });
            }

            return table;
        }

        private static DataTable ConvertToCostUDTT(IEnumerable<CostDto> costs)
        {
            var udtt = new DataTable();
            udtt.SetTypeName("[Trading].[UDTT_CostMerge]");

            var costId = new DataColumn("CostId", typeof(long));
            udtt.Columns.Add(costId);

            var rate = new DataColumn("Rate", typeof(decimal));
            udtt.Columns.Add(rate);

            var isDeleted = new DataColumn("IsDeleted", typeof(bool));
            udtt.Columns.Add(isDeleted);

            var mergeToSectionId = new DataColumn("MergeToSectionId", typeof(long));
            udtt.Columns.Add(mergeToSectionId);

            var isNewCost = new DataColumn("IsNewCost", typeof(bool));
            udtt.Columns.Add(isNewCost);

            if (costs != null)
            {
                foreach (var cost in costs)
                {
                    if (cost != null)
                    {
                        var row = udtt.NewRow();

                        row[costId] = cost.CostId;
                        row[rate] = cost.Rate;
                        row[isDeleted] = cost.IsDeleted;
                        row[mergeToSectionId] = cost.SectionId;
                        row[isNewCost] = cost.IsNewCost;
                        udtt.Rows.Add(row);
                    }
                }
            }

            return udtt;
        }

        private static IEnumerable<long> GetMergedFromSectionIds(IEnumerable<MergeContracts> mergeContracts)
        {
            List<long> sectionIds = new List<long>();
            foreach (MergeContracts contracts in mergeContracts)
            {
                sectionIds.AddRange(contracts.MergeFromSectionIds);
            }

            return sectionIds.ToList();
        }

        private static class StoredProcedureNames
        {
            internal const string CreateTradeMerge = "[Trading].[usp_CreateTradeMerge]";
        }
    }
}
