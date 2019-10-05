using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.Trading.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Repositories
{
    public class TradeRepository : BaseRepository, ITradeRepository
    {
        public TradeRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                    typeof(Trade<SectionDeprecated>),
                    new ColumnAttributeTypeMapper<Trade<SectionDeprecated>>());
        }

        public async Task<SectionReference> CreatePhysicalContractAsync(Section physicalFixedPricedContract)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@ContractId", physicalFixedPricedContract.ContractReference);
            queryParameters.Add("@Type", (int)physicalFixedPricedContract.Type);
            queryParameters.Add("@ContractDate", physicalFixedPricedContract.ContractDate.Date);
            queryParameters.Add("@Status", (int)physicalFixedPricedContract.Status);
            queryParameters.Add("@DepartmentId", physicalFixedPricedContract.DepartmentId);
            queryParameters.Add("@TraderId", physicalFixedPricedContract.TraderId);
            queryParameters.Add("@BuyerCode", physicalFixedPricedContract.BuyerCode);
            queryParameters.Add("@SellerCode", physicalFixedPricedContract.SellerCode);
            queryParameters.Add("@CommodityId", physicalFixedPricedContract.CommodityId == 0 ? null : physicalFixedPricedContract.CommodityId);
            queryParameters.Add("@WeightUnitId", physicalFixedPricedContract.WeightUnitId); // Quantity Unit
            queryParameters.Add("@ContractQuantity", physicalFixedPricedContract.Quantity);
            queryParameters.Add("@CropYear", physicalFixedPricedContract.CropYear);
            queryParameters.Add("@CropYearTo", physicalFixedPricedContract.CropYearTo);
            queryParameters.Add("@ContractTermCode", physicalFixedPricedContract.ContractTerms);
            queryParameters.Add("@ContractTermLocationCode", physicalFixedPricedContract.ContractTermsLocation);
            queryParameters.Add("@PortOriginCode", physicalFixedPricedContract.PortOfOrigin);
            queryParameters.Add("@PortDestinationCode", physicalFixedPricedContract.PortOfDestination);
            queryParameters.Add("@PeriodTypeId", physicalFixedPricedContract.PeriodTypeId);
            queryParameters.Add("@DeliveryPeriodStart", physicalFixedPricedContract.DeliveryPeriodStartDate ?? (object)DBNull.Value);
            queryParameters.Add("@DeliveryPeriodEnd", physicalFixedPricedContract.DeliveryPeriodEndDate ?? (object)DBNull.Value);
            queryParameters.Add("@PositionMonthType", (int)physicalFixedPricedContract.PositionMonthType);
            queryParameters.Add("@MonthPositionIndex", physicalFixedPricedContract.PositionMonthIndex);
            queryParameters.Add("@ArbitrationCode", physicalFixedPricedContract.Arbitration);
            queryParameters.Add("@MarketSectorId", physicalFixedPricedContract.MarketSectorId == 0 ? null : physicalFixedPricedContract.MarketSectorId);
            queryParameters.Add("@PricingMethodId", (int)physicalFixedPricedContract.PricingMethod);
            queryParameters.Add("@PaymentTermCode", physicalFixedPricedContract.PaymentTerms);
            queryParameters.Add("@CurrencyCode", physicalFixedPricedContract.CurrencyCode);
            queryParameters.Add("@PriceUnitId", physicalFixedPricedContract.PriceUnitId);
            queryParameters.Add("@Price", physicalFixedPricedContract.Price);
            queryParameters.Add("@Counterparty", physicalFixedPricedContract.CounterpartyReference);
            queryParameters.Add("@ContractedValue", physicalFixedPricedContract.ContractedValue);
            queryParameters.Add("@Memorandum", physicalFixedPricedContract.Memorandum);
            queryParameters.Add("@PremiumDiscountValue", physicalFixedPricedContract.DiscountPremiumValue);
            queryParameters.Add("@PremiumDiscountCurrency", string.IsNullOrEmpty(physicalFixedPricedContract.DiscountPremiumCurrency) ? null : physicalFixedPricedContract.DiscountPremiumCurrency);
            queryParameters.Add("@PremiumDiscountType", physicalFixedPricedContract.DiscountPremiumType);
            queryParameters.Add("@PremiumDiscountBasis", physicalFixedPricedContract.DiscountPremiumBasis);
            queryParameters.Add("@OtherReference", physicalFixedPricedContract.OtherReference);
            queryParameters.Add("@EstimatedMaturityDate", physicalFixedPricedContract.EstimatedMaturityDate);

            queryParameters.Add("@CompanyId", physicalFixedPricedContract.CompanyId);
            queryParameters.Add(DataVersionIdParameter, physicalFixedPricedContract.DataVersionId);

            SectionReference res = await ExecuteQueryFirstOrDefaultAsync<SectionReference>(StoredProcedureNames.CreateTradeContract, queryParameters, true);

            return res;
        }

        public async Task<IEnumerable<SectionReference>> CreatePhysicalContractAsImageAsync(Section physicalFixedPricedContract)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@ContractId", physicalFixedPricedContract.ContractReference);
            queryParameters.Add("@Type", (int)physicalFixedPricedContract.Type);
            queryParameters.Add("@ContractDate", physicalFixedPricedContract.ContractDate.Date);
            queryParameters.Add("@Status", (int)physicalFixedPricedContract.Status);
            queryParameters.Add("@DepartmentId", physicalFixedPricedContract.DepartmentId);
            queryParameters.Add("@TraderId", physicalFixedPricedContract.TraderId);
            queryParameters.Add("@BuyerCode", physicalFixedPricedContract.BuyerCode);
            queryParameters.Add("@SellerCode", physicalFixedPricedContract.SellerCode);
            queryParameters.Add("@CommodityId", physicalFixedPricedContract.CommodityId == 0 ? null : physicalFixedPricedContract.CommodityId);
            queryParameters.Add("@WeightUnitId", physicalFixedPricedContract.WeightUnitId == 0 ? null : physicalFixedPricedContract.WeightUnitId); // Quantity Unit
            queryParameters.Add("@ContractQuantity", physicalFixedPricedContract.Quantity);
            queryParameters.Add("@OriginalQuantity", physicalFixedPricedContract.OriginalQuantity);
            queryParameters.Add("@CropYear", physicalFixedPricedContract.CropYear);
            queryParameters.Add("@CropYearTo", physicalFixedPricedContract.CropYearTo);
            queryParameters.Add("@ContractTermCode", physicalFixedPricedContract.ContractTerms);
            queryParameters.Add("@ContractTermLocationCode", physicalFixedPricedContract.ContractTermsLocation);
            queryParameters.Add("@PortOriginCode", physicalFixedPricedContract.PortOfOrigin);
            queryParameters.Add("@PortDestinationCode", physicalFixedPricedContract.PortOfDestination);
            queryParameters.Add("@PeriodTypeId", physicalFixedPricedContract.PeriodTypeId == 0 ? null : physicalFixedPricedContract.PeriodTypeId);
            queryParameters.Add("@DeliveryPeriodStart", physicalFixedPricedContract.DeliveryPeriodStartDate ?? (object)DBNull.Value);
            queryParameters.Add("@DeliveryPeriodEnd", physicalFixedPricedContract.DeliveryPeriodEndDate ?? (object)DBNull.Value);
            queryParameters.Add("@PositionMonthType", (int)physicalFixedPricedContract.PositionMonthType);
            queryParameters.Add("@MonthPositionIndex", physicalFixedPricedContract.PositionMonthIndex);
            queryParameters.Add("@ArbitrationCode", physicalFixedPricedContract.Arbitration);
            queryParameters.Add("@MarketSectorId", physicalFixedPricedContract.MarketSectorId == 0 ? null : physicalFixedPricedContract.MarketSectorId);
            queryParameters.Add("@PricingMethodId", (int)physicalFixedPricedContract.PricingMethod);
            queryParameters.Add("@PaymentTermCode", physicalFixedPricedContract.PaymentTerms);
            queryParameters.Add("@CurrencyCode", physicalFixedPricedContract.CurrencyCode == string.Empty ? null : physicalFixedPricedContract.CurrencyCode);
            queryParameters.Add("@PriceUnitId", physicalFixedPricedContract.PriceUnitId == 0 ? null : physicalFixedPricedContract.PriceUnitId);
            queryParameters.Add("@Price", physicalFixedPricedContract.Price);
            queryParameters.Add("@Counterparty", physicalFixedPricedContract.CounterpartyReference == string.Empty ? null : physicalFixedPricedContract.CounterpartyReference);
            queryParameters.Add("@ContractedValue", physicalFixedPricedContract.ContractedValue);
            queryParameters.Add("@Memorandum", physicalFixedPricedContract.Memorandum == string.Empty ? null : physicalFixedPricedContract.Memorandum);
            queryParameters.Add("@PremiumDiscountValue", physicalFixedPricedContract.DiscountPremiumValue);
            queryParameters.Add("@PremiumDiscountCurrency", string.IsNullOrEmpty(physicalFixedPricedContract.DiscountPremiumCurrency)? null : physicalFixedPricedContract.DiscountPremiumCurrency);
            queryParameters.Add("@PremiumDiscountType", physicalFixedPricedContract.DiscountPremiumType);
            queryParameters.Add("@PremiumDiscountBasis", physicalFixedPricedContract.DiscountPremiumBasis);
            queryParameters.Add("@NumberOfContract", physicalFixedPricedContract.NumberOfContract);
            queryParameters.Add("@CompanyId", physicalFixedPricedContract.CompanyId);
            queryParameters.Add("@OtherReference", physicalFixedPricedContract.OtherReference);
            queryParameters.Add("@EstimatedMaturityDate", physicalFixedPricedContract.EstimatedMaturityDate);
            queryParameters.Add("@IsInterCo", physicalFixedPricedContract.IsInterco);
            queryParameters.Add("@ProvinceId", physicalFixedPricedContract.ProvinceId);
            queryParameters.Add("@BranchId", physicalFixedPricedContract.BranchId);

            queryParameters.Add(DataVersionIdParameter, physicalFixedPricedContract.DataVersionId);

            var result = await ExecuteQueryAsync<SectionReference>(StoredProcedureNames.CreateTradeContractForImage, queryParameters, true);

            return result;
        }

        public async Task UpdateReferenceAndInternalMemoAsync(ReferenceInternalMemo referenceInternalMemo)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@InterCoTrade", ReferenceInternalMemoTVP(referenceInternalMemo));

            await ExecuteQueryAsync<SectionReference>(StoredProcedureNames.AddUpdatePhysicalContractInterCo, queryParameters, true);
        }

        public async Task DeleteReferenceAndInternalMemoAsync(long sectionId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@PhysicalContractId", sectionId);

            await ExecuteQueryAsync<SectionReference>(StoredProcedureNames.DeletePhysicalContractInterCo, queryParameters, true);
        }

        private DataTable ReferenceInternalMemoTVP(ReferenceInternalMemo referenceInternalMemo)
        {
            DataTable tableReferenceInternalMemo = new DataTable();
            tableReferenceInternalMemo.SetTypeName("[Trading].[UDTT_PhysicalContractInterCo]");

            DataColumn physicalContractInterCoId = new DataColumn("[PhysicalContractInterCoId]", typeof(long));
            tableReferenceInternalMemo.Columns.Add(physicalContractInterCoId);

            DataColumn dataVersionId = new DataColumn("[DataVersionId]", typeof(long));
            tableReferenceInternalMemo.Columns.Add(dataVersionId);

            DataColumn physicalContractId = new DataColumn("[PhysicalContractId]", typeof(long));
            tableReferenceInternalMemo.Columns.Add(physicalContractId);

            DataColumn counterpartRef = new DataColumn("[CounterpartRef]", typeof(string));
            tableReferenceInternalMemo.Columns.Add(counterpartRef);

            DataColumn memorandum = new DataColumn("[Memorandum]", typeof(string));
            tableReferenceInternalMemo.Columns.Add(memorandum);

            DataColumn linkedDataVersionId = new DataColumn("[LinkedDataVersionId]", typeof(long));
            tableReferenceInternalMemo.Columns.Add(linkedDataVersionId);

            DataColumn linkedPhysicalContractId = new DataColumn("[LinkedPhysicalContractId]", typeof(long));
            tableReferenceInternalMemo.Columns.Add(linkedPhysicalContractId);

            DataColumn linkedCounterpartRef = new DataColumn("[LinkedCounterpartRef]", typeof(string));
            tableReferenceInternalMemo.Columns.Add(linkedCounterpartRef);

            DataColumn linkedMemorandum = new DataColumn("[LinkedMemorandum]", typeof(string));
            tableReferenceInternalMemo.Columns.Add(linkedMemorandum);

            DataColumn interCoTypeId = new DataColumn("[InterCoTypeId]", typeof(long));
            tableReferenceInternalMemo.Columns.Add(interCoTypeId);

            var referenceInternalMemoRow = tableReferenceInternalMemo.NewRow();

            referenceInternalMemoRow[dataVersionId] = (referenceInternalMemo.DataVersionId == null) ? (object)DBNull.Value : referenceInternalMemo.DataVersionId;
            referenceInternalMemoRow[physicalContractId] = (referenceInternalMemo.PhysicalContractId == null) ? (object)DBNull.Value : referenceInternalMemo.PhysicalContractId;
            referenceInternalMemoRow[counterpartRef] = referenceInternalMemo.CounterpartRef;
            referenceInternalMemoRow[memorandum] = referenceInternalMemo.Memorandum;
            referenceInternalMemoRow[linkedDataVersionId] = (referenceInternalMemo.LinkedDataVersionId == null) ? (object)DBNull.Value : referenceInternalMemo.LinkedDataVersionId;
            referenceInternalMemoRow[linkedPhysicalContractId] = (referenceInternalMemo.LinkedPhysicalContractId == null) ? (object)DBNull.Value : referenceInternalMemo.LinkedPhysicalContractId;
            referenceInternalMemoRow[linkedCounterpartRef] = referenceInternalMemo.LinkedCounterpartRef;
            referenceInternalMemoRow[linkedMemorandum] = referenceInternalMemo.LinkedMemorandum;
            referenceInternalMemoRow[interCoTypeId] = (referenceInternalMemo.InterCoTypeId == null) ? (object)DBNull.Value : referenceInternalMemo.InterCoTypeId;

            tableReferenceInternalMemo.Rows.Add(referenceInternalMemoRow);
            return tableReferenceInternalMemo;
        }

        public async Task PhysicalTradeBulkEditAsync(PhysicalTradeBulkEdit physicalTradeBulkEdit)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", physicalTradeBulkEdit.CompanyId);
            queryParameters.Add("@DataVersionId", null);
            queryParameters.Add("@PhysicalContractforBulkEdit", PhysicalContractToUpdateTvp(physicalTradeBulkEdit));
            queryParameters.Add("@SectionforBulkEdit", SectionToUpdateTvp(physicalTradeBulkEdit));

            await ExecuteNonQueryAsync(
                        StoredProcedureNames.UpdateTradesInBulk,
                        queryParameters,
                        true);
        }

        private static DataTable SectionToUpdateTvp(PhysicalTradeBulkEdit physicalTradeBulkEdit)
        {
            DataTable table = new DataTable();
            table.SetTypeName("[Trading].[UDTT_SectionToUpdate]");

            DataColumn sectionId = new DataColumn("SectionId", typeof(long));
            table.Columns.Add(sectionId);
            DataColumn departmentId = new DataColumn("DepartmentId", typeof(long));
            table.Columns.Add(departmentId);
            DataColumn buyerId = new DataColumn("BuyerId", typeof(long));
            table.Columns.Add(buyerId);
            DataColumn sellerId = new DataColumn("SellerId", typeof(long));
            table.Columns.Add(sellerId);
            DataColumn counterparty = new DataColumn("Counterparty", typeof(string));
            table.Columns.Add(counterparty);
            DataColumn commodityId = new DataColumn("CommodityId", typeof(long));
            table.Columns.Add(commodityId);
            DataColumn cropYear = new DataColumn("CropYear", typeof(int));
            table.Columns.Add(cropYear);
            DataColumn weightUnitId = new DataColumn("WeightUnitId", typeof(long));
            table.Columns.Add(weightUnitId);
            DataColumn quantity = new DataColumn("Quantity", typeof(decimal));
            table.Columns.Add(quantity);
            DataColumn contractTermId = new DataColumn("ContractTermId", typeof(long));
            table.Columns.Add(contractTermId);
            DataColumn contractTermLocationId = new DataColumn("ContractTermLocationId", typeof(long));
            table.Columns.Add(contractTermLocationId);
            DataColumn arbitrationId = new DataColumn("ArbitrationId", typeof(long));
            table.Columns.Add(arbitrationId);
            DataColumn currencyCode = new DataColumn("CurrencyCode", typeof(string));
            table.Columns.Add(currencyCode);
            DataColumn priceUnitId = new DataColumn("PriceUnitId", typeof(long));
            table.Columns.Add(priceUnitId);
            DataColumn price = new DataColumn("Price", typeof(decimal));
            table.Columns.Add(price);
            DataColumn contractedValue = new DataColumn("ContractedValue", typeof(decimal));
            table.Columns.Add(contractedValue);
            DataColumn paymentTermId = new DataColumn("PaymentTermId", typeof(long));
            table.Columns.Add(paymentTermId);
            DataColumn premiumDiscountBasis = new DataColumn("PremiumDiscountBasis", typeof(short));
            table.Columns.Add(premiumDiscountBasis);
            DataColumn premiumDiscountCurrency = new DataColumn("PremiumDiscountCurrency", typeof(string));
            table.Columns.Add(premiumDiscountCurrency);
            DataColumn premiumDiscountTypeId = new DataColumn("PremiumDiscountTypeId", typeof(short));
            table.Columns.Add(premiumDiscountTypeId);
            DataColumn premiumDiscountValue = new DataColumn("PremiumDiscountValue", typeof(decimal));
            table.Columns.Add(premiumDiscountValue);
            DataColumn periodTypeId = new DataColumn("PeriodTypeId", typeof(int));
            table.Columns.Add(periodTypeId);
            DataColumn deliveryPeriodStart = new DataColumn("DeliveryPeriodStart", typeof(DateTime));
            table.Columns.Add(deliveryPeriodStart);
            DataColumn deliveryPeriodEnd = new DataColumn("DeliveryPeriodEnd", typeof(DateTime));
            table.Columns.Add(deliveryPeriodEnd);
            DataColumn positionMonthType = new DataColumn("PositionMonthType", typeof(short));
            table.Columns.Add(positionMonthType);
            DataColumn monthPositionIndex = new DataColumn("MonthPositionIndex", typeof(int));
            table.Columns.Add(monthPositionIndex);
            DataColumn portOriginId = new DataColumn("PortOriginId", typeof(long));
            table.Columns.Add(portOriginId);
            DataColumn portDestinationId = new DataColumn("PortDestinationId", typeof(long));
            table.Columns.Add(portDestinationId);
            DataColumn marketSectorId = new DataColumn("MarketSectorId", typeof(long));
            table.Columns.Add(marketSectorId);
            DataColumn vesselId = new DataColumn("VesselId", typeof(long));
            table.Columns.Add(vesselId);
            DataColumn blDate = new DataColumn("BLDate", typeof(DateTime));
            table.Columns.Add(blDate);
            DataColumn blReference = new DataColumn("BLReference", typeof(string));
            table.Columns.Add(blReference);
            DataColumn memorandum = new DataColumn("Memorandum", typeof(string));
            table.Columns.Add(memorandum);
            DataColumn otherReference = new DataColumn("OtherReference", typeof(string));
            table.Columns.Add(otherReference);
            DataColumn lastDocumentIssuedDate = new DataColumn("LastDocumentIssuedDate", typeof(DateTime));
            table.Columns.Add(lastDocumentIssuedDate);
            DataColumn cropYearTo = new DataColumn("CropYearTo", typeof(int));
            table.Columns.Add(cropYearTo);
            DataColumn isBlDateUpdatable = new DataColumn("IsBlDateUpdatable", typeof(bool));
            table.Columns.Add(isBlDateUpdatable);
            DataColumn lastEmailReceivedDate = new DataColumn("LastEmailReceivedDate", typeof(DateTime));
            table.Columns.Add(lastEmailReceivedDate);
            DataColumn contractSentDate = new DataColumn("ContractSentDate", typeof(DateTime));
            table.Columns.Add(contractSentDate);
            DataColumn contractReturnedDate = new DataColumn("ContractReturnedDate", typeof(DateTime));
            table.Columns.Add(contractReturnedDate);
            DataColumn contractStatusCode = new DataColumn("ContractStatusCode", typeof(short));
            table.Columns.Add(contractStatusCode);
            DataColumn invoiceStatusId = new DataColumn("InvoicingStatusId", typeof(short));
            table.Columns.Add(invoiceStatusId);

            foreach (var item in physicalTradeBulkEdit.SectionToUpdate)
            {
                var row = table.NewRow();
                row[sectionId] = item.SectionId;
                row[departmentId] = item.DepartmentId;
                row[buyerId] = item.BuyerCounterpartyId;
                row[sellerId] = item.SellerCounterpartyId;
                row[counterparty] = item.CounterpartyReference;
                row[commodityId] = item.CommodityId;
                row[cropYear] = item.CropYearFrom == null ? (object)DBNull.Value : item.CropYearFrom;
                row[cropYearTo] = item.CropYearTo == null ? (object)DBNull.Value : item.CropYearTo;
                row[weightUnitId] = item.WeightUnitId;
                row[quantity] = item.Quantity;
                row[contractTermId] = item.ContractTermId;
                row[contractTermLocationId] = item.PortTermId;
                row[arbitrationId] = item.ArbitrationId.HasValue ? item.ArbitrationId : (object)DBNull.Value;
                row[currencyCode] = item.CurrencyCode;
                row[priceUnitId] = item.PriceUnitId;
                row[price] = item.ContractPrice;
                row[contractedValue] = item.ContractValue;
                row[paymentTermId] = item.PaymentTermsId;
                row[premiumDiscountBasis] = item.PremiumDiscountBasis.HasValue ? item.PremiumDiscountBasis : (object)DBNull.Value;
                row[premiumDiscountCurrency] = item.PremiumDiscountCurrency;
                row[premiumDiscountTypeId] = item.PremiumDiscountTypeId.HasValue ? item.PremiumDiscountTypeId : (object)DBNull.Value;
                row[premiumDiscountValue] = item.PremiumDiscountValue;
                row[periodTypeId] = item.PeriodTypeId;
                row[deliveryPeriodStart] = item.DeliveryPeriodStart;
                row[deliveryPeriodEnd] = item.DeliveryPeriodEnd;
                row[positionMonthType] = item.PositionMonthType;
                row[monthPositionIndex] = item.MonthPositionIndex;
                row[portOriginId] = item.PortOriginId.HasValue ? item.PortOriginId : (object)DBNull.Value;
                row[portDestinationId] = item.PortDestinationId.HasValue ? item.PortDestinationId : (object)DBNull.Value;
                row[marketSectorId] = item.BusinessSectorId.HasValue ? item.BusinessSectorId : (object)DBNull.Value;
                row[memorandum] = item.Memorandum;
                row[lastDocumentIssuedDate] = item.ContractIssuedDate.HasValue ? item.ContractIssuedDate : (object)DBNull.Value;
                row[otherReference] = item.OtherReference;
                row[vesselId] = item.VesselId.HasValue ? item.VesselId : (object)DBNull.Value;
                row[blDate] = item.BLDate.HasValue ? item.BLDate : (object)DBNull.Value;
                row[blReference] = item.BLReference;
                row[isBlDateUpdatable] = item.IsBlDateUpdatable.HasValue ? item.IsBlDateUpdatable : (object)DBNull.Value;
                row[lastEmailReceivedDate] = item.LastEmailReceivedDate.HasValue ? item.LastEmailReceivedDate : (object)DBNull.Value;
                row[contractSentDate] = item.ContractSentDate.HasValue ? item.ContractSentDate : (object)DBNull.Value;
                row[contractReturnedDate] = item.ContractReturnedDate.HasValue ? item.ContractReturnedDate : (object)DBNull.Value;
                row[contractStatusCode] = item.ContractStatusCode.HasValue ? item.ContractStatusCode : (object)DBNull.Value;
                row[invoiceStatusId] = item.InvoicingStatusId.HasValue ? item.InvoicingStatusId : (object)DBNull.Value;
                table.Rows.Add(row);
            }

            return table;
        }

        private static DataTable PhysicalContractToUpdateTvp(PhysicalTradeBulkEdit physicalTradeBulkEdit)
        {
            DataTable table = new DataTable();
            table.SetTypeName("[Trading].[UDTT_PhysicalContractToUpdate]");

            DataColumn physicalContractId = new DataColumn("PhysicalContractId", typeof(long));
            table.Columns.Add(physicalContractId);
            DataColumn contractDate = new DataColumn("ContractDate", typeof(DateTime));
            table.Columns.Add(contractDate);
            DataColumn userId = new DataColumn("TraderId", typeof(long));
            table.Columns.Add(userId);

            foreach (var item in physicalTradeBulkEdit.PhysicalContractToUpdate)
            {
                var row = table.NewRow();
                row[physicalContractId] = item.PhysicalContractId;
                row[contractDate] = item.ContractDate;
                row[userId] = item.UserId;
                table.Rows.Add(row);
            }

            return table;
        }

        public async Task UpdatePhysicalContractAsync(Section physicalFixedPricedContract, string company)
        {
            var queryParameters = new DynamicParameters();

            queryParameters.Add("@PhysicalContractId", physicalFixedPricedContract.PhysicalContractId);
            queryParameters.Add("@SectionId", physicalFixedPricedContract.SectionId);
            queryParameters.Add("@SectionNumberId", physicalFixedPricedContract.SectionNumber);
            queryParameters.Add("@Type", (int)physicalFixedPricedContract.Type);
            queryParameters.Add("@ContractDate", physicalFixedPricedContract.ContractDate.Date);
            queryParameters.Add("@Status", (int)physicalFixedPricedContract.Status);
            queryParameters.Add("@DepartmentId", physicalFixedPricedContract.DepartmentId);
            queryParameters.Add("@TraderId", physicalFixedPricedContract.TraderId == 0 ? null : physicalFixedPricedContract.TraderId);
            queryParameters.Add("@BuyerCode", physicalFixedPricedContract.BuyerCode);
            queryParameters.Add("@SellerCode", physicalFixedPricedContract.SellerCode);
            queryParameters.Add("@Commodityid", physicalFixedPricedContract.CommodityId == 0 ? null : physicalFixedPricedContract.CommodityId);
            queryParameters.Add("@WeightUnitId", physicalFixedPricedContract.WeightUnitId == 0 ? null : physicalFixedPricedContract.WeightUnitId);
            queryParameters.Add("@Quantity", physicalFixedPricedContract.Quantity);
            queryParameters.Add("@OriginalQuantity", physicalFixedPricedContract.OriginalQuantity);
            queryParameters.Add("@CropYear", physicalFixedPricedContract.CropYear);
            queryParameters.Add("@ContractTermsCode", physicalFixedPricedContract.ContractTerms);
            queryParameters.Add("@ContractTermsLocationCode", physicalFixedPricedContract.ContractTermsLocation);
            queryParameters.Add("@PortOriginCode", physicalFixedPricedContract.PortOfOrigin);
            queryParameters.Add("@PortDestinationCode", physicalFixedPricedContract.PortOfDestination);
            queryParameters.Add("@PeriodTypeId", physicalFixedPricedContract.PeriodTypeId == 0 ? null : physicalFixedPricedContract.PeriodTypeId);
            queryParameters.Add("@DeliveryPeriodStart", physicalFixedPricedContract.DeliveryPeriodStartDate ?? (object)DBNull.Value);
            queryParameters.Add("@DeliveryPeriodEnd", physicalFixedPricedContract.DeliveryPeriodEndDate ?? (object)DBNull.Value);
            queryParameters.Add("@PositionMonthType", (int)physicalFixedPricedContract.PositionMonthType);
            queryParameters.Add("@MonthPositionIndex", physicalFixedPricedContract.PositionMonthIndex);
            queryParameters.Add("@ArbitrationCode", physicalFixedPricedContract.Arbitration);
            queryParameters.Add("@MarketSectorId", physicalFixedPricedContract.MarketSectorId == 0 ? null : physicalFixedPricedContract.MarketSectorId);
            queryParameters.Add("@PricingMethodId", (int)physicalFixedPricedContract.PricingMethod);
            queryParameters.Add("@PaymentTermsCode", physicalFixedPricedContract.PaymentTerms);
            queryParameters.Add("@Currency", physicalFixedPricedContract.CurrencyCode == string.Empty ? null : physicalFixedPricedContract.CurrencyCode);
            queryParameters.Add("@PriceUnitId", physicalFixedPricedContract.PriceUnitId == 0 ? null : physicalFixedPricedContract.PriceUnitId);
            queryParameters.Add("@Price", physicalFixedPricedContract.Price);
            queryParameters.Add("@Counterparty", physicalFixedPricedContract.CounterpartyReference == string.Empty ? null : physicalFixedPricedContract.CounterpartyReference);
            queryParameters.Add("@ContractedValue", physicalFixedPricedContract.ContractedValue);
            queryParameters.Add("@Memorandum", physicalFixedPricedContract.Memorandum == string.Empty ? null : physicalFixedPricedContract.Memorandum);
            queryParameters.Add("@PremiumDiscountValue", physicalFixedPricedContract.DiscountPremiumValue);
            queryParameters.Add("@PremiumDiscountCurrency", string.IsNullOrEmpty(physicalFixedPricedContract.DiscountPremiumCurrency) ? null : physicalFixedPricedContract.DiscountPremiumCurrency);
            queryParameters.Add("@PremiumDiscountType", physicalFixedPricedContract.DiscountPremiumType);
            queryParameters.Add("@PremiumDiscountBasis", physicalFixedPricedContract.DiscountPremiumBasis);
            queryParameters.Add("@BLDate", physicalFixedPricedContract.BlDate);
            queryParameters.Add("@IsBLDateChanged ", physicalFixedPricedContract.IsBLDateChanged);
            queryParameters.Add("@CompanyId", physicalFixedPricedContract.CompanyId);
            queryParameters.Add(DataVersionIdParameter, physicalFixedPricedContract.DataVersionId);
            queryParameters.Add("@LastDocumentIssuedDate", physicalFixedPricedContract.LastDocumentIssuedDate);
            queryParameters.Add("@isCommodityChanged", physicalFixedPricedContract.IsCommodityChanged);
            queryParameters.Add("@isPortOfOriginChanged", physicalFixedPricedContract.IsPortOfOriginChanged);
            queryParameters.Add("@isPortOfDestinationChanged", physicalFixedPricedContract.IsPortOfDestinationChanged);
            queryParameters.Add("@IsSplitCreated", physicalFixedPricedContract.IsSplitCreated);
            queryParameters.Add("@EstimatedMaturityDate", physicalFixedPricedContract.EstimatedMaturityDate);
            queryParameters.Add("@IsInterCo", physicalFixedPricedContract.IsInterco);
            queryParameters.Add("@ContractSentDate", physicalFixedPricedContract.ContractSentDate);
            queryParameters.Add("@LastEmailReceivedDate", physicalFixedPricedContract.LastEmailReceivedDate);
            queryParameters.Add("@ContractReturnedDate", physicalFixedPricedContract.ContractReturnedDate);
            queryParameters.Add("@ContractInvoiceTypeId", (int)physicalFixedPricedContract.ContractInvoiceTypeId);
            queryParameters.Add("@ProvinceId", physicalFixedPricedContract.ProvinceId);
            queryParameters.Add("@BranchId", physicalFixedPricedContract.BranchId);

            await ExecuteNonQueryAsync(
                        StoredProcedureNames.UpdateTradeContract,
                        queryParameters,
                        true);
        }

            public async Task<SplitDetails> GetSectionNumberForSplit(string company, long sectionId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@SectionId", sectionId);

            SplitDetails res = await ExecuteQueryFirstOrDefaultAsync<SplitDetails>(StoredProcedureNames.GetLatestSectionNumber, queryParameters);
            return res;
        }

        // TODO: to remove
        public async Task<IEnumerable<SectionReference>> CreateTrancheSplitAsync(SectionDeprecated section, string company, bool isTradeImage = false)
        {
            var queryParameters = new DynamicParameters();
            IEnumerable<SectionDeprecated> childSections = section.ChildSections.Where(x => x.SectionId == 0);
            queryParameters.Add("@SectionDetails", ToArrayTVP(childSections, company));
            queryParameters.Add("@SectionTypeId", childSections.Last().SectionTypeId);
            queryParameters.Add("@IsTradeImage", isTradeImage);

            var sec = await ExecuteQueryAsync<SectionDeprecated>(
                    StoredProcedureNames.CreateSection,
                    queryParameters,
                   true);

            List<SectionReference> references = new List<SectionReference>();

            foreach (var createdSection in sec)
            {
                references.Add(new SectionReference
                {
                    ContractLabel = createdSection.ContractLabel,
                    SectionId = createdSection.SectionId,
                    Quantity = createdSection.Quantity,
                    SectionOriginId = createdSection.SectionOriginId
                });
            }

            return references;
        }
        public async Task<IEnumerable<IntercoData>> ValidateIntercoValidation(IntercoValidation intercoValidation)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Trade", ToArrayTVP(intercoValidation));
            var costs = intercoValidation.IntercoFields.Where(r => r.GroupId != 1).ToList();
            queryParameters.Add("@Cost", ToArrayTVP(costs));
            queryParameters.Add("@CompanyId", intercoValidation.CompanyId);

            IEnumerable<IntercoData> data = await ExecuteQueryAsync<IntercoData>(StoredProcedureNames.ValidateIntercoFields, queryParameters);
            return data;
        }

        private static DataTable ToArrayTVP(IntercoValidation intercoValidation)
        {
            DataTable table = new DataTable();
            table.SetTypeName("[Trading].[UDTT_IntercoSection]");

            var arbitrationCode = new DataColumn("[ArbitrationCode]", typeof(string));
            table.Columns.Add(arbitrationCode);

            var commodityId = new DataColumn("[CommodityId]", typeof(long));
            table.Columns.Add(commodityId);

            var contractTermCode = new DataColumn("[ContractTermCode]", typeof(string));
            table.Columns.Add(contractTermCode);

            var contractTermLocationCode = new DataColumn("[ContractTermLocationCode]", typeof(string));
            table.Columns.Add(contractTermLocationCode);

            var currencyCode = new DataColumn("[CurrencyCode]", typeof(string));
            table.Columns.Add(currencyCode);

            var marketZoneCode = new DataColumn("[MarketSectorId]", typeof(long));
            table.Columns.Add(marketZoneCode);

            var paymentTermCode = new DataColumn("[PaymentTermCode]", typeof(string));
            table.Columns.Add(paymentTermCode);

            var periodTypeId = new DataColumn("[PeriodTypeId]", typeof(int));
            table.Columns.Add(periodTypeId);

            var portDestinationCode = new DataColumn("[PortDestinationCode]", typeof(string));
            table.Columns.Add(portDestinationCode);

            var portOriginCode = new DataColumn("[PortOriginCode]", typeof(string));
            table.Columns.Add(portOriginCode);

            var premiumDiscountCurrency = new DataColumn("[PremiumDiscountCurrency]", typeof(string));
            table.Columns.Add(premiumDiscountCurrency);

            var price = new DataColumn("[Price]", typeof(decimal));
            table.Columns.Add(price);

            var weightUnitId = new DataColumn("[WeightUnitId]", typeof(long));
            table.Columns.Add(weightUnitId);

            var priceUnitId = new DataColumn("[PriceUnitId]", typeof(long));
            table.Columns.Add(priceUnitId);

            var section = intercoValidation.IntercoFields.Where(r => r.GroupId == 1).ToList();

            var row = table.NewRow();

            row[commodityId] = (section.FirstOrDefault(r => r.Name == "CommodityId") != null &&
                string.IsNullOrWhiteSpace(section.FirstOrDefault(r => r.Name == "CommodityId").Value))
               ? (object)DBNull.Value : section.FirstOrDefault(r => r.Name == "CommodityId").Value;
            row[contractTermCode] = (section.FirstOrDefault(r => r.Name == "ContractTermId") != null &&
                string.IsNullOrWhiteSpace(section.FirstOrDefault(r => r.Name == "ContractTermId").Value))
                ? (object)DBNull.Value : section.FirstOrDefault(r => r.Name == "ContractTermId").Value;
            row[currencyCode] = (section.FirstOrDefault(r => r.Name == "CurrencyCode") != null &&
                string.IsNullOrWhiteSpace(section.FirstOrDefault(r => r.Name == "CurrencyCode").Value))
                ? (object)DBNull.Value : section.FirstOrDefault(r => r.Name == "CurrencyCode").Value;
            //row[marketZoneCode] = (section.FirstOrDefault(r => r.Name == "MarketSectorId") != null &&
            //    string.IsNullOrWhiteSpace(section.FirstOrDefault(r => r.Name == "MarketSectorId").Value))
            //    ? (object)DBNull.Value : section.FirstOrDefault(r => r.Name == "MarketSectorId").Value;
            row[paymentTermCode] = (section.FirstOrDefault(r => r.Name == "PaymentTermId") != null &&
                string.IsNullOrWhiteSpace(section.FirstOrDefault(r => r.Name == "PaymentTermId").Value))
                ? (object)DBNull.Value : section.FirstOrDefault(r => r.Name == "PaymentTermId").Value;
            row[periodTypeId] = (section.FirstOrDefault(r => r.Name == "PeriodTypeId") != null &&
                string.IsNullOrWhiteSpace(section.FirstOrDefault(r => r.Name == "PeriodTypeId").Value))
                ? (object)DBNull.Value : section.FirstOrDefault(r => r.Name == "PeriodTypeId").Value;
            //row[portDestinationCode] = (section.FirstOrDefault(r => r.Name == "PortDestinationId") != null &&
            //    string.IsNullOrWhiteSpace(section.FirstOrDefault(r => r.Name == "PortDestinationId").Value))
            //    ? (object)DBNull.Value : section.FirstOrDefault(r => r.Name == "PortDestinationId").Value;
            //row[portOriginCode] = (section.FirstOrDefault(r => r.Name == "PortOriginId") != null &&
            //    string.IsNullOrWhiteSpace(section.FirstOrDefault(r => r.Name == "PortOriginId").Value))
            //    ? (object)DBNull.Value : section.FirstOrDefault(r => r.Name == "PortOriginId").Value;
            //row[premiumDiscountCurrency] = (section.FirstOrDefault(r => r.Name == "PremiumDiscountCurrency") != null &&
            //    string.IsNullOrWhiteSpace(section.FirstOrDefault(r => r.Name == "PremiumDiscountCurrency").Value))
            //    ? (object)DBNull.Value : section.FirstOrDefault(r => r.Name == "PremiumDiscountCurrency").Value;
            row[price] = (section.FirstOrDefault(r => r.Name == "Price") != null &&
                string.IsNullOrWhiteSpace(section.FirstOrDefault(r => r.Name == "Price").Value))
                ? (object)DBNull.Value : section.FirstOrDefault(r => r.Name == "Price").Value;
            row[weightUnitId] = (section.FirstOrDefault(r => r.Name == "WeightUnitId") != null &&
                string.IsNullOrWhiteSpace(section.FirstOrDefault(r => r.Name == "WeightUnitId").Value))
                ? (object)DBNull.Value : section.FirstOrDefault(r => r.Name == "WeightUnitId").Value;
            row[priceUnitId] = (section.FirstOrDefault(r => r.Name == "PriceUnitId") != null &&
                string.IsNullOrWhiteSpace(section.FirstOrDefault(r => r.Name == "PriceUnitId").Value))
                ? (object)DBNull.Value : section.FirstOrDefault(r => r.Name == "PriceUnitId").Value;
            table.Rows.Add(row);

            return table;
        }

        private static DataTable ToArrayTVP(IEnumerable<IntercoField> costs)
        {
            DataTable table = new DataTable();
            table.SetTypeName("[Trading].[UDTT_IntercoCost]");

            var costTypeCode = new DataColumn("[CostTypeCode]", typeof(string));
            table.Columns.Add(costTypeCode);

            var currencyCode = new DataColumn("[CurrencyCode]", typeof(string));
            table.Columns.Add(currencyCode);

            var origEstCurrencyCode = new DataColumn("[OrigEstCurrencyCode]", typeof(string));
            table.Columns.Add(origEstCurrencyCode);

            var origEstPriceUnitId = new DataColumn("[OrigEstPriceUnitId]", typeof(long));
            table.Columns.Add(origEstPriceUnitId);

            var priceUnitId = new DataColumn("[PriceUnitId]", typeof(long));
            table.Columns.Add(priceUnitId);

            var costGroups = costs.Where(r => r.GroupId > 1).GroupBy(r => r.GroupId).ToList();

            foreach (var cost in costGroups)
            {
                var row = table.NewRow();

                row[costTypeCode] = (cost.FirstOrDefault(r => r.Name == "CostTypeCode") != null &&
                            string.IsNullOrWhiteSpace(cost.FirstOrDefault(r => r.Name == "CostTypeCode").Value))
                            ? (object)DBNull.Value : cost.FirstOrDefault(r => r.Name == "CostTypeCode").Value;
                row[currencyCode] = (cost.FirstOrDefault(r => r.Name == "CurrencyCode") != null &&
                            string.IsNullOrWhiteSpace(cost.FirstOrDefault(r => r.Name == "CurrencyCode").Value))
                            ? (object)DBNull.Value : cost.FirstOrDefault(r => r.Name == "CurrencyCode").Value;
                //row[origEstCurrencyCode] = (cost.FirstOrDefault(r => r.Name == "OrigEstCurrencyCode") != null &&
                //            string.IsNullOrWhiteSpace(cost.FirstOrDefault(r => r.Name == "OrigEstCurrencyCode").Value))
                //            ? (object)DBNull.Value : cost.FirstOrDefault(r => r.Name == "OrigEstCurrencyCode").Value;
                //row[origEstPriceUnitId] = (cost.FirstOrDefault(r => r.Name == "OrigEstPriceUnitId") != null &&
                //            string.IsNullOrWhiteSpace(cost.FirstOrDefault(r => r.Name == "OrigEstPriceUnitId").Value))
                //            ? (object)DBNull.Value : cost.FirstOrDefault(r => r.Name == "OrigEstPriceUnitId").Value;
                //row[priceUnitId] = (cost.FirstOrDefault(r => r.Name == "PriceUnitId") != null &&
                //            string.IsNullOrWhiteSpace(cost.FirstOrDefault(r => r.Name == "PriceUnitId").Value))
                //            ? (object)DBNull.Value : cost.FirstOrDefault(r => r.Name == "PriceUnitId").Value;

                table.Rows.Add(row);
            }
            return table;
        }

        private static DataTable ToArrayTVP(IEnumerable<SectionDeprecated> childSections, string company)
        {
            var table = new DataTable();
            table.SetTypeName("[Trading].[UDTT_Section]");
            var sectionId = new DataColumn("[SectionId]", typeof(long));
            table.Columns.Add(sectionId);
            var companyId = new DataColumn("[CompanyId]", typeof(string));
            table.Columns.Add(companyId);
            var physicalContractId = new DataColumn("[PhysicalContractId]", typeof(long));
            table.Columns.Add(physicalContractId);
            var status = new DataColumn("[Status]", typeof(int));
            table.Columns.Add(status);
            var firstApprovalDateTime = new DataColumn("[FirstApprovalDateTime]", typeof(DateTime));
            table.Columns.Add(firstApprovalDateTime);
            var departmentId = new DataColumn("[DepartmentId]", typeof(long));
            table.Columns.Add(departmentId);
            var buyerCode = new DataColumn("[BuyerCode]", typeof(string));
            table.Columns.Add(buyerCode);
            var sellerCode = new DataColumn("[SellerCode]", typeof(string));
            table.Columns.Add(sellerCode);
            var commodityId = new DataColumn("[CommodityId]", typeof(long));
            table.Columns.Add(commodityId);
            var weightUnitId = new DataColumn("[WeightUnitId]", typeof(long));
            table.Columns.Add(weightUnitId);
            var portOriginCode = new DataColumn("[PortOriginCode]", typeof(string));
            table.Columns.Add(portOriginCode);
            var portDestinationCode = new DataColumn("[PortDestinationCode]", typeof(string));
            table.Columns.Add(portDestinationCode);
            var deliveryPeriodStart = new DataColumn("[DeliveryPeriodStart]", typeof(DateTime));
            table.Columns.Add(deliveryPeriodStart);
            var deliveryPeriodEnd = new DataColumn("[DeliveryPeriodEnd]", typeof(DateTime));
            table.Columns.Add(deliveryPeriodEnd);
            var positionMonthType = new DataColumn("[PositionMonthType]", typeof(int));
            table.Columns.Add(positionMonthType);
            var monthPositionIndex = new DataColumn("[MonthPositionIndex]", typeof(int));
            table.Columns.Add(monthPositionIndex);
            var price = new DataColumn("[Price]", typeof(decimal));
            table.Columns.Add(price);
            var bLDate = new DataColumn("[BLDate]", typeof(DateTime));
            table.Columns.Add(bLDate);
            //var allocatedTo = new DataColumn("[AllocatedTo]", typeof(long));
            //table.Columns.Add(allocatedTo);
            //var allocationDate = new DataColumn("[AllocationDate]", typeof(DateTime));
            //table.Columns.Add(allocationDate);
            var quantity = new DataColumn("[Quantity]", typeof(decimal));
            table.Columns.Add(quantity);
            var cropYear = new DataColumn("[CropYear]", typeof(int));
            table.Columns.Add(cropYear);
            var pricingMethodId = new DataColumn("[PricingMethodId]", typeof(int));
            table.Columns.Add(pricingMethodId);
            var contractTermCode = new DataColumn("[ContractTermCode]", typeof(string));
            table.Columns.Add(contractTermCode);
            var contractTermLocationCode = new DataColumn("[ContractTermLocationCode]", typeof(string));
            table.Columns.Add(contractTermLocationCode);
            var periodTypeId = new DataColumn("[PeriodTypeId]", typeof(int));
            table.Columns.Add(periodTypeId);
            var arbitrationCode = new DataColumn("[ArbitrationCode]", typeof(string));
            table.Columns.Add(arbitrationCode);
            var marketZoneCode = new DataColumn("[MarketSectorId]", typeof(long));
            table.Columns.Add(marketZoneCode);
            var paymentTermCode = new DataColumn("[PaymentTermCode]", typeof(string));
            table.Columns.Add(paymentTermCode);
            var currencyCode = new DataColumn("[CurrencyCode]", typeof(string));
            table.Columns.Add(currencyCode);
            var priceCode = new DataColumn("[PriceUnitid]", typeof(long));
            table.Columns.Add(priceCode);
            var originalQuantity = new DataColumn("[OriginalQuantity]", typeof(decimal));
            table.Columns.Add(originalQuantity);
            var sectionOriginId = new DataColumn("[SectionOriginId]", typeof(long));
            table.Columns.Add(sectionOriginId);
            var finalInvoiceRequired = new DataColumn("[FinalInvoiceRequired]", typeof(int));
            table.Columns.Add(finalInvoiceRequired);
            var counterpartyReference = new DataColumn("[CounterpartyCode]", typeof(string));
            table.Columns.Add(counterpartyReference);
            var contractedValue = new DataColumn("[ContractedValue]", typeof(decimal));
            table.Columns.Add(contractedValue);
            var memorandum = new DataColumn("[Memorandum]", typeof(string));
            table.Columns.Add(memorandum);
            var sectionNumberId = new DataColumn("[SectionNumberId]", typeof(string));
            table.Columns.Add(sectionNumberId);
            var otherReference = new DataColumn("[OtherReference]", typeof(string));
            table.Columns.Add(otherReference);
            var vesselCode = new DataColumn("[VesselCode]", typeof(string));
            table.Columns.Add(vesselCode);
            var premiumDiscountCurrency = new DataColumn("[PremiumDiscountCurrency]", typeof(string));
            table.Columns.Add(premiumDiscountCurrency);
            var estimatedMaturityDate = new DataColumn("[EstimatedMaturityDate]", typeof(DateTime));
            table.Columns.Add(estimatedMaturityDate);
            var provinceId = new DataColumn("[ProvinceId]", typeof(long));
            table.Columns.Add(provinceId);
            var branchId = new DataColumn("[BranchId]", typeof(long));
            table.Columns.Add(branchId);

            foreach (SectionDeprecated section in childSections)
            {
                var row = table.NewRow();
                row[sectionId] = section.SectionId;
                row[companyId] = company;
                row[physicalContractId] = section.ContractId;
                row[status] = section.Status;
                row[firstApprovalDateTime] = section.FirstApprovalTime.HasValue ? section.FirstApprovalTime : (object)DBNull.Value;
                row[departmentId] = section.DepartmentId.HasValue ? section.DepartmentId : (object)DBNull.Value;
                row[buyerCode] = section.BuyerCode;
                row[sellerCode] = section.SellerCode;
                row[commodityId] = section.CommodityId;
                row[weightUnitId] = section.WeightUnitId;
                row[portOriginCode] = section.PortOfOrigin;
                row[portDestinationCode] = section.PortOfDestination;
                row[deliveryPeriodStart] = section.DeliveryPeriodStartDate;
                row[deliveryPeriodEnd] = section.DeliveryPeriodEndDate;
                row[positionMonthType] = section.PositionMonthType;
                row[monthPositionIndex] = section.PositionMonthIndex;
                row[price] = section.Price;
                row[bLDate] = section.BlDate.HasValue ? section.BlDate : (object)DBNull.Value;
                //row[allocatedTo] = section.AllocatedToId.HasValue ? section.AllocatedToId : (object)DBNull.Value;
                //row[allocationDate] = section.AllocationDate.HasValue ? section.AllocationDate : (object)DBNull.Value;
                row[quantity] = section.Quantity;
                row[cropYear] = section.CropYear ?? (object)DBNull.Value;
                row[originalQuantity] = section.OriginalQuantity;
                row[currencyCode] = section.Currency;
                row[finalInvoiceRequired] = section.FinalInvoiceRequired;
                row[counterpartyReference] = section.CounterpartyReference;
                row[sectionOriginId] = section.SectionOriginId;
                row[pricingMethodId] = section.PricingMethod;
                row[paymentTermCode] = section.PaymentTerms;
                row[contractTermCode] = section.ContractTerms;
                row[contractTermLocationCode] = section.ContractTermsLocation;
                row[periodTypeId] = section.PeriodTypeId;
                row[priceCode] = section.PriceUnitId;
                row[arbitrationCode] = section.Arbitration;
                row[marketZoneCode] = section.MarketSectorId == 0 ? (object)DBNull.Value : section.MarketSectorId;
                row[contractedValue] = section.ContractedValue;
                row[memorandum] = section.Memorandum;
                row[sectionNumberId] = section.SectionNumber;
                row[otherReference] = section.OtherReference;
                row[vesselCode] = section.VesselCode;
                row[premiumDiscountCurrency] = string.Empty;
                row[estimatedMaturityDate] = section.EstimatedMaturityDate ?? (object)DBNull.Value;
                row[provinceId] = section.ProvinceId == null ? (object)DBNull.Value : section.ProvinceId;
                row[branchId] = section.BranchId == null ? (object)DBNull.Value : section.BranchId;
                table.Rows.Add(row);
            }

            return table;
        }

        private static class StoredProcedureNames
        {
            internal const string UpdateTradeContract = "[Trading].[usp_UpdatePhysicalContract]";
            internal const string CreateTradeContract = "[Trading].[usp_CreatePhysicalContract]";
            internal const string CreateTradeContractForImage = "[Trading].[usp_CreatePhysicalContractForImage]";
            internal const string FindTradeByContractLabel = "[Trading].[usp_GetPhysicalContractByContractLabel]";
            internal const string FindContractsToAssignByContractLabel = "[Trading].[usp_GetPhysicalSectionByContractLabel]";
            internal const string CreateFuturesOptionsTradeContract = "[Trading].[usp_CreateFuturesOptionsContract]";
            internal const string GetFOContracts = "[Trading].[usp_ListFuturesOptionsContracts]";
            internal const string CheckContractReferenceExistst = "[Trading].[usp_PhysicalContractReferenceExists]";
            internal const string CreateSection = "[Trading].[usp_CreateSection]";
            internal const string UpdateInvoiceMarking = "[Invoicing].[usp_UpdateInvoiceMarkingForSection]";
            internal const string GetLatestSectionNumber = "[Trading].[usp_GetLatestChildSection]";
            internal const string AddUpdatePhysicalContractInterCo = "[Trading].[usp_AddUpdatePhysicalContractInterCo]";
            internal const string DeletePhysicalContractInterCo = "[Trading].[usp_DeletePhysicalContractInterCo]";
            internal const string ValidateIntercoFields = "[Trading].[usp_ValidateInterCoFields]";
            internal const string UpdateTradesInBulk = "[Trading].[usp_UpdateTradesInBulk]";
        }
    }
}