using LDC.Atlas.MasterData.Common.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.MasterData.Common.Repositories
{
    public interface IMasterDataRepository
    {
        Task<IEnumerable<Arbitration>> GetArbitrationsAsync(string company);

        Task<IEnumerable<Commodity>> GetCommoditiesAsync(string company, Commodity commodity = null, int? offset = null, int? limit = null);

        Task<IEnumerable<CommodityType>> GetCommodityTypeAsync();

        Task<IEnumerable<Company>> GetCompaniesAsync();

        Task<IEnumerable<ContractTerm>> GetContractTermsAsync(string company);

        Task<IEnumerable<CostType>> GetCostTypesAsync(string company);

        Task<IEnumerable<Counterparty>> GetCounterpartiesAsync(string company, string counterpartyCode = null, int? offset = null, int? limit = null);

        Task<IEnumerable<Counterparty>> GetCounterpartiesByPricingMethodAndDealTypeAsync(string company, PricingMethod pricingMethod, DealType dealType);

        Task<IEnumerable<Country>> GetCountriesAsync();

        Task<IEnumerable<Currency>> GetCurrenciesAsync();

        Task<IEnumerable<Department>> GetDepartmentsAsync(string company, string departmentCode = null, int? offset = null, int? limit = null);

        Task<IEnumerable<FxRateRecord>> GetFxRatesAsync(DateTime? fxRateDate, string viewMode);

        Task<IEnumerable<InvoiceType>> GetInvoiceTypesAsync();

        Task<IEnumerable<MarketSector>> GetMarketSectorsAsync(string companyId);

        Task<IEnumerable<NominalAccount>> GetNominalAccountsAsync(string company);

        Task<IEnumerable<PaymentTerms>> GetPaymentTermsAsync(string company, string paymentTermCode = null, int? offset = null, int? limit = null);

        Task<IEnumerable<PeriodType>> GetPeriodTypesAsync(string company);

        Task<IEnumerable<Port>> GetPortsAsync(string company, string portCode = null, int? offset = null, int? limit = null);

        Task<IEnumerable<PriceUnit>> GetPriceUnitsAsync(string company);

        Task<IEnumerable<ProfitCenter>> GetProfitCentersAsync(string company);

        Task<IEnumerable<Province>> GetProvincesAsync();

        Task<IEnumerable<Region>> GetRegionsAsync();

        Task<IEnumerable<ShippingStatus>> GetShippingStatusAsync(string company);

        Task<IEnumerable<TransportType>> GetTransportTypesAsync(string companyId);

        Task<IEnumerable<Vat>> GetVatsAsync(string company);

        Task<IEnumerable<Vessel>> GetVesselsAsync(string company);

        Task<IEnumerable<WeightUnit>> GetWeightUnitsAsync(string company);

        Task<Company> GetCompanyByIdAsync(string companyId);

        Task<FxRate> GetFxRateAsync(DateTime fxRateDate, string currencyCode);

        Task<IEnumerable<Vat>> GetVatAsync(IEnumerable<string> vatCode, string companyId);

        Task<IEnumerable<Company>> GetAllByCounterpartyIdAsync(string companyId, string counterpartyCode);

        Task<IEnumerable<FxTradeType>> GetFxTradeTypesAsync(string companyId);

        Task<NominalAccount> GetNominalAccountsByIdAsync(long nominalAccountId, string company);
        Task<IEnumerable<AccountLineTypes>> GetAllAsync();
        Task<IEnumerable<CharterManager>> GetCharterManagersAsync(string[] companyId);
    }
}