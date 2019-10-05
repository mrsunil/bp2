using MediatR;

namespace LDC.Atlas.Services.PreAccounting.Application.Commands
{
    public class UpdateAccountingDocumentStatusToPostedCommand : IRequest
    {
        internal string Company { get; set; }

        public long DocId { get; set; }

        public bool PostOpClosedPolicy { get; set; }
    }
}
