using LDC.Atlas.Services.Execution.Entities;
using MediatR;

namespace LDC.Atlas.Services.Execution.Application.Commands
{
    public class CreateManualJournalDocumentCommand : IRequest<ManualJournalResponse>
    {
        internal string Company { get; set; } // internal to avoid the exposure in Swagger

        public ManualJournalDocument ManualJournal { get; set; }
    }
}
