using LDC.Atlas.Services.Configuration.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Repositories
{
    public interface ICompanyCreationRepository
    {
        Task<int> CreateCompanySetup(string companyId, CompanySetup companySetup);

        Task CreateInvoiceSetup(string companyId, InvoiceSetup invoiceSetup);

        Task CreateInterfaceSetup(string companyId, IEnumerable<InterfaceSetup> interfaceSetup);

        Task CreateUserProfile(int companyId, CompanyCreation companyCreation);

        Task CreateMasterDataforNewCompany(string companyToCopy, bool isCounterpartyRequired, int newCompanyId);

        Task<int> CreateTradeSetUp(string companyId, TradeSetup tradeSetup);

        Task AddUpdateIntercoEmailAsync(string company, IEnumerable<InterCoNoInterCoEmailSetup> interCoNoInterCoEmailSetup);

        Task CreateAllocationSetUpAsync(string company, IEnumerable<AllocationSetUp> allocationSetup, int tradeSetupId);

        Task CreateGridConfiguration(string companyId);

        Task CreateTransactionData(string companyToCopy, int newCompanyId);

        Task CreateTradeFieldSetupAsync(string company, IEnumerable<MandatoryTradeApprovalImageSetup> mandatoryTradeApprovalImageSetup);

        Task CreateTradeImageFieldSetupAsync(string company, IEnumerable<MandatoryTradeApprovalImageSetup> mandatoryTradeApprovalImageSetup);

        Task CreateTradeUnapprovedStatusFieldsSetup(string company, IEnumerable<MandatoryTradeApprovalImageSetup> mandatoryTradeApprovalImageSetup);

        Task CreateMainAccountingFieldSetupAsync(string company, IEnumerable<MainAccountingFieldSetup> mainAccountingFields);

        Task CreateAccountingParameterSetUpAsync(string companyId,IEnumerable<AccountingParameter> accountingParameters);

        Task CreateTradeParameterSetUpAsync(string companyId,IEnumerable<TradeParameter> tradeParameters, int tradeSetUpId);

        Task CreateRetentionPolicyAsync(string company, RetentionPolicy retentionPolicy);

        Task CreateAccountingSetup(string company, DefaultAccountingSetup defaultAccountingSetup);
    }
}
