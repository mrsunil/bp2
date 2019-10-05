using MediatR;
using LDC.Atlas.Services.Execution.Entities;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Execution.Application.Commands
{
    public class YearEndProcessListCommand : IRequest<List<YearEndProcessReportResponse>>
    {
        internal string Company { get; set; }

        public int Year { get; set; }

        public bool IsFinalRun { get; set; }

        public long? BSReserveAccountId { get; set; }
    }
}
