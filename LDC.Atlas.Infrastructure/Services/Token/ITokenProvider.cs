using System.Security.Claims;
using System.Threading.Tasks;

namespace LDC.Atlas.Infrastructure.Services.Token
{
    public interface ITokenProvider
    {
        Task<string> GetBearerTokenAsync(string optionName = null);

        // Task<string> GetBearerTokenAsync(ClaimsPrincipal user);

        // Task ClearCacheAsync(ClaimsPrincipal claimPrincipal);
    }
}
