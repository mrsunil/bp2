using LDC.Atlas.Application.Core.Entities;
using LDC.Atlas.Infrastructure.Services.Token;
using LDC.Atlas.Services.GenericBackInterface.Configuration;
using LDC.Atlas.Services.GenericBackInterface.Entities;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.GenericBackInterface.Services
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
        private readonly AtlasApplicationSettings _settings;

        public AtlasService(HttpClient client, ILogger<AtlasService> logger, ITokenProvider tokenProvider, IOptions<AtlasApplicationSettings> settings)
        {
            _client = client;
            _logger = logger;
            _tokenProvider = tokenProvider;
            _client.DefaultRequestHeaders.Add("Accept", MediaTypeNames.Application.Json);
            _client.DefaultRequestHeaders.Add("Atlas-Program-Id", "Atlas");
            _settings = settings?.Value ?? throw new ArgumentNullException(nameof(settings));
        }

        public async Task<ProcessESBResult> CallAtlasApiAsync(Response esbResponse)
        {
            Uri requestUri;
            var token = await _tokenProvider.GetBearerTokenAsync("AtlasApiOAuth2");

            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var stringContent = new StringContent(JsonConvert.SerializeObject(esbResponse), UnicodeEncoding.UTF8, "application/json");

            if (esbResponse.BusinessApplicationType == BusinessApplicationType.TRAX)
            {
                string paymentRequestInterfaceUrl = _settings.PaymentRequestInterfaceUrl;
                 requestUri = new Uri(esbResponse.CompanyId != null ? paymentRequestInterfaceUrl.Replace(
                    "{company}", esbResponse.CompanyId, StringComparison.InvariantCultureIgnoreCase) : paymentRequestInterfaceUrl);
            }
            else if (esbResponse.BusinessApplicationType == BusinessApplicationType.AX)
            {
                string accountingInterfaceUrl = _settings.AccountingInterfaceUrl;
                 requestUri = new Uri(esbResponse.CompanyId != null ? accountingInterfaceUrl.Replace(
                    "{company}", esbResponse.CompanyId, StringComparison.InvariantCultureIgnoreCase) : accountingInterfaceUrl);
            }
            else
            {
                throw new Exception("Bad Business Application Type");
            }

            _logger.LogInformation($"Calling Atlas API {requestUri.ToString()}.");

            var response = await _client.PostAsync(requestUri, stringContent);

            var content = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Calling Atlas API failed with status code {Atlas_HttpResponseStatusCode} and content {Atlas_HttpResponseContent}.", response.StatusCode, content);

                throw new Exception(content);
            }

            var processESBResult = JsonConvert.DeserializeObject<ProcessESBResult>(content);

            return processESBResult;
        }
    }
}
