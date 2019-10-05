using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public interface IPortRepository
    {
        Task<IEnumerable<Port>> GetAllAsync(string company, int? offset, int? limit, bool includeDeactivated = false, string portCode = null, string description = null);

        Task UpdatePortsUnit(ICollection<Port> listPort);
    }
}
