using Microsoft.Graph;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.UserIdentity.Services.Graph
{
    public interface IGraphClient
    {
        Task<User> GetUserByIdAsync(string userId);

        Task<DirectoryObject> GetUserManagerByIdAsync(string userId);

        Task<IGraphServiceUsersCollectionPage> SearchUsersAsync(string searchTerm);

        Task<List<DirectoryObject>> GetTransitiveGroupMembersAsync();
    }
}