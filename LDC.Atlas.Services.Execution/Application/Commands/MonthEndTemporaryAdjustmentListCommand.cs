using LDC.Atlas.Services.Execution.Entities;
using MediatR;
using System;

namespace LDC.Atlas.Services.Execution.Application.Commands
{
    public class MonthEndTemporaryAdjustmentListCommand : IRequest<MonthEndTAResponse>
    {
        public DateTime DocumentDate { get; set; }

        public DateTime? AccountingPeriod { get; set; }

        internal string Company { get; set; }

        public int? DataVersionId { get; set; }

        public DateTime DataVersionDate { get; set; }

        public int? ReportType { get; set; }
    }
}
