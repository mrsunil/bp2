using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Authorization.Core.Entities;
using LDC.Atlas.Authorization.PolicyProvider.Authorization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace LDC.Atlas.Authorization.PolicyProvider.Services
{
    /// <summary>
    /// Type HTTP client to query User Identity API.
    /// See: https://docs.microsoft.com/en-us/aspnet/core/fundamentals/http-requests?view=aspnetcore-2.1#typed-clients
    /// </summary>
    public class UserIdentityService
    {
        private readonly HttpClient _client;
        private readonly UserIdentitySettings _userIdentitySettings;
        private readonly ILogger _logger;

        public UserIdentityService(HttpClient client, IOptions<UserIdentitySettings> configuration, ILogger<UserIdentityService> logger)
        {
            _client = client;
            _logger = logger;
            _userIdentitySettings = configuration.Value;
            _client.BaseAddress = new Uri(_userIdentitySettings.BaseUrl);
            _client.DefaultRequestHeaders.Add("Accept", "application/json");
            _client.DefaultRequestHeaders.Add("Atlas-Program-Id", "Atlas");
            _logger.LogInformation("BaseUrl: {Atlas_BaseAddress}", _client.BaseAddress);
        }

        public async Task<IEnumerable<UserCompanyPrivilegesDto>> GetCurrentUserPrivilegesAsync(string token, string companyId)
        {
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            string url = "users/me/privileges";
            if (companyId != null)
            {
                url = $"{url}?company={companyId}";
            }

            var response = await _client.GetAsync(url);

            var responseContent = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Calling Atlas API failed with status code {Atlas_HttpResponseStatusCode} and content {Atlas_HttpResponseContent}.", response.StatusCode, responseContent);

                throw new AtlasTechnicalException(responseContent);
            }

            if (!string.IsNullOrWhiteSpace(responseContent))
            {
                JObject responseObject = JObject.Parse(responseContent);
                var privileges = responseObject["value"].ToObject<IEnumerable<UserCompanyPrivilegesDto>>();

                return privileges;
            }

            return Enumerable.Empty<UserCompanyPrivilegesDto>();
        }

        public async Task<AuthenticatedUser> GetCurrentUserAsync(string token)
        {
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            string url = "users/me";

            var response = await _client.GetAsync(url);

            var responseContent = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Calling Atlas API failed with status code {Atlas_HttpResponseStatusCode} and content {Atlas_HttpResponseContent}.", response.StatusCode, responseContent);

                throw new AtlasTechnicalException(responseContent);
            }

            var user = JsonConvert.DeserializeObject<AuthenticatedUser>(responseContent);

            return user;
        }
    }
}
