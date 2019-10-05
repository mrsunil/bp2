using LDC.Atlas.Infrastructure.ViewModel;
using MediatR;
using System.ComponentModel.DataAnnotations;

namespace LDC.Atlas.Services.Reporting.Application.Commands
{
    public class CreateReportCriteriasCommand : IRequest<int>
    {
        internal string Company { get; set; } // internal to avoid the exposure in Swagger

        public ReportCriteriasRequest ReportCriterias { get; set; }
    }

    public class ReportCriteriasRequest
    {
        [Required]
        public string GridName { get; set; }

        [Required]
        public QueryClause Clauses { get; set; }
    }
}
