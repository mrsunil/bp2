using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public interface IProfitCenterRepository
    {
        Task<IEnumerable<ProfitCenter>> GetAllAsync(string[] company, bool includeDeactivated = false, string profitCenterCode = null, string description = null);

        Task UpdateProfitCenters(ICollection<ProfitCenter> listProfitCenters);
    }
}
