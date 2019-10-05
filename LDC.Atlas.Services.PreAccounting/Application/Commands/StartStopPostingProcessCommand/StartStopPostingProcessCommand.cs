using MediatR;

namespace LDC.Atlas.Services.PreAccounting.Application.Commands
{
    public class StartStopPostingProcessCommand : IRequest<bool>
    {
        internal string Company { get; set; }

        public bool IsActive { get; set; }
    }
}
