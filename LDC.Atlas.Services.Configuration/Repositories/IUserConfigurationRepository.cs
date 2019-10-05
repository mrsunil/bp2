using LDC.Atlas.Services.Configuration.Entities;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Repositories
{
   public interface IUserConfigurationRepository
    {
        Task CreateUserPreferenceColumnAsync(UserPreference userPreference);
    }
}
