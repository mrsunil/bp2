using LDC.Atlas.MasterData.Common.Entities;
using LDC.Atlas.MasterData.Common.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.MasterData.Common
{
    public class MasterDataService : IMasterDataService
    {
        private readonly IMasterDataRepository _masterDataRepository;

        public MasterDataService(IMasterDataRepository masterDataRepository)
        {
            _masterDataRepository = masterDataRepository;
        }

        public async Task<IEnumerable<Arbitration>> GetArbitrationsAsync(string companyId)
        {
            return await _masterDataRepository.GetArbitrationsAsync(companyId);
        }

        public async Task<IEnumerable<Commodity>> GetCommoditiesAsync(string companyId, Commodity commodity = null, int? offset = null, int? limit = null)
        {
            return await _masterDataRepository.GetCommoditiesAsync(companyId, commodity, offset, limit);
        }

        public async Task<IEnumerable<CommodityType>> GetCommodityTypeAsync()
        {
            return await _masterDataRepository.GetCommodityTypeAsync();
        }

        public async Task<IEnumerable<Company>> GetCompaniesAsync()
        {
            return await _masterDataRepository.GetCompaniesAsync();
        }

        public async Task<IEnumerable<ContractTerm>> GetContractTermsAsync(string companyId)
        {
            return await _masterDataRepository.GetContractTermsAsync(companyId);
        }

        public async Task<IEnumerable<CostType>> GetCostTypesAsync(string companyId)
        {
            return await _masterDataRepository.GetCostTypesAsync(companyId);
        }

        public async Task<IEnumerable<Counterparty>> GetCounterpartiesAsync(string companyId, string counterpartyCode = null, int? offset = null, int? limit = null)
        {
            return await _masterDataRepository.GetCounterpartiesAsync(companyId, counterpartyCode, offset, limit);
        }

        public async Task<IEnumerable<Counterparty>> GetCounterpartiesByPricingMethodAndDealTypeAsync(string companyId, PricingMethod pricingMethod, DealType dealType)
        {
            return await _masterDataRepository.GetCounterpartiesByPricingMethodAndDealTypeAsync(companyId, pricingMethod, dealType);
        }

        public async Task<IEnumerable<Country>> GetCountriesAsync()
        {
            return await _masterDataRepository.GetCountriesAsync();
        }

        public async Task<IEnumerable<Currency>> GetCurrenciesAsync()
        {
            return await _masterDataRepository.GetCurrenciesAsync();
        }

        public async Task<IEnumerable<Department>> GetDepartmentsAsync(string companyId, string departmentCode = null, int? offset = null, int? limit = null)
        {
            return await _masterDataRepository.GetDepartmentsAsync(companyId, departmentCode, offset, limit);
        }

        public async Task<IEnumerable<FxRate>> GetFxRatesAsync(DateTime? fxRateDate, string viewMode)
        {
            if (fxRateDate == null && viewMode != FxRateViewMode.Spot)
            {
                throw new Exception("The fxRateDate is required for viewMode other than Spot.");
            }

            if (viewMode != FxRateViewMode.Spot && viewMode != FxRateViewMode.Daily && viewMode != FxRateViewMode.Monthly)
            {
                throw new Exception("Invalid value for viewMode.");
            }

            IEnumerable<Currency> currencies = (await GetCurrenciesAsync()).ToList();

            IEnumerable<FxRateRecord> fxRateRecords = await _masterDataRepository.GetFxRatesAsync(fxRateDate, viewMode);

            var fxRatesJoinList =
                (from fxRate in fxRateRecords
                 join currency in currencies on fxRate.CurrencyCodeFrom equals currency.CurrencyCode into currenciesFrom
                 from cf in currenciesFrom.DefaultIfEmpty()
                 join currency in currencies on fxRate.CurrencyCodeTo equals currency.CurrencyCode into currenciesTo
                 from ct in currenciesTo.DefaultIfEmpty()
                 select new { FxRate = fxRate, CurrencyFrom = cf, CurrencyTo = ct }).ToList();

            // Filters out the values which do not meet the codes & types (for ex, EUR=>INR, or USD=>EUR if EUR is of type 'M')
            var fxRateRecordsFiltered = fxRatesJoinList
                .Where(r => (r.CurrencyFrom != null && r.CurrencyTo != null) && (r.CurrencyFrom.IsDollar() || r.CurrencyTo.IsDollar()))
                .Where(r => (r.CurrencyFrom != null && r.CurrencyFrom.IsDollar() && r.CurrencyTo.RoeType == "D") ||
                            (r.CurrencyTo != null && r.CurrencyFrom.RoeType == "M" && r.CurrencyTo.IsDollar())).ToList();

            var fxRates =
                (from r in fxRateRecordsFiltered
                 let c = r.CurrencyFrom.RoeType == "M" && !r.CurrencyFrom.IsDollar() ? r.CurrencyFrom : r.CurrencyTo
                 select new FxRate
                 {
                     CurrencyCode = c.CurrencyCode,
                     CurrencyRoeType = c.RoeType,
                     Date = r.FxRate.ValidDateFrom,
                     Rate = r.FxRate.Rate,
                     FwdMonth1 = r.FxRate.FwdMonth1,
                     FwdMonth2 = r.FxRate.FwdMonth2,
                     FwdMonth3 = r.FxRate.FwdMonth3,
                     FwdMonth6 = r.FxRate.FwdMonth6,
                     FwdYear1 = r.FxRate.FwdYear1,
                     FwdYear2 = r.FxRate.FwdYear2,
                     CurrencyIsDeactivated = c.IsDeactivated,
                     CreatedBy = r.FxRate.CreatedBy,
                     CreatedDateTime = r.FxRate.CreatedDateTime,
                     ModifiedBy = r.FxRate.ModifiedBy,
                     ModifiedDateTime = r.FxRate.ModifiedDateTime
                 })
                .ToList();

            foreach (var currency in currencies)
            {
                if (fxRates.All(r => r.CurrencyCode != currency.CurrencyCode))
                {
                    fxRates.Add(new FxRate
                    {
                        CurrencyCode = currency.CurrencyCode,
                        CurrencyRoeType = currency.RoeType,
                        CurrencyIsDeactivated = currency.IsDeactivated,
                        CurrencyDescription = currency.Description
                    });
                }
            }

            return fxRates;
        }

        public async Task<IEnumerable<InvoiceType>> GetInvoiceTypesAsync()
        {
            return await _masterDataRepository.GetInvoiceTypesAsync();
        }

        public async Task<IEnumerable<MarketSector>> GetMarketSectorsAsync(string companyId)
        {
            return await _masterDataRepository.GetMarketSectorsAsync(companyId);
        }

        public async Task<IEnumerable<NominalAccount>> GetNominalAccountsAsync(string company)
        {
            return await _masterDataRepository.GetNominalAccountsAsync(company);
        }

        public async Task<IEnumerable<PaymentTerms>> GetPaymentTermsAsync(string companyId, string paymentTermCode = null, int? offset = null, int? limit = null)
        {
            return await _masterDataRepository.GetPaymentTermsAsync(companyId, paymentTermCode, offset, limit);
        }

        public async Task<IEnumerable<PeriodType>> GetPeriodTypesAsync(string companyId)
        {
            return await _masterDataRepository.GetPeriodTypesAsync(companyId);
        }

        public async Task<IEnumerable<Port>> GetPortsAsync(string companyId, string portCode = null, int? offset = null, int? limit = null)
        {
            return await _masterDataRepository.GetPortsAsync(companyId, portCode, offset, limit);
        }

        public async Task<IEnumerable<PriceUnit>> GetPriceUnitsAsync(string companyId)
        {
            return await _masterDataRepository.GetPriceUnitsAsync(companyId);
        }

        public async Task<IEnumerable<ProfitCenter>> GetAProfitCentersAsync(string companyId)
        {
            return await _masterDataRepository.GetProfitCentersAsync(companyId);
        }

        public async Task<IEnumerable<Province>> GetProvincesAsync()
        {
            return await _masterDataRepository.GetProvincesAsync();
        }

        public async Task<IEnumerable<Region>> GetRegionsAsync()
        {
            return await _masterDataRepository.GetRegionsAsync();
        }

        public async Task<IEnumerable<ShippingStatus>> GetShippingStatusAsync(string companyId)
        {
            return await _masterDataRepository.GetShippingStatusAsync(companyId);
        }

        public async Task<IEnumerable<TransportType>> GetTransportTypesAsync(string companyId)
        {
            return await _masterDataRepository.GetTransportTypesAsync(companyId);
        }

        public async Task<IEnumerable<Vat>> GetVatsAsync(string companyId)
        {
            return await _masterDataRepository.GetVatsAsync(companyId);
        }

        public async Task<IEnumerable<Vessel>> GetVesselsAsync(string companyId)
        {
            return await _masterDataRepository.GetVesselsAsync(companyId);
        }

        public async Task<IEnumerable<WeightUnit>> GetWeightUnitsAsync(string companyId)
        {
            return await _masterDataRepository.GetWeightUnitsAsync(companyId);
        }

        public async Task<Company> GetCompanyByIdAsync(string companyId)
        {
            return await _masterDataRepository.GetCompanyByIdAsync(companyId);
        }

        public async Task<FxRate> GetFxRateAsync(DateTime fxRateDate, string currencyCode)
        {
            return await _masterDataRepository.GetFxRateAsync(fxRateDate, currencyCode);
        }

        public async Task<IEnumerable<Vat>> GetVat(IEnumerable<string> vatCode, string companyId)
        {
            return await _masterDataRepository.GetVatAsync(vatCode, companyId);
        }

        public async Task<IEnumerable<Company>> GetAllByCounterpartyIdAsync(string companyId, string counterpartyCode)
        {
            return await _masterDataRepository.GetAllByCounterpartyIdAsync(companyId, counterpartyCode);
        }

        public async Task<IEnumerable<FxTradeType>> GetFxTradeTypes(string companyId)
        {
            return await _masterDataRepository.GetFxTradeTypesAsync(companyId);
        }
        public async Task<IEnumerable<AccountLineTypes>> GetAllAsync()
        {
            return await _masterDataRepository.GetAllAsync();
        }
        public async Task<IEnumerable<CharterManager>> GetCharterManagersAsync(string[] companyId)
        {
            return await _masterDataRepository.GetCharterManagersAsync(companyId);
        }

        public async Task<NominalAccount> GetNominalAccountsById(long nominalAccountId, string company)
        {
            return await _masterDataRepository.GetNominalAccountsByIdAsync(nominalAccountId, company);
        }
    }
}