using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Infrastructure.Models;
using LDC.Atlas.Infrastructure.Services.Token;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace LDC.Atlas.Infrastructure.Services.Tokens
{
    public class TokenProvider : ITokenProvider
    {
        private readonly ILogger<TokenProvider> _logger;
        private readonly IOptionsSnapshot<AzureAdConfiguration> _adOptions;
        private readonly ITokenCacheProvider _tokenCacheProvider;

        public TokenProvider(ILogger<TokenProvider> logger, IOptionsSnapshot<AzureAdConfiguration> adOptions, ITokenCacheProvider tokenCacheProvider)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _adOptions = adOptions ?? throw new ArgumentNullException(nameof(adOptions));
             _tokenCacheProvider = tokenCacheProvider ?? throw new ArgumentNullException(nameof(tokenCacheProvider));
        }

        public async Task<string> GetBearerTokenAsync(string optionName = null)
        {
            // https://github.com/Azure-Samples/active-directory-dotnet-daemon/blob/master/TodoListDaemon/Program.cs
            // https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-devhowto-adal-error-handling#error-cases-and-actionable-steps-service-to-service-applications-net-only
            AuthenticationResult authenticationResult = null;
            int retryCount = 0;
            bool retry = false;

            do
            {
                retry = false;
                try
                {
                    var adOptions = GetConfiguration(optionName);

                    var authenticationContext = await CreateAuthenticationContext(adOptions);

                    ClientCredential clientCredential = new ClientCredential(adOptions.ClientId, adOptions.ClientSecret);

                    _logger.LogInformation($"Get token for ClientId: {adOptions.ClientId}");

                    authenticationResult = await authenticationContext.AcquireTokenAsync(adOptions.Resource, clientCredential);
                }
                catch (AdalException ex)
                {
                    if (ex.ErrorCode == "temporarily_unavailable")
                    {
                        retry = true;
                        retryCount++;
                        await Task.Delay(2000);
                    }

                    _logger.LogWarning($"An error occurred while acquiring a token\nTime: {DateTime.UtcNow}\nError: {ex.ToString()}\nRetry: {retry}\n");
                }
            }
            while (retry && (retryCount < 3));

            if (authenticationResult == null)
            {
                throw new AtlasTechnicalException("Cannot acquire an access token.");
            }

            return authenticationResult.AccessToken;
        }

        public async Task ClearCacheAsync(ClaimsPrincipal claimsPrincipal = null)
        {
            await _tokenCacheProvider.ClearCacheAsync(claimsPrincipal);
        }

        private AzureAdConfiguration GetConfiguration(string optionName = null)
        {
            var adOptions = _adOptions.Get(optionName ?? string.Empty);

            if (adOptions == null)
            {
                throw new AtlasTechnicalException($"No AD configuration found for name '{optionName}'");
            }

            return adOptions;
        }

        private async Task<AuthenticationContext> CreateAuthenticationContext(AzureAdConfiguration adOptions, ClaimsPrincipal claimsPrincipal = null)
        {
            return new AuthenticationContext(
                adOptions.Authority,
                await _tokenCacheProvider.GetCacheAsync(claimsPrincipal));
        }
    }
}
