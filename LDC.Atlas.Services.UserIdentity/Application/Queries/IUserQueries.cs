using LDC.Atlas.Services.UserIdentity.Application.Queries.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.UserIdentity.Application.Queries
{
    public interface IUserQueries
    {
        Task<IEnumerable<UserDto>> GetUsersAsync(string name = null);

        Task<UserDto> GetUserByIdAsync(long userId, bool includeDeletedUsers = false);

        Task<UserDto> GetUserByActiveDirectoryIdAsync(string userId);

        Task<IEnumerable<DirectoryUser>> GetDirectoryUsersAsync(string searchTerm);

        Task<DirectoryUser> GetDirectoryUserByIdAsync(string userId);

        Task<IEnumerable<UserPrivilegeDto>> GetPrivilegesForUserAsync(long userId, string company);

        Task<IEnumerable<UserAccountDto>> GetUsersByProfilesAsync(int[] profileIds, string companyId, int? offset, int? limit);
    }
}
