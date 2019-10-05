using MediatR;
using System.Collections.Generic;

namespace LDC.Atlas.Services.PreAccounting.Application.Commands
{
    public class UpdateAccountingDocumentStatusToDeletedCommand : IRequest
    {
        internal string Company { get; set; }

        public List<AccountingDocumentToDeleted> AccountingDocuments { get; set; }
    }

    public class AccountingDocumentToDeleted
    {
        public long AccountingId { get; set; }
    }
}
