using LDC.Atlas.Services.Configuration.Entities;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Repositories
{
    public interface IFunctionalObjectRepository
    {
        Task<int> CreateFunctionalObject(FunctionalObject functionalObject);

        Task<int> UpdateFunctionalObject(FunctionalObject functionalObject);

        Task<bool> IsFunctionalObjectExistsAsync(string name, int? id = null);
    }
}
