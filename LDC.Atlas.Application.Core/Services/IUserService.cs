using LDC.Atlas.Application.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Application.Core.Services
{
    public interface IUserService
    {
        Task<User> GetUserByActiveDirectoryIdAsync(string userId);

        Task<User> GetUserByIdAsync(long userId, bool includeDeletedUsers = false);

        Task<IEnumerable<UserPrivilege>> GetPrivilegesForUserAsync(long userId, string company);
    }
}