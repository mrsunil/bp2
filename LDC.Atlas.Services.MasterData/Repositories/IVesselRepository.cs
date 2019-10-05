using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public interface IVesselRepository
    {
        Task<IEnumerable<Vessel>> GetAllAsync(string company, bool includeDeactivated = false, string vesselName = null, string vesselDescription = null);

        Task UpdateVessel(ICollection<Vessel> listVessel);
    }
}
