using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Repositories
{
    public interface ICleanUpRepository
    {
        Task CleanUpAudit(int companyId);

        Task CleanUpProcessMessages(int companyId);

        Task CleanUpSSRSPredicates(int companyId);
    }
}
