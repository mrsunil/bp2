using MediatR;
using System.Collections.Generic;

namespace LDC.Atlas.Services.PreAccounting.Application.Commands
{
    public class AuthorizeForPostingCommand : IRequest
    {
        internal string Company { get; set; }

        public IEnumerable<AccountingDocumentToAuthorizeForPosting> AccountingDocuments { get; set; }
    }

    public class AccountingDocumentToAuthorizeForPosting
    {
        public long AccountingId { get; set; }
    }
}
