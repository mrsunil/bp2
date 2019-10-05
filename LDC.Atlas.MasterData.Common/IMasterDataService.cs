using LDC.Atlas.MasterData.Common.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.MasterData.Common
{
    public interface IMasterDataService
    {
        Task<IEnumerable<Arbitration>> GetArbitrationsAsync(string companyId);

        Task<IEnumerable<Commodity>> GetCommoditiesAsync(string companyId, Commodity commodity = null, int? offset = null, int? limit = null);

        Task<IEnumerable<CommodityType>> GetCommodityTypeAsync();

        Task<IEnumerable<Company>> GetCompaniesAsync();

        Task<IEnumerable<ContractTerm>> GetContractTermsAsync(string companyId);

        Task<IEnumerable<CostType>> GetCostTypesAsync(string companyId);

        Task<IEnumerable<Counterparty>> GetCounterpartiesAsync(string companyId, string counterpartyCode = null, int? offset = null, int? limit = null);

        Task<IEnumerable<Counterparty>> GetCounterpartiesByPricingMethodAndDealTypeAsync(string companyId, PricingMethod pricingMethod, DealType dealType);

        Task<IEnumerable<Country>> GetCountriesAsync();

        Task<IEnumerable<Currency>> GetCurrenciesAsync();

        Task<IEnumerable<Department>> GetDepartmentsAsync(string companyId, string departmentCode = null, int? offset = null, int? limit = null);

        Task<IEnumerable<FxRate>> GetFxRatesAsync(DateTime? fxRateDate, string viewMode = FxRateViewMode.Spot);

        Task<IEnumerable<InvoiceType>> GetInvoiceTypesAsync();

        Task<IEnumerable<MarketSector>> GetMarketSectorsAsync(string companyId);

        Task<IEnumerable<NominalAccount>> GetNominalAccountsAsync(string company);

        Task<IEnumerable<PaymentTerms>> GetPaymentTermsAsync(string companyId, string paymentTermCode = null, int? offset = null, int? limit = null);

        Task<IEnumerable<PeriodType>> GetPeriodTypesAsync(string companyId);

        Task<IEnumerable<Port>> GetPortsAsync(string companyId, string portCode = null, int? offset = null, int? limit = null);

        Task<IEnumerable<PriceUnit>> GetPriceUnitsAsync(string companyId);

        Task<IEnumerable<ProfitCenter>> GetAProfitCentersAsync(string companyId);

        Task<IEnumerable<Province>> GetProvincesAsync();

        Task<IEnumerable<Region>> GetRegionsAsync();

        Task<IEnumerable<ShippingStatus>> GetShippingStatusAsync(string companyId);

        Task<IEnumerable<TransportType>> GetTransportTypesAsync(string companyId);

        Task<IEnumerable<Vat>> GetVatsAsync(string companyId);

        Task<IEnumerable<Vessel>> GetVesselsAsync(string companyId);

        Task<IEnumerable<WeightUnit>> GetWeightUnitsAsync(string companyId);

        Task<Company> GetCompanyByIdAsync(string companyId);

        Task<FxRate> GetFxRateAsync(DateTime fxRateDate, string currencyCode);

        Task<IEnumerable<Vat>> GetVat(IEnumerable<string> vatCode, string companyId);

        Task<IEnumerable<Company>> GetAllByCounterpartyIdAsync(string companyId, string counterpartyCode);

        Task<IEnumerable<FxTradeType>> GetFxTradeTypes(string companyId);

        Task<NominalAccount> GetNominalAccountsById(long nominalAccountId, string company);

        Task<IEnumerable<AccountLineTypes>> GetAllAsync();

        Task<IEnumerable<CharterManager>> GetCharterManagersAsync(string[] companyId);

    }
}
