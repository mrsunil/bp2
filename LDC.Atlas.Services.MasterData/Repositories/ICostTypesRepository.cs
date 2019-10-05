using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public interface ICostTypesRepository
    {
        Task<IEnumerable<CostType>> GetAllAsync(string company, bool includeDeactivated = false, string costTypeCode = null, string name = null);

        Task UpdateCostTypes(ICollection<CostType> listCostType);

    }
}
