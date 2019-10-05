using LDC.Atlas.Services.UserIdentity.Entities;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.UserIdentity.Repositories
{
    public interface IProfileRepository
    {
        Task<int> CreateProfileAsync(Profile profile);

        Task UpdateProfileAsync(Profile profile);

        Task DeleteProfileAsync(int profileId);

        Task<bool> CheckProfileExistsAsync(string profileName, int? profileIdToExclude = null);

        Task<bool> CheckProfileExistsAsync(int profileId);

        Task<int> GetNumberOfUsersAsync(int profileId);

        Task<string> GetProfileNameAsync(int profileId);
    }
}
