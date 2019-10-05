using MediatR;

namespace LDC.Atlas.Services.Interface.Application.Commands
{
    public class StartStopInterfaceProcessCommand : IRequest<bool>
    {
        public bool IsActive { get; set; }
    }
}
