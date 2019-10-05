using MediatR;

namespace LDC.Atlas.Services.Configuration.Application.Commands
{
    public class ExecuteBatchCommand : IRequest
    {
        public int ActionId { get; set; }

        public int GroupId { get; set; }
    }
}
