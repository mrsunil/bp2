using System.Threading.Tasks;

namespace LDC.Atlas.Services.Reporting.Repositories
{
    public interface IAuditRepository
    {
        Task ProcessDataChangeLogAsync(int dataChangeLogId);
    }
}
