using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public interface IRegionRepository
    {
        Task<IEnumerable<Region>> GetAllAsync(bool includeDeactivated = false, string ldcRegionCode = null, string description = null);

        Task UpdateRegions(ICollection<Region> listRegion);

        Task<IEnumerable<MasterDataDeleteResult>> DeleteRegions(IEnumerable<long> regionIds);
    }
}
