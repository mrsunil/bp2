using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public interface IBusinessSectorRepository
    {
        Task<IEnumerable<BusinessSector>> GetAllAsync(string companyId, bool includeDeactivated = false, string sectorCode = null, string description = null);

        Task UpdateBusinessSector(ICollection<BusinessSector> listBusinessSector);
    }
}
