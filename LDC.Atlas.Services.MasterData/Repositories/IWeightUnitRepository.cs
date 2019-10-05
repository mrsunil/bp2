using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public interface IWeightUnitRepository
    {
        Task<IEnumerable<WeightUnit>> GetAllAsync(string company, bool includeDeactivated = false, string weightCode = null, string description = null);

        Task UpdateweightUnit(ICollection<WeightUnit> listWeightUnit);

        Task<IEnumerable<CompanyAssignment>> GetAssignmentsAsync(IEnumerable<long> weightUnitIds);
    }
}
