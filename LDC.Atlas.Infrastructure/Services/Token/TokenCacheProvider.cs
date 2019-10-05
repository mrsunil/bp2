using LDC.Atlas.Infrastructure.Models;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System.Security.Claims;
using System.Threading.Tasks;

namespace LDC.Atlas.Infrastructure.Services.Token
{
    public class TokenCacheProvider : ITokenCacheProvider
    {
        private readonly IDataProtectionProvider _dataProtectionProvider;
        private readonly IDistributedCache _distributedCache;
        private readonly IOptionsSnapshot<AzureAdConfiguration> _configuration;
        private TokenCache _cache;

        public TokenCacheProvider(IDistributedCache distributedCache, IDataProtectionProvider dataProtectionProvider, IOptionsSnapshot<AzureAdConfiguration> configuration)
        {
            _distributedCache = distributedCache;
            _dataProtectionProvider = dataProtectionProvider;
            _configuration = configuration;
        }

        public Task<TokenCache> GetCacheAsync(ClaimsPrincipal claimsPrincipal = null)
        {
            if (_cache == null)
            {
                _cache = new DistributedTokenCache(_distributedCache, _dataProtectionProvider, _configuration, claimsPrincipal);
            }

            return Task.FromResult(_cache);
        }

        public virtual async Task ClearCacheAsync(ClaimsPrincipal claimsPrincipal = null)
        {
            var cache = await GetCacheAsync(claimsPrincipal);
            cache.Clear();
        }
    }
}
