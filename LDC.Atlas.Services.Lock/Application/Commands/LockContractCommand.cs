using LDC.Atlas.Services.Lock.Application.Queries.Dto;
using MediatR;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Lock.Application.Commands
{
    public class LockResourceCommand : IRequest<IEnumerable<LockDto>>
    {
        internal string CompanyId { get; set; } // internal to avoid the exposure in Swagger

        public LockFunctionalContext FunctionalContext { get; set; }

        public long ResourceId { get; set; }

        public string ResourceCode { get; set; }

        public string ApplicationSessionId { get; set; }

        public string ResourceType { get; set; }
    }

    public class LockContractCommand : LockResourceCommand
    {
    }

    public class LockCharterCommand : LockResourceCommand
    {
    }

    public class LockFxDealCommand : LockResourceCommand
    {
    }

    public class LockUserAccountCommand : LockResourceCommand
    {
    }

    public class LockUserProfileCommand : LockResourceCommand
    {
    }

    public class LockCostMatrixCommand : LockResourceCommand
    {
    }

    public class LockCashDocumentCommand : LockResourceCommand
    {
    }

    public class LockInvoiceCommand : LockResourceCommand
    {
    }

    public class LockAccountingDocumentCommand : LockResourceCommand
    {
    }

    public class UnlockResourceCommand : IRequest
    {
        internal string CompanyId { get; set; } // internal to avoid the exposure in Swagger

        public LockFunctionalContext FunctionalContext { get; set; }

        public long ResourceId { get; set; }

        public string ResourceCode { get; set; }

        public string ApplicationSessionId { get; set; }

        public string ResourceType { get; set; }
    }

    public class UnlockContractCommand : UnlockResourceCommand
    {
    }

    public class UnlockCharterCommand : UnlockResourceCommand
    {
    }

    public class UnlockFxDealCommand : UnlockResourceCommand
    {
    }

    public class UnlockUserAccountCommand : UnlockResourceCommand
    {
    }

    public class UnlockUserProfileCommand : UnlockResourceCommand
    {
    }

    public class UnlockCostMatrixCommand : UnlockResourceCommand
    {
    }

    public class UnlockCashDocumentCommand : UnlockResourceCommand
    {
    }

    public class UnlockInvoiceCommand : UnlockResourceCommand
    {
    }

    public class UnlockAccountingDocumentCommand : UnlockResourceCommand
    {
    }

    public class DeleteLocksCommand : IRequest
    {
        public IEnumerable<long> LockIds { get; set; }
    }

    public class RefreshLockOwnershipCommand : IRequest
    {
        internal string Company { get; set; } // internal to avoid the exposure in Swagger

        public string ApplicationSessionId { get; set; }

        public IEnumerable<LockResourceInformation> ResourcesInformation { get; set; }
    }

    public class LockResourceInformation
    {
        public string ResourceType { get; set; }

        public long ResourceId { get; set; }

        public string ResourceCode { get; set; }

        public bool NeedRefresh { get; set; }
    }

    public class CleanSessionCommand : IRequest
    {
        public string ApplicationSessionId { get; set; }
    }
}
