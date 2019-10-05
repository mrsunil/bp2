using LDC.Atlas.Infrastructure.Models;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System.Security.Claims;

namespace LDC.Atlas.Infrastructure.Services.Token
{
    public class DistributedTokenCache : TokenCache
    {
        private readonly ClaimsPrincipal _claimsPrincipal;
        private readonly IDistributedCache _distributedCache;
        private readonly IDataProtectionProvider _dataProtectionProvider;
        private readonly IDataProtector _dataProtector;
        private readonly AzureAdConfiguration _azureAdConfiguration;
        private readonly string _key;

        public DistributedTokenCache(IDistributedCache distributedCache, IDataProtectionProvider dataProtectionProvider, IOptionsSnapshot<AzureAdConfiguration> configuration, ClaimsPrincipal claimsPrincipal = null)
        {
            _claimsPrincipal = claimsPrincipal;
            _distributedCache = distributedCache;
            _dataProtectionProvider = dataProtectionProvider;
            _azureAdConfiguration = configuration.Value;

            _dataProtector = dataProtectionProvider.CreateProtector(typeof(DistributedTokenCache).FullName);
            _key = GenerateKey(claimsPrincipal);

            BeforeAccess = OnBeforeAccess;
            AfterAccess = OnAfterAccess;
        }

        private string GenerateKey(ClaimsPrincipal claimsPrincipal)
        {
            string objectId;
            if (claimsPrincipal == null)
            {
                objectId = _azureAdConfiguration.ClientId + _azureAdConfiguration.Resource;
            }
            else
            {
                objectId = claimsPrincipal.FindFirst(AzureAdClaimTypes.ObjectId)?.Value + _azureAdConfiguration.Resource;
            }

            return objectId;
        }

        private void OnBeforeAccess(TokenCacheNotificationArgs notificationArgs)
        {
            byte[] cache = _distributedCache.Get(_key);
            if (cache != null)
            {
                Deserialize(_dataProtector.Unprotect(cache));
            }
        }

        private void OnAfterAccess(TokenCacheNotificationArgs notificationArgs)
        {
            if (HasStateChanged)
            {
                try
                {
                    if (Count > 0)
                    {
                        _distributedCache.Set(_key, _dataProtector.Protect(Serialize()));
                    }
                    else
                    {
                        _distributedCache.Remove(_key);
                    }

                    HasStateChanged = false;
                }
                catch
                {
                    throw;
                }
            }
        }
    }
}
