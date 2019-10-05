using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.MasterData.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Commands
{
    internal static class PhysicalContractCommonRules
    {
        internal static async Task ValidatePhysicalContract(CreatePhysicalFixedPricedContractCommand command, IIdentityService identityService, IMasterDataService masterDataService, IUserService userService, ISystemDateTimeService systemDateTimeService)
        {
            // department
            var departments = await masterDataService.GetDepartmentsAsync(command.CompanyId);

            if (!departments.Any(d => d.DepartmentId == command.DepartmentId))
            {
                throw new AtlasBusinessException($"The department {command.DepartmentId} does not belong to the {command.CompanyId} company.");
            }

            // trader
            if (command.TraderId != null)
            {
                var trader = await userService.GetUserByIdAsync(command.TraderId.Value);

                if (trader == null && !command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "TraderId").IsMandatory)
                {
                    throw new NotFoundException("User", command.TraderId);
                }
            }

            // counterparties - buyer and seller
            var counterparties = await masterDataService.GetCounterpartiesAsync(command.CompanyId);

            if (!counterparties.Any(c => c.CounterpartyCode == command.BuyerCode) && command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "BuyerId").IsMandatory)
            {
                throw new AtlasBusinessException($"The buyer {command.BuyerCode} does not belong to the {command.CompanyId} company.");
            }

            if (!counterparties.Any(c => c.CounterpartyCode == command.SellerCode) && command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "SellerId").IsMandatory)
            {
                throw new AtlasBusinessException($"The seller {command.SellerCode} does not belong to the {command.CompanyId} company.");
            }

            // commodity
            var commodities = await masterDataService.GetCommoditiesAsync(command.CompanyId);

            if (!commodities.Any(c => c.CommodityId == command.CommodityId) && command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "CommodityId").IsMandatory)
            {
                throw new AtlasBusinessException($"The commodity {command.CommodityId} does not belong to the {command.CompanyId} company.");
            }

            // quantity code
            var weightUnits = await masterDataService.GetWeightUnitsAsync(command.CompanyId);

            if (!weightUnits.Any(w => w.WeightUnitId == command.WeightUnitId) && command.FieldsConfigurations.DefaultIfEmpty().FirstOrDefault(field => field?.DisplayName == "WeightUnitId").IsMandatory)
            {
                throw new AtlasBusinessException($"The quantity code {command.WeightUnitId} does not belong to the {command.CompanyId} company.");
            }

            // contract term
            var contractTerms = await masterDataService.GetContractTermsAsync(command.CompanyId);

            if (!contractTerms.Any(c => c.ContractTermCode == command.ContractTerms) && command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "ContractTermId").IsMandatory)
            {
                throw new AtlasBusinessException($"The contract term {command.ContractTerms} does not belong to the {command.CompanyId} company.");
            }

            // port term
            var ports = await masterDataService.GetPortsAsync(command.CompanyId);

            if (!ports.Any(p => p.PortCode == command.ContractTermsLocation) && command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "ContractTermLocationId").IsMandatory)
            {
                throw new AtlasBusinessException($"The port term {command.ContractTermsLocation} does not belong to the {command.CompanyId} company.");
            }

            // port of origin
            if (command.PortOfOrigin != null)
            {
                if (!ports.Any(p => p.PortCode == command.PortOfOrigin))
                {
                    throw new AtlasBusinessException($"The port of origin {command.PortOfOrigin} does not belong to the {command.CompanyId} company.");
                }
            }

            // port of destination
            if (command.PortOfDestination != null)
            {
                if (!ports.Any(p => p.PortCode == command.PortOfDestination))
                {
                    throw new AtlasBusinessException($"The port of destination {command.PortOfDestination} does not belong to the {command.CompanyId} company.");
                }
            }

            // arbitration
            if (command.Arbitration != null)
            {
                var arbitrations = await masterDataService.GetArbitrationsAsync(command.CompanyId);

                if (!arbitrations.Any(a => a.ArbitrationCode == command.Arbitration))
                {
                    throw new AtlasBusinessException($"The arbitration {command.Arbitration} does not belong to the {command.CompanyId} company.");
                }
            }

            // currency
            var currencies = await masterDataService.GetCurrenciesAsync();

            if (!currencies.Any(c => c.CurrencyCode == command.CurrencyCode) && command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "CurrencyCode").IsMandatory)
            {
                throw new AtlasBusinessException($"The currency {command.CurrencyCode} does not belong to the {command.CompanyId} company.");
            }

            // price code
            var priceUnits = await masterDataService.GetPriceUnitsAsync(command.CompanyId);

            if (!priceUnits.Any(p => p.PriceUnitId == command.PriceUnitId) && command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "PricingMethodId").IsMandatory)
            {
                throw new AtlasBusinessException($"The price code {command.PriceUnitId} does not belong to the {command.CompanyId} company.");
            }

            // payment term
            var paymentTerms = await masterDataService.GetPaymentTermsAsync(command.CompanyId);

            if (!paymentTerms.Any(p => p.PaymentTermsCode == command.PaymentTerms) && command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "PaymentTermId").IsMandatory)
            {
                throw new AtlasBusinessException($"The payment term {command.PaymentTerms} does not belong to the {command.CompanyId} company.");
            }

            // period type
            var periodTypes = await masterDataService.GetPeriodTypesAsync(command.CompanyId);

            if (!periodTypes.Any(p => p.PeriodTypeId == command.PeriodTypeId) && command.FieldsConfigurations.FirstOrDefault(field => field?.DisplayName == "PeriodTypeId").IsMandatory)
            {
                throw new AtlasBusinessException($"The period type {command.PeriodTypeId} does not belong to the {command.CompanyId} company.");
            }
        }
    }
}
