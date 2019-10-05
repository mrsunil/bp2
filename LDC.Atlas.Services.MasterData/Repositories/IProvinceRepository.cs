using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public interface IProvinceRepository
    {
        Task<IEnumerable<Province>> GetAllAsync(string company, bool includeDeactivated = false, string stateCode = null, string description = null);
    }
}
