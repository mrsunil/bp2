using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Trading.Application.Queries.Dto;
using LDC.Atlas.Services.Trading.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Queries
{
    public class SectionMergeQueries : BaseRepository, ISectionMergeQueries
    {
        public SectionMergeQueries(IDapperContext dapperContext)
            : base(dapperContext)
        {
        }

        public async Task<MergeAllowedForContractsDto> GetContextualDataForContractMergeAsync(string company, long sectionId, int? dataVersionId = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@sectionId", sectionId);
            queryParameters.Add(DataVersionIdParameter, dataVersionId);
            queryParameters.Add("@CompanyId", company);
            var mergeAllowedForContracts = new MergeAllowedForContractsDto();
            MergeDetailDto mergeDetails;
            using (var contextualData = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetContextualDataForContractMerge, queryParameters,true))
            {
                if (contextualData != null)
                {
                    mergeDetails = (await contextualData.ReadAsync<MergeDetailDto>()).FirstOrDefault();
                    if (mergeDetails != null)
                    {
                        // setting the  default value as true since merge to enabled/disabled
                        // based on the number of splits/invoiced/allocation/costs
                        mergeAllowedForContracts.IsAllowed = true;

                        if (!mergeDetails.HasChild)
                        {
                            mergeAllowedForContracts.IsAllowed = false;
                            mergeAllowedForContracts.Message = "The contract doesn't have any split/tranch";
                        }
                        else if (mergeDetails.IsAllocated)
                        {
                            mergeAllowedForContracts.IsAllowed = false;
                            mergeAllowedForContracts.Message = "The contract is allocated";
                        }
                        else if (mergeDetails.IsInvoiced)
                        {
                            mergeAllowedForContracts.IsAllowed = false;
                            mergeAllowedForContracts.Message = "The contract is invoiced";
                        }
                        else if (mergeDetails.HasCost)
                        {
                            mergeDetails.Costs = await contextualData.ReadAsync<MergeCostDetailDto>();
                            GetCostDetailsForMerge(mergeAllowedForContracts, mergeDetails);
                        }
                        else if (mergeDetails.IsClosed)
                        {
                            mergeAllowedForContracts.IsAllowed = false;
                            mergeAllowedForContracts.Message = "The contract is closed";
                        }
                        else if (!mergeDetails.IsDisabled && mergeDetails.HasChild)
                        {
                            mergeAllowedForContracts.IsAllowed = false;
                            mergeAllowedForContracts.Message = "All the splits are already merged";
                        }
                    }
                }
            }

            return mergeAllowedForContracts;
        }

        public async Task<IEnumerable<ContractFamilyForMergeDto>> GetContractFamilyForMergeAsync(string company, long sectionId, int? dataVersionId = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@sectionId", sectionId);
            queryParameters.Add(DataVersionIdParameter, dataVersionId);
            queryParameters.Add("@CompanyId", company);
            IEnumerable<ContractFamilyForMergeDto> contractFamilyForMerge = new List<ContractFamilyForMergeDto>();
            using (var contextualData = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetContractFamilyForMerge, queryParameters, true))
            {
                if (contextualData != null)
                {
                    contractFamilyForMerge = await contextualData.ReadAsync<ContractFamilyForMergeDto>();
                    bool isCostPresent = contractFamilyForMerge.Any(contract => contract.HasCost);
                    if (isCostPresent)
                    {
                        IEnumerable<MergeCostDetailDto> costs = await contextualData.ReadAsync<MergeCostDetailDto>();
                        GetContractsFamilyForMerge(contractFamilyForMerge, costs);
                    }
                    else
                    {
                        GetContractsFamilyForMerge(contractFamilyForMerge);
                    }
                }
            }

            return contractFamilyForMerge.ToList();
        }

        public async Task<IEnumerable<TradeMergeMessageDto>> GetContextualDataForSelectedContractMergeAsync(string company, long[] sectionIds, int? dataVersionId = null, bool isCostNeeded = false)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Section", AddValuesToUDTTSection(sectionIds));
            queryParameters.Add(DataVersionIdParameter, dataVersionId);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@IsCostOutput", isCostNeeded);
            List<TradeMergeMessageDto> tradeMergeMessages = new List<TradeMergeMessageDto>();
            using (var contextualData = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetContexualDataForSelectedContractMerge, queryParameters))
            {
                if (contextualData != null)
                {
                    IEnumerable<SectionDto> mergeDetails = await contextualData.ReadAsync<SectionDto>();
                    if (mergeDetails != null)
                    {
                        SectionDto mergeToTradeDetail = mergeDetails.First();
                        GetWarningMessages(mergeDetails, mergeToTradeDetail, tradeMergeMessages);
                        GetBlockingMessages(mergeDetails, mergeToTradeDetail, tradeMergeMessages);
                    }
                }
            }

            return tradeMergeMessages;
        }

        public async Task<MergeContextualDataForContracts> GetContextualDataForSelectedContractsAsync(string company, long[] sectionIds, int? dataVersionId = null, bool isCostNeeded = false)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Section", AddValuesToUDTTSection(sectionIds));
            queryParameters.Add(DataVersionIdParameter, dataVersionId);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@IsCostOutput", isCostNeeded);
            List<TradeMergeMessageDto> tradeMergeMessages = new List<TradeMergeMessageDto>();
            MergeContextualDataForContracts mergeContextualData = new MergeContextualDataForContracts();
            using (var contextualData = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetContexualDataForSelectedContractMerge, queryParameters))
            {
                if (contextualData != null)
                {
                    IEnumerable<SectionDto> mergeDetails = await contextualData.ReadAsync<SectionDto>();
                    if (mergeDetails != null)
                    {
                        SectionDto mergeToTradeDetail = mergeDetails.First();
                        GetWarningMessages(mergeDetails, mergeToTradeDetail, tradeMergeMessages);
                        GetBlockingMessages(mergeDetails, mergeToTradeDetail, tradeMergeMessages);
                        if (isCostNeeded)
                        {
                            if (!contextualData.IsConsumed)
                            {
                                mergeContextualData.CostContextualData = await contextualData.ReadAsync<CostDto>();
                            }

                            mergeContextualData.SectionContextualData = mergeDetails;
                        }

                        mergeContextualData.TradeMergeMessages = tradeMergeMessages;
                    }
                }
            }

            return mergeContextualData;
        }

        private void GetWarningMessages(IEnumerable<SectionDto> mergeDetails, SectionDto mergeToTrade, List<TradeMergeMessageDto> tradeMergeMessages)
        {
            if (mergeDetails.Count() > 1)
            {
                foreach (SectionDto mergeDetail in mergeDetails.Skip(1))
                {
                    SetWarningMessageDetails(mergeToTrade, tradeMergeMessages, mergeDetail);
                }
            }
        }

        private void GetBlockingMessages(IEnumerable<SectionDto> mergeDetails, SectionDto mergeToTrade, List<TradeMergeMessageDto> tradeMergeMessages)
        {
            if (mergeDetails.Count() > 1)
            {
                foreach (SectionDto mergeDetail in mergeDetails.Skip(1))
                {
                    SetBlockingMessageDetails(mergeToTrade, tradeMergeMessages, mergeDetail);
                }
            }
        }

        private static void SetWarningMessageDetails(SectionDto mergeToTrade, List<TradeMergeMessageDto> tradeMergeMessages, SectionDto mergeDetail)
        {
            List<string> warningInputValues = new List<string>();

            if (!string.IsNullOrEmpty(mergeDetail.PremiumDiscountCurrency) && !string.IsNullOrEmpty(mergeToTrade.PremiumDiscountCurrency)
                && (mergeDetail.PremiumDiscountCurrency != mergeToTrade.PremiumDiscountCurrency))
            {
                warningInputValues.Add(WarningInputValues.PremiumDiscountCurrency);
            }

            if (mergeDetail.PremiumDiscountTypeId != mergeToTrade.PremiumDiscountTypeId)
            {
                warningInputValues.Add(WarningInputValues.PremiumDiscountType);
            }

            if (mergeDetail.PremiumDiscountValue != mergeToTrade.PremiumDiscountValue)
            {
                warningInputValues.Add(WarningInputValues.PremiumDiscountValue);
            }

            if (mergeDetail.ContractTermId != mergeToTrade.ContractTermId)
            {
                warningInputValues.Add(WarningInputValues.ContractTerm);
            }

            if (mergeDetail.Part2 != mergeToTrade.Part2)
            {
                warningInputValues.Add(WarningInputValues.Commodity2);
            }

            if (mergeDetail.Part3 != mergeToTrade.Part3)
            {
                warningInputValues.Add(WarningInputValues.Commodity3);
            }

            if (mergeDetail.Part4 != mergeToTrade.Part4)
            {
                warningInputValues.Add(WarningInputValues.Commodity4);
            }

            if (mergeDetail.Part5 != mergeToTrade.Part5)
            {
                warningInputValues.Add(WarningInputValues.Commodity5);
            }

            if (warningInputValues != null && warningInputValues.Any())
            {
                TradeMergeMessageDto tradeMergeMessage = new TradeMergeMessageDto();
                tradeMergeMessage.SectionId = mergeDetail.SectionId;
                tradeMergeMessage.ContractSectionCode = mergeDetail.ContractSectionCode;
                tradeMergeMessage.BlockingOrWarningInput = warningInputValues;
                tradeMergeMessage.IsWarning = true;
                tradeMergeMessages.Add(tradeMergeMessage);
            }
        }

        private static void SetBlockingMessageDetails(SectionDto mergeToTrade, List<TradeMergeMessageDto> tradeMergeMessages, SectionDto mergeDetail)
        {
            List<string> blockingInputValues = new List<string>();
            if (mergeDetail.IsClosed != mergeToTrade.IsClosed)
            {
                blockingInputValues.Add(BlockingInputValues.OpenClosed);
            }

            if (mergeDetail.DepartmentId != mergeToTrade.DepartmentId)
            {
                blockingInputValues.Add(BlockingInputValues.Department);
            }

            if (mergeDetail.CounterpartyReference != mergeToTrade.CounterpartyReference)
            {
                blockingInputValues.Add(BlockingInputValues.Counterparty);
            }

            if (mergeDetail.BlDate != mergeToTrade.BlDate)
            {
                blockingInputValues.Add(BlockingInputValues.BLDate);
            }

            if (mergeDetail.CharterCode != mergeToTrade.CharterCode)
            {
                blockingInputValues.Add(BlockingInputValues.CharterReference);
            }

            if (mergeDetail.PrincipalCommodity != mergeToTrade.PrincipalCommodity)
            {
                blockingInputValues.Add(BlockingInputValues.Commodity1);
            }

            if (mergeDetail.WeightUnitId != mergeToTrade.WeightUnitId)
            {
                blockingInputValues.Add(BlockingInputValues.QuantityCode);
            }

            if (mergeDetail.PricingMethod != mergeToTrade.PricingMethod)
            {
                blockingInputValues.Add(BlockingInputValues.PriceMethod);
            }

            if (mergeDetail.Currency != mergeToTrade.Currency)
            {
                blockingInputValues.Add(BlockingInputValues.Currency);
            }

            if (mergeDetail.PriceUnitId != mergeToTrade.PriceUnitId)
            {
                blockingInputValues.Add(BlockingInputValues.PriceCode);
            }

            if (mergeDetail.Price != mergeToTrade.Price)
            {
                blockingInputValues.Add(BlockingInputValues.Price);
            }

            if (blockingInputValues != null && blockingInputValues.Any())
            {
                TradeMergeMessageDto tradeMergeMessage = new TradeMergeMessageDto();
                tradeMergeMessage.SectionId = mergeDetail.SectionId;
                tradeMergeMessage.ContractSectionCode = mergeDetail.ContractSectionCode;
                tradeMergeMessage.BlockingOrWarningInput = blockingInputValues;
                tradeMergeMessage.IsBlocking = true;
                tradeMergeMessages.Add(tradeMergeMessage);
            }
        }

        private static void GetCostDetailsForMerge(MergeAllowedForContractsDto mergeAllowedForContracts, MergeDetailDto mergeDetails)
        {
            if (mergeDetails.Costs != null)
            {
                IEnumerable<MergeCostDetailDto> invoicedCosts = mergeDetails.Costs.Where(cost => cost.IsCostInvoiced);
                if (invoicedCosts.Any())
                {
                    foreach (MergeCostDetailDto cost in invoicedCosts)
                    {
                        if (cost.RateTypeId == (int)RateType.Rate || cost.RateTypeId == (int)RateType.Percent)
                        {
                            mergeAllowedForContracts.IsAllowed = false;
                            mergeAllowedForContracts.Message = "The cost with rate/percent have been invoiced";
                        }
                        else if (cost.RateTypeId == (int)RateType.Percent)
                        {
                            mergeAllowedForContracts.IsAllowed = true;
                        }
                    }
                }
                else
                {
                    mergeAllowedForContracts.IsAllowed = true;
                }
            }
        }

        private static void GetContractsFamilyForMerge(IEnumerable<ContractFamilyForMergeDto> contractFamilyForMerge, IEnumerable<MergeCostDetailDto> costs = null)
        {
            bool contractsExists = contractFamilyForMerge != null;
            if (contractsExists)
            {
                foreach (ContractFamilyForMergeDto contract in contractFamilyForMerge)
                {
                    // setting the  default value as true since merge to enabled/disabled
                    // based on the number of splits/invoiced/allocation/costs
                    contract.IsMergeAllowed = true;

                    if (contract.IsAllocated)
                    {
                        contract.IsMergeAllowed = false;
                        contract.Message = "The contract is allocated";
                    }
                    else if (contract.IsInvoiced)
                    {
                        contract.IsMergeAllowed = false;
                        contract.Message = "The contract is invoiced";
                    }
                    else if (contract.HasCost)
                    {
                        IEnumerable<MergeCostDetailDto> costsForSelectedContract = costs.Where((cost) => cost.SectionId == contract.SectionId);
                        GetCostDetailsForContracts(costsForSelectedContract, contract);
                    }
                    else if (contract.IsClosed)
                    {
                        contract.IsMergeAllowed = false;
                        contract.Message = "The contract is closed";
                    }
                }
            }
        }

        private static void GetCostDetailsForContracts(IEnumerable<MergeCostDetailDto> costs, ContractFamilyForMergeDto contract)
        {
            if (costs != null)
            {
                IEnumerable<MergeCostDetailDto> invoicedCosts = costs.Where(cost => cost.IsCostInvoiced);
                if (invoicedCosts.Any())
                {
                    foreach (MergeCostDetailDto cost in invoicedCosts)
                    {
                        if (cost.RateTypeId == (int)RateType.Rate || cost.RateTypeId == (int)RateType.Percent)
                        {
                            contract.IsMergeAllowed = false;
                            contract.Message = "The cost with rate/percent have been invoiced";
                        }
                        else if (cost.RateTypeId == (int)RateType.Percent)
                        {
                            contract.IsMergeAllowed = true;
                        }
                    }
                }
                else
                {
                    contract.IsMergeAllowed = true;
                }
            }
        }

        private static DataTable AddValuesToUDTTSection(long[] sectionIds)
        {
            DataTable table = new DataTable();
            table.SetTypeName("[dbo].[UDTT_BigIntList]");

            DataColumn id = new DataColumn("Id", typeof(long));
            table.Columns.Add(id);

            if (sectionIds != null)
            {
                foreach (var value in sectionIds)
                {
                    var row = table.NewRow();
                    row[id] = value;

                    table.Rows.Add(row);
                }
            }

            return table;
        }

        private static class StoredProcedureNames
        {
            internal const string GetContextualDataForContractMerge = "[Trading].[usp_GetContexualDataForContractMerge]";
            internal const string GetContractFamilyForMerge = "[Trading].[usp_GetContractFamilyForMerge]";
            internal const string GetContexualDataForSelectedContractMerge = "[Trading].[usp_GetContexualDataForSelectedContractMerge]";
        }

        private static class WarningInputValues
        {
            internal const string Commodity2 = "CMY2";
            internal const string Commodity3 = "CMY3";
            internal const string Commodity4 = "CMY4";
            internal const string Commodity5 = "CMY5";
            internal const string PremiumDiscountCurrency = "Price Prem/Disc Currency";
            internal const string PremiumDiscountType = "Price Premium/Discount";
            internal const string PremiumDiscountValue = "Price Premium/Discount Rate Amount";
            internal const string ContractTerm = "Contract Term";
        }

        private static class BlockingInputValues
        {
            internal const string OpenClosed = "Open/Closed";
            internal const string Department = "Department";
            internal const string Counterparty = "Counterparty";
            internal const string Commodity1 = "CMY1";
            internal const string QuantityCode = "Quantity Code";
            internal const string PriceMethod = "PPrice Method";
            internal const string Currency = "Price Currency";
            internal const string PriceCode = "Price Code";
            internal const string Price = "Price";
            internal const string BLDate = "BLDate";
            internal const string CharterReference = "Charter Reference";

        }
    }
}
