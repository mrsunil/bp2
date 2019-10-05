using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System.Security.Claims;
using System.Threading.Tasks;

namespace LDC.Atlas.Infrastructure.Services.Token
{
    public interface ITokenCacheProvider
    {
        Task<TokenCache> GetCacheAsync(ClaimsPrincipal claimsPrincipal = null);

        Task ClearCacheAsync(ClaimsPrincipal claimsPrincipal = null);
    }
}
