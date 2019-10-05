using LDC.Atlas.Services.Configuration.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Repositories
{
    public interface ICompanyConfigurationRepository
    {
        Task UpdateCompanySetupAsync(string company, CompanySetup companySetup);

        Task UpdateInvoiceSetupAsync(string company, InvoiceSetup invoiceSetup);

        Task UpdateInterfaceSetupAsync(string company, IEnumerable<InterfaceSetup> interfaceSetup);

        Task UpdateAllocationSetUpAsync(string companyId, IEnumerable<AllocationSetUp> allocationSetUp);

        Task UpdateTradeSetupAsync(string company, TradeSetup tradeSetup);

        Task AddUpdateIntercoEmailAsync(string company, IEnumerable<InterCoNoInterCoEmailSetup> interCoNoInterCoEmailSetup);

        Task DeleteCompanyAsync(string company);

        Task UpdateIsFrozenForCompanyAsync(string company,int isFrozen);

        Task UpdateTradeFieldSetupAsync(string company, IEnumerable<MandatoryTradeApprovalImageSetup> mandatoryTradeApprovalImageSetup);

        Task UpdateTradeImageFieldSetupAsync(string company, IEnumerable<MandatoryTradeApprovalImageSetup> mandatoryTradeApprovalImageSetup);

        Task UpdateTradeUnapprovedStatusFieldsSetup(string company, IEnumerable<MandatoryTradeApprovalImageSetup> mandatoryTradeApprovalImageSetup);

        Task UpdateMainAccountingFieldSetupAsync(string company, IEnumerable<MainAccountingFieldSetup> mainAccountingFields);

        Task UpdateAccountingParameterSetUpAsync(string companyId, IEnumerable<AccountingParameter> accountingParameters);

        Task UpdateTradeParameterSetUpAsync(string companyId, IEnumerable<TradeParameter> tradeParameters);

        Task UpdateAccountingSetup(string company, DefaultAccountingSetup defaultAccountingSetup);

        Task UpdateRetentionPolicyAsync(string company, RetentionPolicy retentionPolicy);
    }
}
