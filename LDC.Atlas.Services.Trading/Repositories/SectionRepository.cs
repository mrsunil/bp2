using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.Trading.Application.Queries.Dto;
using LDC.Atlas.Services.Trading.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Repositories
{
    public class SectionRepository : BaseRepository, ISectionRepository
    {
        public SectionRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                typeof(SectionDeprecated),
                new ColumnAttributeTypeMapper<SectionDeprecated>());
            SqlMapper.SetTypeMap(
                typeof(Trade<ISection>),
                new ColumnAttributeTypeMapper<Trade<ISection>>());
            SqlMapper.SetTypeMap(
                typeof(FixingFamily),
                new ColumnAttributeTypeMapper<FixingFamily>());
            SqlMapper.SetTypeMap(
                typeof(FixingDetails),
                new ColumnAttributeTypeMapper<FixingDetails>());
            SqlMapper.SetTypeMap(
                typeof(Section),
                new ColumnAttributeTypeMapper<Section>());
        }

        public async Task ApproveSectionAsync(long sectionId, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@sectionId ", sectionId);
            queryParameters.Add("@companyId", company);

            await ExecuteNonQueryAsync(StoredProcedureNames.ApproveSection, queryParameters, true);
        }

        public async Task<SectionReference> CreateSplitForContract(string company, Section section, bool reduceContractedValue = false)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@SectionDetails", ToArrayTVP(section, company));
            queryParameters.Add("@SectionTypeId", (int)SectionType.Split);
            queryParameters.Add("@IsTradeImage", reduceContractedValue);
            queryParameters.Add(DataVersionIdParameter, null);

            var sec = await ExecuteQueryAsync<Section>(
                    StoredProcedureNames.CreateSection,
                    queryParameters,
                   true);

            SectionReference reference = null;
            if (sec.FirstOrDefault() != null)
            {
                reference = new SectionReference
                {
                    ContractLabel = sec.FirstOrDefault().ContractLabel,
                    SectionId = sec.FirstOrDefault().SectionId,
                    SectionOriginId = sec.FirstOrDefault().SectionOriginId,
                    Quantity = sec.FirstOrDefault().Quantity
                };
            }

            return reference;
        }

        public async Task<Section> GetSectionById(long sectionId, string company, long? dataVersionId)
        {
            Section section;
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@SectionId", sectionId);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add(DataVersionIdParameter, dataVersionId);

            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetSectionById, queryParameters, true))
            {
                // Skip the first resultset
                _ = (await grid.ReadAsync<PhysicalContract>()).FirstOrDefault();
                section = (await grid.ReadAsync<Section>()).FirstOrDefault();
            }

            return section;
        }

        public async Task<SectionTrafficDto> LoadSectionTraffic(long sectionId, string companyId, long? dataVersionId) {
            SectionTrafficDto sectionTraffic;
            var queryParameters = new DynamicParameters();
            queryParameters.Add(DataVersionIdParameter, dataVersionId); // name of parameters ?
            queryParameters.Add("@SectionId",sectionId);
            queryParameters.Add("@CompanyId",companyId);
            sectionTraffic = await ExecuteQueryFirstOrDefaultAsync<SectionTrafficDto>(StoredProcedureNames.GetSectionTrafficDetails, queryParameters, true);
            return sectionTraffic;
        }

        public async Task UpdateSectionTraffic(IEnumerable<SectionTrafficDto> listSectionsTraffic, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@SectionTrafficList", ToArrayTVPVessel(listSectionsTraffic));
            queryParameters.Add("@CompanyId", company);
            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateSectionTraffic, queryParameters, true);
        }

        private DataTable ToArrayTVPVessel(IEnumerable<SectionTrafficDto> values)
        {
            var table = new DataTable();
            table.SetTypeName("[Logistic].[UDTT_SectionTraffic]");

            var sectionId = new DataColumn("[SectionId]", typeof(long));
            table.Columns.Add(sectionId);

            var dataVersionId = new DataColumn("[DataVersionId]", typeof(int));
            table.Columns.Add(dataVersionId);

            var blDate = new DataColumn("[BlDate]", typeof(DateTime));
            table.Columns.Add(blDate);

            var bLRef = new DataColumn("[BLReference]", typeof(string));
            table.Columns.Add(bLRef);

            var vessel = new DataColumn("[VesselCode]", typeof(string));
            table.Columns.Add(vessel);

            var contextInformation = new DataColumn("[ContextInformation]", typeof(string));
            table.Columns.Add(contextInformation);

            var portOrigin = new DataColumn("[PortOriginCode]", typeof(string));
            table.Columns.Add(portOrigin);

            var portDestination = new DataColumn("[PortDestinationCode]", typeof(string));
            table.Columns.Add(portDestination);

            var shippingStatusCode = new DataColumn("[ShippingStatusCode]", typeof(string));
            table.Columns.Add(shippingStatusCode);


            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();
                    row[sectionId] = value.SectionId;
                    row[blDate] = value.BLDate.HasValue ? value.BLDate : (object)DBNull.Value;
                    row[bLRef] = value.BLReference;
                    row[vessel] = value.VesselCode;
                    row[shippingStatusCode] = value.ShippingStatusCode;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        public async Task UnapproveSectionAsync(long sectionId, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@SectionId ", sectionId);
            queryParameters.Add("@CompanyId", company);

            await ExecuteNonQueryAsync(StoredProcedureNames.UnapproveSection, queryParameters, true);
        }

        public async Task DeleteSectionAsync(long[] sectionIds, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@SectionIds", AddValuesToUDTTSection(sectionIds, "[dbo].[UDTT_BigIntList]"));
            queryParameters.Add("@CompanyId", company);
            await ExecuteNonQueryAsync(StoredProcedureNames.DeleteSection, queryParameters, true);
        }

        public async Task CloseSectionAsync(long[] sectionIds, string company, long? dataVersionId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@SectionIds", AddValuesToUDTTSection(sectionIds, "[dbo].[UDTT_BigIntList]"));
            queryParameters.Add("@DataVersionId", dataVersionId);
            queryParameters.Add("@CompanyId", company);
            await ExecuteNonQueryAsync(StoredProcedureNames.CloseSection, queryParameters, true);
        }

        public async Task OpenSectionAsync(long[] sectionIds, string company, long? dataVersionId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@SectionIds", AddValuesToUDTTSection(sectionIds, "[dbo].[UDTT_BigIntList]"));
            queryParameters.Add("@DataVersionId", dataVersionId);
            queryParameters.Add("@CompanyId", company);
            await ExecuteNonQueryAsync(StoredProcedureNames.OpenSection, queryParameters, true);
        }

        public async Task CancelSectionAsync(long[] sectionIds, string company, DateTime blDate)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@SectionIds", AddValuesToUDTTSection(sectionIds, "[dbo].[UDTT_BigIntList]"));
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@BLDate", blDate);
            await ExecuteNonQueryAsync(StoredProcedureNames.CancelSection, queryParameters, true);
        }

        public async Task UnCancelSectionAsync(long[] sectionIds, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@SectionIds", AddValuesToUDTTSection(sectionIds, "[dbo].[UDTT_BigIntList]"));
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@ContextInformation", null);
            await ExecuteNonQueryAsync(StoredProcedureNames.UnCancelSection, queryParameters, true);
        }

        private static DataTable ToArrayTVP(Section section, string company)
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
            var contractedValue = new DataColumn("[ContractedValue]", typeof(int));
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

            var row = table.NewRow();
            row[sectionId] = section.SectionId;
            row[companyId] = company;
            row[physicalContractId] = section.PhysicalContractId;
            row[status] = section.ContractStatusCode;
            row[firstApprovalDateTime] = section.FirstApprovalDateTime.HasValue ? section.FirstApprovalDateTime : (object)DBNull.Value;
            row[departmentId] = section.DepartmentId;
            row[buyerCode] = section.BuyerCode;
            row[sellerCode] = section.SellerCode;
            row[commodityId] = section.CommodityId;
            row[weightUnitId] = section.WeightUnitId;
            row[portOriginCode] = section.PortOriginCode;
            row[portDestinationCode] = section.PortDestinationCode;
            row[deliveryPeriodStart] = section.DeliveryPeriodStartDate;
            row[deliveryPeriodEnd] = section.DeliveryPeriodEndDate;
            row[positionMonthType] = section.PositionMonthType;
            row[monthPositionIndex] = section.MonthPositionIndex;
            row[price] = section.Price;
            row[bLDate] = section.BlDate.HasValue ? section.BlDate : (object)DBNull.Value;
            row[quantity] = section.Quantity;
            row[cropYear] = section.CropYear.HasValue ? section.CropYear : (object)DBNull.Value;
            row[originalQuantity] = section.OriginalQuantity;
            row[currencyCode] = section.CurrencyCode;
            row[finalInvoiceRequired] = section.FinalInvoiceRequired;
            row[counterpartyReference] = section.Counterparty;
            row[sectionOriginId] = section.SectionOriginId;
            row[pricingMethodId] = section.PricingMethodId;
            row[paymentTermCode] = section.PaymentTermCode;
            row[contractTermCode] = section.ContractTermCode;
            row[contractTermLocationCode] = section.ContractTermLocationCode;
            row[periodTypeId] = section.PeriodTypeId;
            row[priceCode] = section.PriceUnitId;
            row[arbitrationCode] = section.ArbitrationCode;
            row[marketZoneCode] = (section.MarketSectorId == null || section.MarketSectorId == 0) ? (object)DBNull.Value : section.MarketSectorId;
            row[contractedValue] = section.ContractedValue;
            row[memorandum] = section.Memorandum;
            row[sectionNumberId] = section.SectionNumberId;
            row[otherReference] = section.OtherReference;
            row[vesselCode] = section.VesselCode;
            row[premiumDiscountCurrency] = string.Empty;
            row[estimatedMaturityDate] = section.EstimatedMaturityDate ?? (object)DBNull.Value;
            row[provinceId] = section.ProvinceId == null ? (object)DBNull.Value : section.ProvinceId;
            row[branchId] = section.BranchId == null ? (object)DBNull.Value : section.BranchId;
            table.Rows.Add(row);

            return table;
        }

        private static DataTable ToArrayBulkApprovalTVP(long[] sectionIds)
        {
            var table = new DataTable();
            table.SetTypeName("[Trading].[UDTT_BulkAmendment]");
            var sectionId = new DataColumn("[SectionId]", typeof(long));
            table.Columns.Add(sectionId);
            for (int sectioncount = 0; sectioncount < sectionIds.Length; sectioncount++)
            {
                var row = table.NewRow();
                row[sectionId] = sectionIds[sectioncount];
                table.Rows.Add(row);
            }

            return table;
        }

        public async Task UpdateBulkApproval(string companyId, long[] sectionIds)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add("@DataversionId", null);
            queryParameters.Add("@SectionDetails", ToArrayBulkApprovalTVP(sectionIds));
            await ExecuteNonQueryAsync(StoredProcedureNames.BulkapproveSection, queryParameters, true);
        }

        public async Task DeleteTradeFavoriteAsync(long tradeFavoriteId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@FavoriteTradeId", tradeFavoriteId);

            await ExecuteNonQueryAsync(StoredProcedureNames.DeleteTradeFavorite, queryParameters, true);
        }

        public async Task<long> CreateTradeFavouriteAsync(TradeFavoriteDetail tradeFavorite, string companyId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@FavoriteTrade", FavouriteTradeUDTT(tradeFavorite));
            queryParameters.Add("@FavoriteTradeCost", FavouriteTradeCostUDTT(tradeFavorite));
            queryParameters.Add("@CompanyId", companyId);

            var tradeFavoriteId = await ExecuteQueryFirstOrDefaultAsync<long>(StoredProcedureNames.CreateFavouriteTrade, queryParameters, true);            
            return tradeFavoriteId;
        }

        public static DataTable FavouriteTradeCostUDTT(TradeFavoriteDetail tradeFavorite)
        {
            DataTable tablecost = new DataTable();
            tablecost.SetTypeName("[Trading].[UDTT_FavoriteTradeCost]");
            DataColumn costTypeId = new DataColumn("[CostTypeId]", typeof(long));
            tablecost.Columns.Add(costTypeId);
            DataColumn supplierId = new DataColumn("[SupplierId]", typeof(string));
            tablecost.Columns.Add(supplierId);
            DataColumn costDirectionId = new DataColumn("[CostDirectionId]", typeof(long));
            tablecost.Columns.Add(costDirectionId);
            DataColumn currencyCode = new DataColumn("[CurrencyCode]", typeof(string));
            tablecost.Columns.Add(currencyCode);
            DataColumn rateTypeId = new DataColumn("[RateTypeId]", typeof(long));
            tablecost.Columns.Add(rateTypeId);
            DataColumn priceUnitId = new DataColumn("[PriceUnitId]", typeof(string));
            tablecost.Columns.Add(priceUnitId);
            DataColumn rate = new DataColumn("[Rate]", typeof(long));
            tablecost.Columns.Add(rate);
            DataColumn inPL = new DataColumn("[InPL]", typeof(string));
            tablecost.Columns.Add(inPL);
            DataColumn noAction = new DataColumn("[NoAction]", typeof(long));
            tablecost.Columns.Add(noAction);
            DataColumn narrative = new DataColumn("[Narrative]", typeof(string));
            tablecost.Columns.Add(narrative);
            DataColumn costMatrixName = new DataColumn("[CostMatrixName]", typeof(string));
            tablecost.Columns.Add(costMatrixName);
            DataColumn origEstPMT = new DataColumn("[OrigEstPMT]", typeof(string));
            tablecost.Columns.Add(origEstPMT);
            DataColumn origEstRateTypeId = new DataColumn("[OrigEstRateTypeId]", typeof(string));
            tablecost.Columns.Add(origEstRateTypeId);
            DataColumn origEstPriceUnitId = new DataColumn("[OrigEstPriceUnitId]", typeof(long));
            tablecost.Columns.Add(origEstPriceUnitId);
            DataColumn origEstCurrencyCode = new DataColumn("[OrigEstCurrencyCode]", typeof(string));
            tablecost.Columns.Add(origEstCurrencyCode);
            DataColumn origEstRate = new DataColumn("[OrigEstRate]", typeof(long));
            tablecost.Columns.Add(origEstRate);
            if (tradeFavorite.Costs != null && tradeFavorite.Costs.ToList().Count > 0)
            {
                tradeFavorite.Costs.ToList().ForEach(cost =>
                {
                    var row = tablecost.NewRow();
                    row[costTypeId] = cost.CostTypeId ?? (object)DBNull.Value;
                    row[supplierId] = cost.SupplierId ?? (object)DBNull.Value;
                    row[costDirectionId] = cost.CostDirectionId;
                    row[currencyCode] = cost.CurrencyCode;
                    row[rateTypeId] = cost.RateTypeId;
                    row[priceUnitId] = cost.PriceUnitId;
                    row[rate] = cost.Rate;
                    row[inPL] = cost.InPL;
                    row[noAction] = cost.NoAction;
                    row[narrative] = cost.Narrative;
                    row[costMatrixName] = cost.CostMatrixName ?? (object)DBNull.Value;
                    row[origEstPMT] = cost.OriginalEstimatedPMTValue;
                    row[origEstRateTypeId] = cost.OriginalEstRateTypeId;
                    row[origEstPriceUnitId] = cost.OriginalEstPriceUnitId ?? (object)DBNull.Value;
                    row[origEstCurrencyCode] = cost.OriginalEstCurrencyCode;
                    row[origEstRate] = cost.OriginalEstRate ?? (object)DBNull.Value;
                    tablecost.Rows.Add(row);
                });
            }

            return tablecost;
        }

        public static DataTable FavouriteTradeUDTT(TradeFavoriteDetail tradeFavorite)
        {
            DataTable table = new DataTable();
            table.SetTypeName("[Trading].[UDTT_FavoriteTrade]");
            DataColumn name = new DataColumn("[Name]", typeof(string));
            table.Columns.Add(name);
            DataColumn description = new DataColumn("[Description]", typeof(string));
            table.Columns.Add(description);
            DataColumn contractTypeId = new DataColumn("[ContractTypeId]", typeof(long));
            table.Columns.Add(contractTypeId);
            DataColumn departmentId = new DataColumn("[DepartmentId]", typeof(long));
            table.Columns.Add(departmentId);
            DataColumn traderId = new DataColumn("[TraderId]", typeof(long));
            table.Columns.Add(traderId);
            DataColumn buyerId = new DataColumn("[BuyerId]", typeof(long));
            table.Columns.Add(buyerId);
            DataColumn sellerId = new DataColumn("[SellerId]", typeof(long));
            table.Columns.Add(sellerId);
            DataColumn counterparty = new DataColumn("[Counterparty]", typeof(string));
            table.Columns.Add(counterparty);
            DataColumn commodityId = new DataColumn("[CommodityId]", typeof(long));
            table.Columns.Add(commodityId);
            DataColumn cropYear = new DataColumn("[CropYear]", typeof(int));
            table.Columns.Add(cropYear);
            DataColumn weightUnitId = new DataColumn("[WeightUnitId]", typeof(long));
            table.Columns.Add(weightUnitId);
            DataColumn quantity = new DataColumn("[Quantity]", typeof(decimal));
            table.Columns.Add(quantity);
            DataColumn pricingMethodId = new DataColumn("[PricingMethodId]", typeof(int));
            table.Columns.Add(pricingMethodId);
            DataColumn priceCurrency = new DataColumn("[PriceCurrency]", typeof(string));
            table.Columns.Add(priceCurrency);
            DataColumn priceUnitId = new DataColumn("[PriceUnitId]", typeof(long));
            table.Columns.Add(priceUnitId);
            DataColumn price = new DataColumn("[Price]", typeof(decimal));
            table.Columns.Add(price);
            DataColumn paymentTermId = new DataColumn("[PaymentTermId]", typeof(long));
            table.Columns.Add(paymentTermId);
            DataColumn premiumDiscountValue = new DataColumn("[PremiumDiscountValue]", typeof(decimal));
            table.Columns.Add(premiumDiscountValue);
            DataColumn contractTermId = new DataColumn("[ContractTermId]", typeof(long));
            table.Columns.Add(contractTermId);
            DataColumn contractTermLocationId = new DataColumn("[ContractTermLocationId]", typeof(long));
            table.Columns.Add(contractTermLocationId);
            DataColumn arbitrationId = new DataColumn("[ArbitrationId]", typeof(int));
            table.Columns.Add(arbitrationId);
            DataColumn periodTypeId = new DataColumn("[PeriodTypeId]", typeof(int));
            table.Columns.Add(periodTypeId);
            DataColumn deliveryPeriodStart = new DataColumn("[DeliveryPeriodStart]", typeof(DateTime));
            table.Columns.Add(deliveryPeriodStart);
            DataColumn deliveryPeriodEnd = new DataColumn("[DeliveryPeriodEnd]", typeof(DateTime));
            table.Columns.Add(deliveryPeriodEnd);
            DataColumn positionMonthType = new DataColumn("[PositionMonthType]", typeof(int));
            table.Columns.Add(positionMonthType);
            DataColumn portOriginId = new DataColumn("[PortOriginId]", typeof(long));
            table.Columns.Add(portOriginId);
            DataColumn portDestinationId = new DataColumn("[PortDestinationId]", typeof(long));
            table.Columns.Add(portDestinationId);
            DataColumn marketSectorId = new DataColumn("[MarketSectorId]", typeof(long));
            table.Columns.Add(marketSectorId);
            DataColumn memorandum = new DataColumn("[Memorandum]", typeof(string));
            table.Columns.Add(memorandum);
            DataColumn contractedValue = new DataColumn("[ContractedValue]", typeof(decimal));
            table.Columns.Add(contractedValue);
            var row = table.NewRow();
            row[name] = tradeFavorite.Name;
            row[description] = tradeFavorite.Description;
            row[contractTypeId] = (int)tradeFavorite.ContractType;
            row[departmentId] = (tradeFavorite.DepartmentId != null) ? tradeFavorite.DepartmentId : (object)DBNull.Value;
            row[traderId] = (tradeFavorite.TraderId != null) ? tradeFavorite.TraderId : (object)DBNull.Value;
            row[buyerId] = tradeFavorite.BuyerId;
            row[sellerId] = tradeFavorite.SellerId;
            row[counterparty] = tradeFavorite.CounterpartyReference;
            row[commodityId] = tradeFavorite.CommodityId;
            row[cropYear] = tradeFavorite.CropYear;
            row[weightUnitId] = tradeFavorite.WeightUnitId;
            row[quantity] = tradeFavorite.Quantity;
            row[pricingMethodId] = (int)tradeFavorite.PricingMethod;
            row[priceCurrency] = tradeFavorite.Currency;
            row[priceUnitId] = tradeFavorite.PriceUnitId;
            row[price] = tradeFavorite.Price;
            row[paymentTermId] = tradeFavorite.PaymentTermsId;
            row[premiumDiscountValue] = tradeFavorite.PremiumDiscountValue;
            row[contractTermId] = tradeFavorite.ContractTermId;
            row[contractTermLocationId] = tradeFavorite.ContractTermLocationId ?? (object)DBNull.Value;
            row[arbitrationId] = tradeFavorite.ArbitrationId;
            row[periodTypeId] = tradeFavorite.PeriodTypeId;
            row[deliveryPeriodStart] = tradeFavorite.DeliveryPeriodStartDate ?? (object)DBNull.Value;
            row[deliveryPeriodEnd] = tradeFavorite.DeliveryPeriodEndDate ?? (object)DBNull.Value;
            row[positionMonthType] = tradeFavorite.PositionMonthType;
            row[portOriginId] = tradeFavorite.OriginPortId ?? (object)DBNull.Value;
            row[portDestinationId] = tradeFavorite.DestinationPortId ?? (object)DBNull.Value;
            row[marketSectorId] = tradeFavorite.MarketSectorId ?? (object)DBNull.Value;
            row[memorandum] = tradeFavorite.Memorandum;
            row[contractedValue] = tradeFavorite.ContractedValue;
            table.Rows.Add(row);
            return table;
        }

        private static DataTable AddValuesToUDTTSection(long[] sectionIds, string typeName)
        {
            var table = new DataTable();
            table.SetTypeName(typeName);

            var sectionId = new DataColumn("SectionId", typeof(long));
            table.Columns.Add(sectionId);

            if (sectionIds != null)
            {
                foreach (var value in sectionIds)
                {
                    var row = table.NewRow();
                    row[sectionId] = value;

                    table.Rows.Add(row);
                }
            }

            return table;
        }

        private static DataTable ToArrayTvp(IEnumerable<long> values)
        {
            var table = new DataTable();
            table.SetTypeName("[dbo].[UDTT_BigIntList]");

            var sectionId = new DataColumn("Value", typeof(long));
            table.Columns.Add(sectionId);

            if (values != null)
            {
                foreach (var value in values)
                {
                    var row = table.NewRow();
                    row[sectionId] = value;
                    table.Rows.Add(row);
                }
            }

            return table;
        }

        public async Task AssignSectionsToCharterAsync(long? charterId, IEnumerable<long> sectionsId, string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CharterID", charterId);
            queryParameters.Add("@sectionIds", ToArrayTvp(sectionsId));
            queryParameters.Add("@companyId", company);

            await ExecuteNonQueryAsync(StoredProcedureNames.AssignSectionsToCharter, queryParameters, true);
        }

        private static class StoredProcedureNames
        {
            internal const string ApproveSection = "[Trading].[usp_UpdateApproveSection]";
            internal const string GetSectionById = "[Trading].[usp_GetSectionById]";
            internal const string CreateSection = "[Trading].[usp_CreateSection]";
            internal const string UnapproveSection = "[Trading].[usp_UpdateUnapproveSection]";
            internal const string UpdateSectionStatus = "[Trading].[usp_UpdateSectionStatus]";
            internal const string BulkapproveSection = "[Trading].[usp_UpdateBulkApproveSection]";
            internal const string DeleteTradeFavorite = "[Trading].[usp_DeleteTradeFavorite]";
            internal const string CreateFavouriteTrade = "[Trading].[usp_CreateFavoriteTrade]";
            internal const string GetSectionTrafficDetails = "[Logistic].[usp_GetSectionTraffic]";
            internal const string UpdateSectionTraffic = "[Logistic].[usp_UpdateSectionTraffic]";
            internal const string AssignSectionsToCharter = "[Logistic].[usp_AssignSectionToCharter]";

            internal const string DeleteSection = "[Trading].[usp_DeleteSection]";
            internal const string CloseSection = "[Trading].[usp_CloseSection]";
            internal const string OpenSection = "[Trading].[usp_OpenSection]";
            internal const string CancelSection = "[Trading].[usp_CancelSection]";
            internal const string UnCancelSection = "[Trading].[usp_UncancelSection]";
        }
    }
}
