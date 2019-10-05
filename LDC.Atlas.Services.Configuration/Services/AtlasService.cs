using LDC.Atlas.Application.Core.Entities;
using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Authorization.PolicyProvider.Authorization;
using LDC.Atlas.Infrastructure.Models;
using LDC.Atlas.Infrastructure.Services.Token;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mime;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Services
{
    /// <summary>
    /// Type HTTP client to query the Atlas APIs.
    /// See: https://docs.microsoft.com/en-us/aspnet/core/fundamentals/http-requests?view=aspnetcore-2.1#typed-clients
    /// </summary>
    public class AtlasService
    {
        private readonly HttpClient _client;
        private readonly ILogger _logger;
        private readonly ITokenProvider _tokenProvider;
        private readonly IOptions<ApplicationDetail> _applicationDetail;
        private readonly IOptions<UserIdentitySettings> _userIdentitySettings;

        public AtlasService(HttpClient client, ILogger<AtlasService> logger, ITokenProvider tokenProvider, IOptions<ApplicationDetail> applicationDetail, IOptions<UserIdentitySettings> userIdentitySettings)
        {
            _client = client;
            _logger = logger;
            _tokenProvider = tokenProvider;
            _applicationDetail = applicationDetail;
            _client.DefaultRequestHeaders.Add("Accept", MediaTypeNames.Application.Json);
            _userIdentitySettings = userIdentitySettings;
        }

        public async Task CreateFreeze(string companyId, DataVersionType dataVersionType)
        {
            var token = await _tokenProvider.GetBearerTokenAsync("AtlasApiOAuth2");

            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var endPoint = $"{_applicationDetail.Value.Endpoints.FreezeUrl}/{{company}}/freezes";

            var requestUri = new Uri(endPoint.Replace("{company}", companyId, StringComparison.InvariantCultureIgnoreCase));

            _logger.LogInformation($"Calling Atlas API {requestUri.ToString()}.");

            var response = await _client.PostAsJsonAsync(requestUri, new
            {
                DataVersionTypeId = dataVersionType
            });

            if (!response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();

                _logger.LogError("Calling Atlas API failed with status code {Atlas_HttpResponseStatusCode} and content {Atlas_HttpResponseContent}.", response.StatusCode, content);

                throw new AtlasTechnicalException(content);
            }
        }

        public async Task ProcessHeldAndMappingErrorDocuments(string companyId)
        {
            var token = await _tokenProvider.GetBearerTokenAsync("AtlasApiOAuth2");

            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var endPoint = $"{_applicationDetail.Value.Endpoints.PreAccountingUrl}/{{company}}/accountingdocuments/processheldandmappingerrordocument";

            var requestUri = new Uri(endPoint.Replace("{company}", companyId, StringComparison.InvariantCultureIgnoreCase));

            _logger.LogInformation($"Calling Atlas API {requestUri.ToString()}.");

            var response = await _client.PostAsJsonAsync<string>(requestUri, null);

            if (!response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();

                _logger.LogError("Calling Atlas API failed with status code {Atlas_HttpResponseStatusCode} and content {Atlas_HttpResponseContent}.", response.StatusCode, content);

                throw new AtlasTechnicalException($"Calling Atlas API failed with status code {response.StatusCode} and content {content}.");
            }
        }

        public async Task SettleFxDealAndCreateFJDocuments(string companyId)
        {
            var token = await _tokenProvider.GetBearerTokenAsync("AtlasApiOAuth2");

            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var endPoint = $"{_applicationDetail.Value.Endpoints.TradeUrl}/{{company}}/FxDeals/fxDealSettlement";

            var requestUri = new Uri(endPoint.Replace("{company}", companyId, StringComparison.InvariantCultureIgnoreCase));

            _logger.LogInformation($"Calling Atlas API {requestUri.ToString()}.");

            var response = await _client.PostAsJsonAsync<string>(requestUri, null);

            if (!response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();

                _logger.LogError("Calling Atlas API failed with status code {Atlas_HttpResponseStatusCode} and content {Atlas_HttpResponseContent}.", response.StatusCode, content);

                throw new AtlasTechnicalException($"Calling Atlas API failed with status code {response.StatusCode} and content {content}.");
            }
        }

        public async Task SyncAndSaveADStatusProcess()
        {
            var token = await _tokenProvider.GetBearerTokenAsync("AtlasApiOAuth2");

            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var endPoint = $"{_userIdentitySettings.Value.BaseUrl}Users/saveactivedirdata";

            var requestUri = new Uri(endPoint);

            _logger.LogInformation($"Calling Atlas API {requestUri.ToString()}.");

            var response = await _client.PostAsJsonAsync<string>(requestUri, null);

            if (!response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();

                _logger.LogError("Calling Atlas API failed with status code {Atlas_HttpResponseStatusCode} and content {Atlas_HttpResponseContent}.", response.StatusCode, content);

                throw new AtlasTechnicalException($"Calling Atlas API failed with status code {response.StatusCode} and content {content}.");
            }
        }
    }
}
