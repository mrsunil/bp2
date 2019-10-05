using LDC.Atlas.Services.Lock.Application.Queries.Dto;
using LDC.Atlas.Services.Lock.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Lock.Repositories
{
    public interface ILockRepository
    {
        Task<IEnumerable<LockDto>> CreateLocksAsync(IEnumerable<LockDto> costs, string companyId, string user);

        Task DeleteLockAsync(long lockId);

        Task UnlockAsync(IEnumerable<UnlockDto> unlocks);

        Task RefreshLockOwnershipAsync(string companyId, string resourceType, long resourceId);

        Task<SectionInformation> GetSectionInformationAsync(string companyId, long resourceId);

        Task<CharterInformation> GetCharterInformationAsync(string companyId, long resourceId);

        Task<FxDealInformation> GetFxDealInformationAsync(string companyId, long resourceId);

        Task<UserAccountInformation> GetUserAccountInformation(long userId);

        Task<UserProfileInformation> GetUserProfileInformation(long profileId);

        Task<CostMatrixInformation> GetCostMatrixInformation(long costMatrixId);

        Task<CashDocumentInformation> GetCashDocumentInformation(long cashId);

        Task<AccountingDocumentInformation> GetAccountingDocumentInformation(long accountingId, string companyId, long? dataVersionId);

        Task<IEnumerable<InvoiceInformation>> GetInvoiceInformation(long invoiceId, string companyId, long? dataVersionId);

        Task<IEnumerable<long>> GetContractRelativesAsync(string companyId, long resourceId);

        Task CleanSessionAsync(string applicationSessionId);
    }
}
