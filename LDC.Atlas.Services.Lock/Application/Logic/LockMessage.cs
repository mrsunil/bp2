using LDC.Atlas.Services.Lock.Application.Queries.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Lock.Application.Logic
{
    public static class LockMessage
    {
        private static Dictionary<LockFunctionalContext, Func<LockStateResponseDto, string>> messages = new Dictionary<LockFunctionalContext, Func<LockStateResponseDto, string>>()
        {
            { LockFunctionalContext.TradeEdit, (lockState) => { return $"The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner} running 'trade edition'."; } },
            { LockFunctionalContext.RelativeTradeEdit, (lockState) => { return $"The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner} running 'relative trade edition'."; } },
            { LockFunctionalContext.TradeApproval, (lockState) => { return $"The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner} running 'trade approval'."; } },
            { LockFunctionalContext.TradeSplit, (lockState) => { return $"The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner} running 'trade split'."; } },
            { LockFunctionalContext.TradeTranche, (lockState) => { return $"The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner} running 'trade tranching'."; } },
            { LockFunctionalContext.TradeAssignment, (lockState) => { return $"The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner} running 'trade assignment'."; } },
            { LockFunctionalContext.TradeDeassignment, (lockState) => { return $"The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner} running 'trade de-assignment'."; } },
            { LockFunctionalContext.BulkEdition, (lockState) => { return $" The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner} running 'bulk edition'."; } },
            { LockFunctionalContext.BulkApproval, (lockState) => { return $" The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner} running 'bulk approval'."; } },
            { LockFunctionalContext.TradeBulkClosure, (lockState) => { return $"The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner} running 'trade bulk closure'."; } },
            { LockFunctionalContext.FxDeal, (lockState) => { return $"The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner} running 'Fx Deal'."; } },
            { LockFunctionalContext.TradeMerge, (lockState) => { return $" The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner} running 'trade merge'."; } },
            { LockFunctionalContext.CharterEdit, (lockState) => { return $"The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner} running 'charter edition'."; } },
            { LockFunctionalContext.CharterDeletion, (lockState) => { return $"The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner} running 'charter deletion'."; } },
            { LockFunctionalContext.CharterBulkClosure, (lockState) => { return $"The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner} running 'charter bulk closure'."; } },
            { LockFunctionalContext.ContractInvoicing, (lockState) => { return $"The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner} running 'contract invoicing'."; } },
            { LockFunctionalContext.CostInvoicing, (lockState) => { return $"The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner} running 'cost invoicing'."; } },
            { LockFunctionalContext.GoodsAndCostsInvoicing, (lockState) => { return $"The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner} running 'goods and costs invoicing'."; } },
            { LockFunctionalContext.WashoutInvoicing, (lockState) => { return $"The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner} running 'washout invoicing'."; } },
            { LockFunctionalContext.ReversalInvoicing, (lockState) => { return $"The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner} running 'reversal invoicing'."; } },
            { LockFunctionalContext.Allocation, (lockState) => { return $"The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner} running 'trade allocation'."; } },
            { LockFunctionalContext.RelativeAllocation, (lockState) => { return $"The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner} running 'relative allocation'."; } },
            { LockFunctionalContext.Deallocation, (lockState) => { return $"The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner} running 'de-allocation'."; } },
            { LockFunctionalContext.RelativeDeallocation, (lockState) => { return $"The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner} running 'relative de-allocation'."; } },
            { LockFunctionalContext.CostMatrixEdition, (lockState) => { return $"The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner} running 'cost matrix edition'."; } },
            { LockFunctionalContext.CostMatrixDeletion, (lockState) => { return $"The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner} running 'cost matrix deletion'."; } },
            { LockFunctionalContext.MasterDataEdition, (lockState) => { return $"The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner} running 'master data edition'."; } },
            { LockFunctionalContext.UserAccountEdition, (lockState) => { return $"The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner} running 'user account edition'."; } },
            { LockFunctionalContext.UserAccountDeletion, (lockState) => { return $"The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner} running 'user account deletion'."; } },
            { LockFunctionalContext.UserProfileEdition, (lockState) => { return $"The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner} running 'user profile edition'."; } },
            { LockFunctionalContext.UserProfileDeletion, (lockState) => { return $"The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner} running 'user profile deletion'."; } },
            { LockFunctionalContext.AccountingDocumentEdition, (lockState) => { return $"The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner} running 'accounting document edition'."; } },
            { LockFunctionalContext.AccountingDocumentAuthorizeForPosting, (lockState) => { return $"The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner} running 'accounting document authorize for posting'."; } },
            { LockFunctionalContext.AccountingDocumentReversal, (lockState) => { return $"The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner} running 'accounting document reversal'."; } },
            { LockFunctionalContext.CashDocumentEdition, (lockState) => { return $"The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner} running 'cash document edition'."; } },
            { LockFunctionalContext.CashDocumentDeletion, (lockState) => { return $"The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner} running 'cash document deletion'."; } },
        };

        public static string GenerateLockMessage(LockStateResponseDto lockState)
        {
            if (lockState.FunctionalContext == null)
            {
                if (string.IsNullOrEmpty(lockState.ResourceCode))
                {
                    return string.Empty;
                }
                else
                {
                    return $"You have lost the lock of the {lockState.ResourceType} {lockState.ResourceCode}.";
                }
            }
            else if (messages.ContainsKey(lockState.FunctionalContext.Value))
            {
                return messages[lockState.FunctionalContext.Value].Invoke(lockState);
            }

            return $"The {lockState.ResourceType} {lockState.ResourceCode} is already locked by {lockState.LockOwner}.";
        }
    }
}
