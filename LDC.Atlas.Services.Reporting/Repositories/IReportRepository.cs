using LDC.Atlas.Services.Reporting.Entities;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Reporting.Repositories
{
    public interface IReportRepository
    {
        Task<int> CreateReportCriteriasAsync(ReportPredicate predicate);
    }
}
