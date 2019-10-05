using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Lock.Application.Queries.Dto;
using LDC.Atlas.Services.Lock.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Lock.Repositories
{
    public class LockRepository : BaseRepository, ILockRepository
    {
        public LockRepository(IDapperContext dapperContext)
          : base(dapperContext)
        {
        }

        public async Task<IEnumerable<LockDto>> CreateLocksAsync(IEnumerable<LockDto> locks, string companyId, string user)
        {
            DynamicParameters queryParameters = new DynamicParameters();

            queryParameters.Add("@Lock", ConvertToLockUDTT(locks, user));
            var sec = await ExecuteQueryAsync<LockDto>(StoredProcedureNames.CreateLock, queryParameters, true);
            return sec;
        }

        private static DataTable ConvertToLockUDTT(IEnumerable<LockDto> locks, string user)
        {
            var udtt = new DataTable();
            udtt.SetTypeName("[Lock].[UDTT_Lock]");

            var lockId = new DataColumn("LockId", typeof(long));
            udtt.Columns.Add(lockId);
            var companyId = new DataColumn("CompanyId", typeof(string));
            udtt.Columns.Add(companyId);
            var resourceId = new DataColumn("ResourceId", typeof(string));
            udtt.Columns.Add(resourceId);
            var resourceCode = new DataColumn("ResourceCode", typeof(string));
            udtt.Columns.Add(resourceCode);
            var dataVersionId = new DataColumn("DataVersionId", typeof(int));
            udtt.Columns.Add(dataVersionId);
            var resourceType = new DataColumn("ResourceType", typeof(string));
            udtt.Columns.Add(resourceType);
            var lockOwner = new DataColumn("LockOwner", typeof(string));
            udtt.Columns.Add(lockOwner);
            var lockAcquisitionDateTime = new DataColumn("LockAcquisitionDateTime", typeof(DateTime));
            udtt.Columns.Add(lockAcquisitionDateTime);
            var functionalContext = new DataColumn("FunctionalContext", typeof(int));
            udtt.Columns.Add(functionalContext);
            var applicationSessionId = new DataColumn("ApplicationSessionId", typeof(string));
            udtt.Columns.Add(applicationSessionId);
            var createdDateTime = new DataColumn("CreatedDateTime", typeof(DateTime));
            udtt.Columns.Add(createdDateTime);
            var createdBy = new DataColumn("CreatedBy", typeof(string));
            udtt.Columns.Add(createdBy);
            var modifiedDateTime = new DataColumn("ModifiedDateTime", typeof(DateTime));
            udtt.Columns.Add(modifiedDateTime);
            var modifiedBy = new DataColumn("ModifiedBy", typeof(string));
            udtt.Columns.Add(modifiedBy);

            foreach (var @lock in locks)
            {
                var row = udtt.NewRow();

                row[lockId] = @lock.LockId;
                row[companyId] = @lock.CompanyId;
                row[resourceId] = @lock.ResourceId;
                row[resourceCode] = @lock.ResourceCode;
                row[dataVersionId] = @lock.DataVersionId;
                row[resourceType] = @lock.ResourceType;
                row[lockOwner] = @lock.LockOwner;
                row[lockAcquisitionDateTime] = @lock.LockAcquisitionDateTime;
                row[functionalContext] = @lock.FunctionalContext;
                row[applicationSessionId] = @lock.ApplicationSessionId;
                row[createdDateTime] = DateTime.UtcNow;
                row[createdBy] = user;
                udtt.Rows.Add(row);
            }

            return udtt;
        }

        public async Task DeleteLockAsync(long lockId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@LockId", lockId);

            await ExecuteNonQueryAsync(StoredProcedureNames.DeleteLock, queryParameters, true);
        }

        public async Task RefreshLockOwnershipAsync(string companyId, string resourceType, long resourceId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add("@ResourceId", resourceId);
            queryParameters.Add("@ResourceType", resourceType);

            await ExecuteNonQueryAsync(StoredProcedureNames.RefreshLockOwnership, queryParameters, true);
        }

        public async Task<SectionInformation> GetSectionInformationAsync(string companyId, long resourceId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add("@SectionId", resourceId);
            var sec = await ExecuteQueryFirstOrDefaultAsync<SectionInformation>(StoredProcedureNames.GetSectionInformation, queryParameters);
            return sec;
        }

        public async Task<CharterInformation> GetCharterInformationAsync(string companyId, long resourceId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add("@CharterId", resourceId);
            var charterInformation = await ExecuteQueryFirstOrDefaultAsync<CharterInformation>(StoredProcedureNames.GetCharterInformation, queryParameters);
            return charterInformation;
        }

        public async Task<FxDealInformation> GetFxDealInformationAsync(string companyId, long resourceId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add("@FxDealId", resourceId);
            var fxDealInformation = await ExecuteQueryFirstOrDefaultAsync<FxDealInformation>(StoredProcedureNames.GetFxDealInformation, queryParameters);
            return fxDealInformation;
        }

        public async Task<IEnumerable<long>> GetContractRelativesAsync(string companyId, long resourceId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add("@SectionId", resourceId);
            queryParameters.Add("@DataversionId", null);
            var sec = await ExecuteQueryAsync<long>(StoredProcedureNames.GetContractRelatives, queryParameters);
            return sec;
        }

        public async Task UnlockAsync(IEnumerable<UnlockDto> unlocks)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", unlocks.First().CompanyId);
            queryParameters.Add("@Unlock", ConvertToUnlockUDTT(unlocks));
            await ExecuteNonQueryAsync(StoredProcedureNames.Unlock, queryParameters, true);
        }

        private static DataTable ConvertToUnlockUDTT(IEnumerable<UnlockDto> unlocks)
        {
            var udtt = new DataTable();
            udtt.SetTypeName("[Lock].[UDTT_Unlock]");

            var companyId = new DataColumn("CompanyId", typeof(string));
            udtt.Columns.Add(companyId);
            var resourceId = new DataColumn("ResourceId", typeof(string));
            udtt.Columns.Add(resourceId);
            var resourceType = new DataColumn("ResourceType", typeof(string));
            udtt.Columns.Add(resourceType);
            var applicationSessionId = new DataColumn("ApplicationSessionId", typeof(string));
            udtt.Columns.Add(applicationSessionId);

            foreach (var unlock in unlocks)
            {
                var row = udtt.NewRow();
                row[companyId] = unlock.CompanyId;
                row[resourceId] = unlock.ResourceId;
                row[resourceType] = unlock.ResourceType;
                row[applicationSessionId] = unlock.ApplicationSessionId;
                udtt.Rows.Add(row);
            }

            return udtt;
        }

        public async Task CleanSessionAsync(string applicationSessionId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@ApplicationSessionId", applicationSessionId);
            await ExecuteNonQueryAsync(StoredProcedureNames.CleanSession, queryParameters, true);
        }

        public async Task<UserAccountInformation> GetUserAccountInformation(long userId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@UserId", userId);
            var userAccountInformation = await ExecuteQueryFirstOrDefaultAsync<UserAccountInformation>(StoredProcedureNames.GetUserAccountInformation, queryParameters);
            return userAccountInformation;
        }

        public async Task<UserProfileInformation> GetUserProfileInformation(long profileId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@ProfileId", profileId);
            var userProfileInformation = await ExecuteQueryFirstOrDefaultAsync<UserProfileInformation>(StoredProcedureNames.GetUserProfileInformation, queryParameters);
            return userProfileInformation;
        }

        public async Task<CostMatrixInformation> GetCostMatrixInformation(long costMatrixId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CostMatrixId", costMatrixId);
            var costMatrixInformation = await ExecuteQueryFirstOrDefaultAsync<CostMatrixInformation>(StoredProcedureNames.GetCostMatrixInformation, queryParameters);
            return costMatrixInformation;
        }

        public async Task<CashDocumentInformation> GetCashDocumentInformation(long cashId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CashId", cashId);
            var cashDocumentInformation = await ExecuteQueryFirstOrDefaultAsync<CashDocumentInformation>(StoredProcedureNames.GetCashDocumentInformation, queryParameters);
            return cashDocumentInformation;
        }

        public async Task<AccountingDocumentInformation> GetAccountingDocumentInformation(long accountingId, string companyId, long? dataVersionId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@AccountingId", accountingId);
            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add(DataVersionIdParameter, dataVersionId);
            var cashDocumentInformation = await ExecuteQueryFirstOrDefaultAsync<AccountingDocumentInformation>(StoredProcedureNames.GetAccountingDocumentInformation, queryParameters);
            return cashDocumentInformation;
        }

        public async Task<IEnumerable<InvoiceInformation>> GetInvoiceInformation(long invoiceId, string companyId, long? dataVersionId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@CompanyId", companyId);
            queryParameters.Add("@InvoiceId", invoiceId);
            queryParameters.Add(DataVersionIdParameter, dataVersionId);
            var sec = await ExecuteQueryAsync<InvoiceInformation>(StoredProcedureNames.GetInvoiceInformation, queryParameters);
            return sec;
        }

        private static class StoredProcedureNames
        {
            internal const string CreateLock = "[Lock].[usp_CreateLock]";
            internal const string Unlock = "[Lock].[usp_Unlock]";
            internal const string DeleteLock = "[Lock].[usp_DeleteLock]";
            internal const string RefreshLockOwnership = "[Lock].[usp_RefreshLockOwnership]";
            internal const string DeleteExpiredLocks = "[Lock].[usp_DeleteExpiredLocks]";
            internal const string GetSetupByKey = "[Lock].[usp_GetSetupByKey]";
            internal const string GetSectionInformation = "[Lock].[usp_GetSectionInformation]";
            internal const string GetCharterInformation = "[Lock].[usp_GetCharterInformation]";
            internal const string GetFxDealInformation = "[Lock].[usp_GetFxDealInformation]";
            internal const string GetContractRelatives = "[Lock].[usp_GetContractRelatives]";
            internal const string CleanSession = "[Lock].[usp_CleanSession]";
            internal const string GetUserAccountInformation = "[Lock].[usp_GetUserAccountInformation]";
            internal const string GetUserProfileInformation = "[Lock].[usp_GetUserProfileInformation]";
            internal const string GetCostMatrixInformation = "[Lock].[usp_GetCostMatrixInformation]";
            internal const string GetCashDocumentInformation = "[Lock].[usp_GetCashDocumentInformation]";
            internal const string GetInvoiceInformation = "[Lock].[usp_GetInvoiceInformation]";
            internal const string GetAccountingDocumentInformation = "[Lock].[usp_GetAccountingDocumentInformation]";
        }

        private static class SetupKeys
        {
            internal const string ExpirationElapseInSeconds = "ExpirationElapseInSeconds";
        }
    }
}
