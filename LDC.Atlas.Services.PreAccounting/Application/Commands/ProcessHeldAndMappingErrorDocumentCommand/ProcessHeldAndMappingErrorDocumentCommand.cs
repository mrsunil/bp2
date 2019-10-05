using MediatR;

namespace LDC.Atlas.Services.PreAccounting.Application.Commands
{
    public class ProcessHeldAndMappingErrorDocumentCommand : IRequest
    {
        internal string Company { get; set; }
    }
}
