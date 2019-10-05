using MediatR;

namespace LDC.Atlas.Services.Reporting.Application.Commands
{
    public class ProcessDataChangeLogsRequest : IRequest
    {
        public int ChangeLogId { get; set; }
    }
}
