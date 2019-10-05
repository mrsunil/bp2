using LDC.Atlas.Services.Configuration.Application.Commands.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Application.Queries
{
    public interface ICompanyConfigurationQueries
    {
        Task<IEnumerable<CompanyListDto>> GetCompanyListDetails();

        Task<CompanyConfigurationDto> GetCompanyConfigurationAsync(string company,int year);

        Task<InvoiceSetupDto> GetInvoiceSetupByCompany(string company);

        Task<IEnumerable<InterfaceSetupDto>> GetInterfaceSetupByCompany(string company);

        Task<CompanySetupDto> GetCompanySetupByCompany(string company);

        Task<bool> CheckTransactionDataExists(string companyId);

        Task<IEnumerable<AllocationSetUpDto>> GetAllocationSetUp();

        Task<IEnumerable<AllocationSetUpDto>> GetAllocationSetUpByCompanyId(string company);

        Task<IEnumerable<MandatoryTradeApprovalImageSetupDto>> GetMandatoryFieldSetup();

        Task<IEnumerable<MandatoryTradeApprovalImageSetupDto>> GetMandatoryFieldSetupByCompanyId(string company);

        Task<TradeSetupDto> GetTradeSetupByCompany(string company);

        Task<IEnumerable<InterCoNoInterCoUsersDto>> GetInterCoNoInterCoUsers();

        Task<IEnumerable<InterCoNoInterCoEmailSetupDto>> GetInterCoNoInterCoEmailSetup(string company);

        Task<bool> CheckCounterpartyforCompanyExists(string company);

        Task<IEnumerable<MainAccountingSetupDto>> GetMainAccountingSetup();

        Task<IEnumerable<MainAccountingSetupDto>> GetMainAccountingSetupByCompanyId(string companyId);

        Task<DefaultAccountingSetupDto> GetDefaultAccountingSetup(string company);


        Task<IEnumerable<AccountingParameterDto>> GetAccountingParameterSetUpByCompany(string company, int year);

        Task<IEnumerable<TradeParameterDto>> GetTradeParameterSetUpByCompany(string company);
    }
}
