using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Configuration.Application.Commands.Dto;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Application.Queries
{
    public class CompanyConfigurationQueries : BaseRepository, ICompanyConfigurationQueries
    {
        public CompanyConfigurationQueries(IDapperContext dapperContext)
           : base(dapperContext)
        {
        }

        public async Task<CompanyConfigurationDto> GetCompanyConfigurationAsync(string company, int year)
        {
            CompanyConfigurationDto companyConfigurationDto = new CompanyConfigurationDto();

            companyConfigurationDto.AllocationSetUp = await GetAllocationSetUpByCompanyId(company);

            companyConfigurationDto.CompanyId = company;

            companyConfigurationDto.CompanySetup = await GetCompanySetupByCompany(company);

            companyConfigurationDto.InterCoNoInterCoEmailSetup = await GetInterCoNoInterCoEmailSetup(company);

            companyConfigurationDto.InterfaceSetup = await GetInterfaceSetupByCompany(company);

            companyConfigurationDto.InvoiceSetup = await GetInvoiceSetupByCompany(company);

            companyConfigurationDto.MandatoryTradeApprovalImageSetup = await GetMandatoryFieldSetupByCompanyId(company);

            companyConfigurationDto.TradeConfiguration = await GetTradeSetupByCompany(company);

            companyConfigurationDto.MainAccountingSetup = await GetMainAccountingSetupByCompanyId(company);

            companyConfigurationDto.AccountingParameters = await GetAccountingParameterSetUpByCompany(company, year);

            companyConfigurationDto.TradeParameters = await GetTradeParameterSetUpByCompany(company);

            companyConfigurationDto.DefaultAccountingSetup = await GetDefaultAccountingSetup(company);

            companyConfigurationDto.RetentionPolicy = await GetRetentionPolicyByCompanyAsync(company);

            return companyConfigurationDto;
        }

        public async Task<IEnumerable<CompanyListDto>> GetCompanyListDetails()
        {
            var queryParameters = new DynamicParameters();

            var listCompaniesForConfiguration = await ExecuteQueryAsync<CompanyListDto>(StoredProcedureNames.ListCompaniesForConfiguration, queryParameters, false);

            return listCompaniesForConfiguration.ToList();
        }

        public async Task<RetentionPolicyDto> GetRetentionPolicyByCompanyAsync(string companyId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyId);
            RetentionPolicyDto retentionPolicy = await ExecuteQueryFirstOrDefaultAsync<RetentionPolicyDto>(StoredProcedureNames.GetRetentionPolicy, queryParameters, false);

            return retentionPolicy;
        }

        public async Task<InvoiceSetupDto> GetInvoiceSetupByCompany(string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            var invoiceSetup = await ExecuteQueryFirstOrDefaultAsync<InvoiceSetupDto>(StoredProcedureNames.GetInvoiceSetup, queryParameters, false);

            return invoiceSetup;
        }

        public async Task<IEnumerable<MainAccountingSetupDto>> GetMainAccountingSetup()
        {
            var mainAccountingSetup = await ExecuteQueryAsync<MainAccountingSetupDto>(StoredProcedureNames.GetMainAccountingSetup);

            return mainAccountingSetup;
        }

        public async Task<IEnumerable<MainAccountingSetupDto>> GetMainAccountingSetupByCompanyId(string companyId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyId);
            var mainAccountingSetup = await ExecuteQueryAsync<MainAccountingSetupDto>(StoredProcedureNames.GetMainAccountingSetupByCompanyId, queryParameters);

            return mainAccountingSetup;
        }

        public async Task<DefaultAccountingSetupDto> GetDefaultAccountingSetup(string company)
        {
            var queryParameters = new DynamicParameters();
            DefaultAccountingSetupDto defaultAccountingSetup;

            queryParameters.Add("@CompanyId", company);
            using (var grid = await ExecuteQueryMultipleAsync(StoredProcedureNames.GetDefaultAccountingSetup, queryParameters))
            {
                defaultAccountingSetup = (await grid.ReadAsync<DefaultAccountingSetupDto>()).FirstOrDefault();
            }

            return defaultAccountingSetup;
        }

        public async Task<CompanySetupDto> GetCompanySetupByCompany(string company)
        {
            var queryParameters = new DynamicParameters();

            queryParameters.Add("@CompanyId", company);
            var companySetup = await ExecuteQueryFirstOrDefaultAsync<CompanySetupDto>(StoredProcedureNames.GetCompanySettings, queryParameters, false);

            return companySetup;
        }

        public async Task<bool> CheckTransactionDataExists(string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            var transactionDataExists = await ExecuteQueryFirstOrDefaultAsync<bool>(StoredProcedureNames.CheckTransactionDataExists, queryParameters);
            return transactionDataExists;
        }

        public async Task<IEnumerable<AllocationSetUpDto>> GetAllocationSetUp()
        {
            var queryParameters = new DynamicParameters();
            var allocationSetup = await ExecuteQueryAsync<AllocationSetUpDto>(StoredProcedureNames.GetAllocationSetUp, queryParameters, false);
            return allocationSetup.ToList();
        }

        public async Task<IEnumerable<AllocationSetUpDto>> GetAllocationSetUpByCompanyId(string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            var allocationSetup = await ExecuteQueryAsync<AllocationSetUpDto>(StoredProcedureNames.GetAllocationSetupbyCompanyId, queryParameters, false);
            return allocationSetup.ToList();
        }

        public async Task<IEnumerable<InterfaceSetupDto>> GetInterfaceSetupByCompany(string company)
        {
            var queryParameters = new DynamicParameters();

            queryParameters.Add("@CompanyId", company);
            var interfaceSetup = await ExecuteQueryAsync<InterfaceSetupDto>(StoredProcedureNames.GetInterfaceSetup, queryParameters, false);

            return interfaceSetup.ToList();
        }

        public async Task<IEnumerable<MandatoryTradeApprovalImageSetupDto>> GetMandatoryFieldSetup()
        {
            var queryParameters = new DynamicParameters();
            var mandatorySetup = await ExecuteQueryAsync<MandatoryTradeApprovalImageSetupDto>(StoredProcedureNames.GetMandatoryFieldSetUp, queryParameters, false);
            return mandatorySetup.ToList();
        }

        public async Task<IEnumerable<MandatoryTradeApprovalImageSetupDto>> GetMandatoryFieldSetupByCompanyId(string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            var mandatorySetup = await ExecuteQueryAsync<MandatoryTradeApprovalImageSetupDto>(StoredProcedureNames.GetMandatoryFieldSetupByCompanyId, queryParameters, false);
            return mandatorySetup.ToList();
        }

        public async Task<TradeSetupDto> GetTradeSetupByCompany(string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            TradeSetupDto tradeConfigurationList = await ExecuteQueryFirstOrDefaultAsync<TradeSetupDto>(StoredProcedureNames.GetTradeSetup, queryParameters);
            return tradeConfigurationList;
        }

        public async Task<IEnumerable<InterCoNoInterCoUsersDto>> GetInterCoNoInterCoUsers()
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@Name", null);
            var interCoNoInterCoUserList = await ExecuteQueryAsync<InterCoNoInterCoUsersDto>(StoredProcedureNames.GetUsers, queryParameters, false);
            return interCoNoInterCoUserList.ToList();
        }

        public async Task<IEnumerable<InterCoNoInterCoEmailSetupDto>> GetInterCoNoInterCoEmailSetup(string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            var interCoNoInterCoEmailList = await ExecuteQueryAsync<InterCoNoInterCoEmailSetupDto>(StoredProcedureNames.GetInterCoEmailSetup, queryParameters, false);
            return interCoNoInterCoEmailList.ToList();
        }

        public async Task<bool> CheckCounterpartyforCompanyExists(string company)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", company);
            var isCounterpartyExists = await ExecuteQueryFirstOrDefaultAsync<bool>(StoredProcedureNames.CheckCounterpartyforCompanyExists, queryParameters);
            return isCounterpartyExists;
        }

        public async Task<IEnumerable<AccountingParameterDto>> GetAccountingParameterSetUpByCompany(string company, int year)
        {
            var queryParameters = new DynamicParameters();

            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@Year", year);
            var accountingParameterSetup = await ExecuteQueryAsync<AccountingParameterDto>(StoredProcedureNames.GetAccountingParameterSetUpByCompany, queryParameters, false);

            return accountingParameterSetup.ToList();
        }

        public async Task<IEnumerable<TradeParameterDto>> GetTradeParameterSetUpByCompany(string company)
        {
            var queryParameters = new DynamicParameters();

            queryParameters.Add("@CompanyId", company);

            var tradeParameterSetup = await ExecuteQueryAsync<TradeParameterDto>(StoredProcedureNames.GetTradeParameterSetUpByCompany, queryParameters, false);

            return tradeParameterSetup.ToList();
        }

        private static class StoredProcedureNames
        {
            internal const string ListCompaniesForConfiguration = "[Configuration].[usp_ListCompaniesForConfiguration]";
            internal const string GetInvoiceSetup = "[Invoicing].[usp_GetInvoiceSetup]";
            internal const string GetInterfaceSetup = "[Interface].[usp_GetInterfaceSetup]";
            internal const string GetCompanySettings = "[Masterdata].[usp_GetCompanySettings]";
            internal const string GetAllocationSetUp = "[Logistic].[usp_GetAllocationSetup]";
            internal const string GetMandatoryFieldSetUp = "[Trading].[usp_GetMandatoryTradeApprovalImageSetup]";
            internal const string GetTradeSetup = "[Trading].[usp_GetTradeSetup]";
            internal const string GetUsers = "[Authorization].[usp_GetUsers]";
            internal const string GetInterCoEmailSetup = "[Trading].[usp_GetInterCoEmailSetup]";
            internal const string CheckTransactionDataExists = "[Configuration].[usp_CheckTransactionDataExists]";
            internal const string CheckCounterpartyforCompanyExists = "[MasterData].[usp_CheckCounterpartyforCompanyExists]";
            internal const string GetAllocationSetupbyCompanyId = "[Logistic].[usp_GetAllocationSetupbyCompanyId]";
            internal const string GetMandatoryFieldSetupByCompanyId = "[Trading].[usp_GetMandatoryTradeApprovalImageSetupbyCompanyId]";
            internal const string GetMainAccountingSetup = "[PreAccounting].[usp_GetMainAccountingSetup]";
            internal const string GetMainAccountingSetupByCompanyId = "[PreAccounting].[usp_GetMainAccountingSetupByCompanyId]";
            internal const string GetDefaultAccountingSetup = "[PreAccounting].[usp_GetAccountingSetup]";
            internal const string GetAccountingParameterSetUpByCompany = "[Configuration].[usp_GetTransactionDocumentTypeCompanySetting]";
            internal const string GetTradeParameterSetUpByCompany = "[Configuration].[usp_GetContractTypeCompanySetup]";
            internal const string GetRetentionPolicy = "[Freeze].[usp_GetRetentionPolicy]";
        }
    }
}
