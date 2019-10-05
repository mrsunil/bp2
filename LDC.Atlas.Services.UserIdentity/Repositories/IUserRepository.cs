using LDC.Atlas.Services.UserIdentity.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.UserIdentity.Repositories
{
    public interface IUserRepository
    {
        Task<long> CreateUserAsync(User user);

        Task UpdateUserAsync(User user);

        Task DeleteUserAsync(long userId);

        Task DeleteUserAssignmentsAsync(long userId);

        Task<bool> CheckUserExistsAsync(long userId);

        Task<bool> CheckUserExistsAsync(string userPrincipalName);

        Task UpdateUserLastConnectionDate(long userId);

        Task UpdateUserIAGAsync(IEnumerable<UserIAG> userIAG);
    }
}
