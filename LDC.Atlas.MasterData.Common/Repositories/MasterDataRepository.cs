using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.MasterData.Common.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace LDC.Atlas.MasterData.Common.Repositories
{
    public class MasterDataRepository : BaseRepository, IMasterDataRepository
    {
        public MasterDataRepository(IDapperContext dapperContext)
            : base(dapperContext)
        {
            SqlMapper.SetTypeMap(
                       typeof(Arbitration),
                       new ColumnAttributeTypeMapper<Arbitration>());

            SqlMapper.SetTypeMap(
                typeof(CommodityType),
                new ColumnAttributeTypeMapper<CommodityType>());

            SqlMapper.SetTypeMap(
                typeof(Commodity),
                new ColumnAttributeTypeMapper<Commodity>());

            SqlMapper.SetTypeMap(
                typeof(ContractTerm),
                new ColumnAttributeTypeMapper<ContractTerm>());

            SqlMapper.SetTypeMap(
                typeof(CostType),
                new ColumnAttributeTypeMapper<CostType>());

            SqlMapper.SetTypeMap(
                typeof(Country),
                new ColumnAttributeTypeMapper<Country>());

            SqlMapper.SetTypeMap(
                typeof(Currency),
                new ColumnAttributeTypeMapper<Currency>());

            SqlMapper.SetTypeMap(
                typeof(Department),
                new ColumnAttributeTypeMapper<Department>());

            SqlMapper.SetTypeMap(
                typeof(InvoiceType),
                new ColumnAttributeTypeMapper<InvoiceType>());

            SqlMapper.SetTypeMap(
                typeof(MarketSector),
                new ColumnAttributeTypeMapper<MarketSector>());

            SqlMapper.SetTypeMap(
                typeof(NominalAccount),
                new ColumnAttributeTypeMapper<NominalAccount>());

            SqlMapper.SetTypeMap(
                typeof(PaymentTerms),
                new ColumnAttributeTypeMapper<PaymentTerms>());

            SqlMapper.SetTypeMap(
                typeof(PeriodType),
                new ColumnAttributeTypeMapper<PeriodType>());

            SqlMapper.SetTypeMap(
                typeof(Port),
                new ColumnAttributeTypeMapper<Port>());

            SqlMapper.SetTypeMap(
                typeof(PriceUnit),
                new ColumnAttributeTypeMapper<PriceUnit>());

            SqlMapper.SetTypeMap(
                typeof(ProfitCenter),
                new ColumnAttributeTypeMapper<ProfitCenter>());

            SqlMapper.SetTypeMap(
                typeof(Province),
                new ColumnAttributeTypeMapper<Province>());
            SqlMapper.SetTypeMap(
                typeof(Region),
                new ColumnAttributeTypeMapper<Region>());
            SqlMapper.SetTypeMap(
                typeof(ShippingStatus),
                new ColumnAttributeTypeMapper<ShippingStatus>());

            SqlMapper.SetTypeMap(
                typeof(TransportType),
                new ColumnAttributeTypeMapper<TransportType>());

            SqlMapper.SetTypeMap(
                typeof(Vat),
                new ColumnAttributeTypeMapper<Vat>());

            SqlMapper.SetTypeMap(
                typeof(Vessel),
                new ColumnAttributeTypeMapper<Vessel>());

            SqlMapper.SetTypeMap(
                typeof(WeightUnit),
                new ColumnAttributeTypeMapper<WeightUnit>());
            SqlMapper.SetTypeMap(
                      typeof(AccountLineTypes),
                      new ColumnAttributeTypeMapper<AccountLineTypes>());
        }

        public async Task<IEnumerable<Arbitration>> GetArbitrationsAsync(string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Company", company);

            var arbitrations = await ExecuteQueryAsync<Arbitration>(
                StoredProcedureNames.GetArbitrations,
                queryParameters);

            return arbitrations;
        }

        public async Task<IEnumerable<Commodity>> GetCommoditiesAsync(string company, Commodity commodity = null, int? offset = null, int? limit = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@PrincipalCommodity", commodity != null ? commodity.PrincipalCommodity : null);
            queryParameters.Add("@CommodityOrigin", commodity != null ? commodity.Part2 : null);
            queryParameters.Add("@CommodityGrade", commodity != null ? commodity.Part3 : null);
            queryParameters.Add("@CommodityLvl4", commodity != null ? commodity.Part4 : null);
            queryParameters.Add("@CommodityLvl5", commodity != null ? commodity.Part5 : null);
            queryParameters.Add("@offsetRows", offset ?? 0);
            queryParameters.Add("@fetchRows", limit ?? int.MaxValue);

            var commodiies = await ExecuteQueryAsync<Commodity>(
                StoredProcedureNames.GetCommodities,
                queryParameters);

            return commodiies;         
        }

        public async Task<IEnumerable<CommodityType>> GetCommodityTypeAsync()
        {
            var commodityTypes = await ExecuteQueryAsync<CommodityType>(
                StoredProcedureNames.GetCommodityTypes);

            return commodityTypes;
        }

        public async Task<IEnumerable<Company>> GetCompaniesAsync()
        {
            var companies = await ExecuteQueryAsync<Company>(
                StoredProcedureNames.GetCompanies);

            return companies;
        }

        public async Task<IEnumerable<ContractTerm>> GetContractTermsAsync(string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Company", company);

            var contractTerms = await ExecuteQueryAsync<ContractTerm>(
                StoredProcedureNames.GetContractTerms,
                queryParameters);

            return contractTerms;
        }

        public async Task<IEnumerable<CostType>> GetCostTypesAsync(string company)
        {
            var queryParameters = new DynamicParameters();

            queryParameters.Add("@Company", company);

            var costTypes = await ExecuteQueryAsync<CostType>(
                StoredProcedureNames.GetCostTypes,
                queryParameters);

            return costTypes;
        }

        public async Task<IEnumerable<Counterparty>> GetCounterpartiesAsync(string company, string counterpartyCode = null, int? offset = null, int? limit = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Company", company);
            queryParameters.Add("@CounterpartyCode", counterpartyCode);
            queryParameters.Add("@offsetRows", offset ?? 0);
            queryParameters.Add("@fetchRows", limit ?? int.MaxValue);

            var counterparties = await ExecuteQueryAsync<Counterparty>(
                StoredProcedureNames.GetCounterparties,
                queryParameters);

            return counterparties;
        }

        public async Task<IEnumerable<Counterparty>> GetCounterpartiesByPricingMethodAndDealTypeAsync(string company, PricingMethod pricingMethod, DealType dealType)
        {
            var queryParameters = new DynamicParameters();

            queryParameters.Add("@Company", company);
            queryParameters.Add("@PricingMethod", pricingMethod);
            queryParameters.Add("@DealType", dealType);

            var counterparties = await ExecuteQueryAsync<Counterparty>(
                StoredProcedureNames.GetCounterpartiesByPricingMethodAndDealType,
                queryParameters);

            return counterparties;
        }

        public async Task<IEnumerable<Country>> GetCountriesAsync()
        {
            var countries = await ExecuteQueryAsync<Country>(
                StoredProcedureNames.GetCountries);

            return countries;
        }

        public async Task<IEnumerable<Currency>> GetCurrenciesAsync()
        {
            var currencies = await ExecuteQueryAsync<Currency>(
                StoredProcedureNames.GetCurrencies);

            return currencies;
        }

        public async Task<IEnumerable<Department>> GetDepartmentsAsync(string company, string departmentCode = null, int? offset = null, int? limit = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Company", ToSelectedCompanyTVP(new string[] { company }));
            queryParameters.Add("@departmentCode", departmentCode);
            queryParameters.Add("@offsetRows", offset ?? 0);
            queryParameters.Add("@fetchRows", limit ?? int.MaxValue);

            queryParameters.Add("@offsetRows", 0);
            queryParameters.Add("@fetchRows", int.MaxValue);

            var departments = await ExecuteQueryAsync<Department>(
                StoredProcedureNames.GetDepartments,
                queryParameters,
                true);

            return departments;
        }

        private static DataTable ToSelectedCompanyTVP(string[] selectedCompanies)
        {
            DataTable table = new DataTable();
            table.SetTypeName("[dbo].[UDTT_VarcharList]");
            var name = new DataColumn("[Name]", typeof(string));
            table.Columns.Add(name);
            foreach (string company in selectedCompanies)
            {
                var row = table.NewRow();
                row[name] = company;
                table.Rows.Add(row);
            }

            return table;
        }
        public async Task<IEnumerable<FxRateRecord>> GetFxRatesAsync(DateTime? fxRateDate, string viewMode)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Date", GetMarketDateUDTT(fxRateDate));
            queryParameters.Add("@Viewtype", viewMode);

            var fxRateRecords = await ExecuteQueryAsync<FxRateRecord>(
                StoredProcedureNames.GetFxRates,
                queryParameters);

            return fxRateRecords;
        }

        public async Task<IEnumerable<InvoiceType>> GetInvoiceTypesAsync()
        {
            var invoiceTypes = await ExecuteQueryAsync<InvoiceType>(
                StoredProcedureNames.GetInvoiceTypes);

            return invoiceTypes;
        }

        public async Task<IEnumerable<MarketSector>> GetMarketSectorsAsync(string companyId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@companyId", companyId);

            var marketSectors = await ExecuteQueryAsync<MarketSector>(
                StoredProcedureNames.GetMarketSectors, queryParameters);

            return marketSectors;
        }

        public async Task<IEnumerable<NominalAccount>> GetNominalAccountsAsync(string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Company", company);

            var nominalAccounts = await ExecuteQueryAsync<NominalAccount>(
                StoredProcedureNames.GetNominalAccounts, queryParameters);

            return nominalAccounts;
        }

        public async Task<IEnumerable<PaymentTerms>> GetPaymentTermsAsync(string company, string paymentTermCode = null, int? offset = null, int? limit = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Company", company);
            queryParameters.Add("@paymentTermCode", paymentTermCode);
            queryParameters.Add("@offsetRows", offset ?? 0);
            queryParameters.Add("@fetchRows", limit ?? int.MaxValue);

            var paymentTerms = await ExecuteQueryAsync<PaymentTerms>(
                StoredProcedureNames.GetPaymentTerms,
                queryParameters);

            return paymentTerms;
        }

        public async Task<IEnumerable<PeriodType>> GetPeriodTypesAsync(string company)
        {
            var queryParameters = new DynamicParameters();

            var periodTypes = await ExecuteQueryAsync<PeriodType>(
                StoredProcedureNames.GetPeriodTypes,
                queryParameters);

            return periodTypes;
        }

        public async Task<IEnumerable<Port>> GetPortsAsync(string company, string portCode = null, int? offset = null, int? limit = null)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Company", company);
            queryParameters.Add("@portCode", portCode);
            queryParameters.Add("@offsetRows", offset ?? 0);
            queryParameters.Add("@fetchRows", limit ?? int.MaxValue);

            var ports = await ExecuteQueryAsync<Port>(
                StoredProcedureNames.GetPorts,
                queryParameters);

            return ports;
        }

        public async Task<IEnumerable<PriceUnit>> GetPriceUnitsAsync(string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Company", company);

            var priceUnits = await ExecuteQueryAsync<PriceUnit>(
                StoredProcedureNames.GetPriceUnits,
                queryParameters);

            return priceUnits;
        }

        public async Task<IEnumerable<ProfitCenter>> GetProfitCentersAsync(string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Company", company);

            var profitCenters = await ExecuteQueryAsync<ProfitCenter>(
                StoredProcedureNames.GetProfitCenters,
                queryParameters);

            return profitCenters;
        }

        public async Task<IEnumerable<Province>> GetProvincesAsync()
        {
            var provinces = await ExecuteQueryAsync<Province>(
                StoredProcedureNames.GetProvinces);

            return provinces;
        }

        public async Task<IEnumerable<Region>> GetRegionsAsync()
        {
            var regions = await ExecuteQueryAsync<Region>(
                StoredProcedureNames.GetRegions);

            return regions;
        }

        public async Task<IEnumerable<ShippingStatus>> GetShippingStatusAsync(string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Company", company);

            var shippingStatus = await ExecuteQueryAsync<ShippingStatus>(
                StoredProcedureNames.GetShippingStatus,
                queryParameters);

            return shippingStatus;
        }

        public async Task<IEnumerable<TransportType>> GetTransportTypesAsync(string companyId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Company", companyId);

            var transportTypes = await ExecuteQueryAsync<TransportType>(
                StoredProcedureNames.GetTransportTypes, queryParameters);

            return transportTypes;
        }

        public async Task<IEnumerable<Vat>> GetVatsAsync(string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Company", company);

            var vats = await ExecuteQueryAsync<Vat>(
                StoredProcedureNames.GetVat, queryParameters);

            return vats;
        }

        public async Task<IEnumerable<Vessel>> GetVesselsAsync(string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Company", company);

            var vessels = await ExecuteQueryAsync<Vessel>(
                StoredProcedureNames.GetVessels,
                queryParameters);

            return vessels;
        }

        public async Task<IEnumerable<WeightUnit>> GetWeightUnitsAsync(string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Company", company);

            var weightUnits = await ExecuteQueryAsync<WeightUnit>(
                StoredProcedureNames.GetWeightUnits,
                queryParameters);

            return weightUnits;
        }

        public async Task<Company> GetCompanyByIdAsync(string companyId)
        {
            var queryParameters = new DynamicParameters();

            queryParameters.Add("@CompanyId", companyId);

            var companySettings = await ExecuteQueryFirstOrDefaultAsync<Company>(
                StoredProcedureNames.GetCompanySettings, queryParameters);

            return companySettings;
        }

        public async Task<FxRate> GetFxRateAsync(DateTime fxRateDate, string currencyCode)
        {
            var queryParameters = new DynamicParameters();

            queryParameters.Add("@Date", fxRateDate);
            queryParameters.Add("@Currencycode", currencyCode);

            var fxRate = await ExecuteQueryFirstOrDefaultAsync<FxRate>(
                StoredProcedureNames.GetFxRate, queryParameters);

            return fxRate;
        }

        public async Task<IEnumerable<Vat>> GetVatAsync(IEnumerable<string> vatCodes, string companyId)
        {
            var queryParameters = new DynamicParameters();

            queryParameters.Add("@VATCodes", ToArrayTVP(vatCodes));
            queryParameters.Add("@CompanyId", companyId);

            var vats = await ExecuteQueryAsync<Vat>(
                StoredProcedureNames.GetVatForAcconting, queryParameters);

            return vats;
        }

        public async Task<IEnumerable<FxTradeType>> GetFxTradeTypesAsync(string companyId)
        {
            var queryParameters = new DynamicParameters();

            queryParameters.Add("@Company", companyId);

            var fxTradeTypes = await ExecuteQueryAsync<FxTradeType>(
                StoredProcedureNames.GetFxTradeTypes, queryParameters);

            return fxTradeTypes;
        }

        private static DataTable ToArrayTVP(IEnumerable<string> vatCodes)
        {
            var table = new DataTable();
            table.SetTypeName("[PreAccounting].[UDTT_VATCode]");
            var vatCode = new DataColumn("[VATCode]", typeof(string));
            table.Columns.Add(vatCode);

            foreach (string vat in vatCodes)
            {
                var row = table.NewRow();
                row[vatCode] = vat;

                table.Rows.Add(row);
            }

            return table;
        }

        public async Task<IEnumerable<Company>> GetAllByCounterpartyIdAsync(string companyId, string counterpartyCode)
        {
            var queryParameters = new DynamicParameters();

            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add("@CounterpartyCode", counterpartyCode);

            var companies = await ExecuteQueryAsync<Company>(
                StoredProcedureNames.GetCompanySettingsByCounterpartyId, queryParameters);

            return companies;
        }
        public async Task<IEnumerable<AccountLineTypes>> GetAllAsync()
        {
            var accountLineTypes = await ExecuteQueryAsync<AccountLineTypes>(
                StoredProcedureNames.GetAccountLineTypes);

            return accountLineTypes;
        }
        public async Task<IEnumerable<CharterManager>> GetCharterManagersAsync(string[] company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", ToSelectedCompanyTVP(company));
            queryParameters.Add("@charterRef", null);
            queryParameters.Add("@offsetRows",  0);
            queryParameters.Add("@fetchRows", int.MaxValue);

            var charters = await ExecuteQueryAsync<CharterManager>(StoredProcedureNames.GetCharterManagers, queryParameters, true);

            return charters;

 
        }

        private static DataTable GetMarketDateUDTT(DateTime? fxRateDate)
        {
            DataTable udtt = new DataTable();
            udtt.SetTypeName("[MasterData].[UDTT_FXDates]");

            DataColumn date = new DataColumn("Date", typeof(DateTime));
            udtt.Columns.Add(date);

            if (fxRateDate != null)
            {
                var row = udtt.NewRow();
                row[date] = fxRateDate;
                udtt.Rows.Add(row);
            }


            return udtt;
        }

        public async Task<NominalAccount> GetNominalAccountsByIdAsync(long nominalAccountId, string company)
        {
            var queryParameters = new DynamicParameters();

            queryParameters.Add("@NominalAccountId", nominalAccountId);
            queryParameters.Add("@Company", company);

            var nominalAccount = await ExecuteQueryFirstOrDefaultAsync<NominalAccount>(
                StoredProcedureNames.GetNominalAccountByNominalAccount, queryParameters);

            return nominalAccount;
        }

        internal static class StoredProcedureNames
        {
            internal const string GetArbitrations = "[Masterdata].[usp_ListArbitrations]";
            internal const string GetCommodities = "[Masterdata].[usp_ListCommodities]";
            internal const string GetCommodityTypes = "[Masterdata].[usp_ListCommodityTypes]";
            internal const string GetCompanies = "[Masterdata].[usp_ListCompanies]";
            internal const string GetContractTerms = "[Masterdata].[usp_ListContractTerms]";
            internal const string GetCostTypes = "[Masterdata].[usp_ListCostTypes]";
            internal const string GetCounterparties = "[Masterdata].[usp_ListCounterparties]";
            internal const string GetCounterpartiesByPricingMethodAndDealType = "[MasterData].[usp_ListCounterpartiesByPricingMethodAndDealType]";
            internal const string GetCountries = "[Masterdata].[usp_ListCountries]";
            internal const string GetCurrencies = "[Masterdata].[usp_ListCurrencies]";
            internal const string GetDepartments = "[Masterdata].[usp_ListDepartments]";
            internal const string GetFuturesOptionsCommodities = "[MasterData].[usp_ListFuturesOptionsCommodities]";
            internal const string GetFxRates = "[MasterData].[usp_ListFxRates]";
            internal const string GetInvoiceTypes = "[Masterdata].[usp_ListInvoiceTypes]";
            internal const string GetMarketSectors = "[Masterdata].[usp_ListBusinessSectors]";
            internal const string GetNominalAccounts = "[Masterdata].[usp_ListNominalAccounts]";
            internal const string GetPaymentTerms = "[Masterdata].[usp_ListPaymentTerms]";
            internal const string GetPeriodTypes = "[Masterdata].[usp_ListPeriodTypes]";
            internal const string GetPorts = "[Masterdata].[usp_ListPorts]";
            internal const string GetPriceUnits = "[Masterdata].[usp_ListPriceUnits]";
            internal const string GetProfitCenters = "[Masterdata].[usp_ListProfitCenters]";
            internal const string GetProvinces = "[Masterdata].[usp_ListProvinces]";
            internal const string GetRegions = "[Masterdata].[usp_ListRegions]";
            internal const string GetShippingStatus = "[Masterdata].[usp_ListShippingStatus]";
            internal const string GetTransportTypes = "[Masterdata].[usp_ListTransportTypes]";
            internal const string GetVat = "[Masterdata].[usp_ListVAT]";
            internal const string GetVessels = "[Masterdata].[usp_ListVessels]";
            internal const string GetWeightUnits = "[Masterdata].[usp_ListWeightUnits]";
            internal const string GetCompanySettings = "[Masterdata].[usp_GetCompanySettings]";
            internal const string GetFxRate = "[MasterData].[usp_GetFxRate]";
            internal const string GetVatForAcconting = "[MasterData].[usp_GetVAT]";
            internal const string GetAccountLineTypes = "[MasterData].[usp_ListAccountLineTypes]";
            internal const string GetCompanySettingsByCounterpartyId = "[Masterdata].[usp_GetCompanySettingsByCounterpartyId]";
            internal const string GetFxTradeTypes = "[MasterData].[usp_ListFxTradeTypes]";
            internal const string GetCharterManagers = "[Logistic].[usp_ListCharters]";
            internal const string GetNominalAccountByNominalAccount = "[MasterData].[usp_GetNominalAccountByNominalAccount]";
        }
    }
}
