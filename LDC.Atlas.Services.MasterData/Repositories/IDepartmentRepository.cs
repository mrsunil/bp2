using LDC.Atlas.Services.MasterData.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Repositories
{
    public interface IDepartmentRepository
    {
        Task<IEnumerable<Department>> GetAllAsync(string[] company, string departmentCode, int? offset, int? limit, bool flag = false, bool includeDeactivated = false, string description = null);

        Task UpdateDepartments(ICollection<Department> listDepartments);

        Task<IEnumerable<MasterDataDeleteResult>> DeleteDepartments(IEnumerable<long> departmentIds);
    }
}
