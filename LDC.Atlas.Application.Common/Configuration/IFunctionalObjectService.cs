using LDC.Atlas.Application.Common.Configuration.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Application.Common.Configuration
{
    public interface IFunctionalObjectService
    {
        Task<IEnumerable<FunctionalObjectDto>> GetAllFunctionalObjectsAsync(string name);

        Task<FunctionalObjectDto> GetFunctionalObjectByIdAsync(int id);

        Task<bool> IsFunctionalObjectExistsAsync(string name, int id);
    }
}
