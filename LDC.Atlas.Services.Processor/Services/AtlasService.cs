using LDC.Atlas.Infrastructure.Services.Token;
using LDC.Atlas.Services.Processor.Configuration;
using LDC.Atlas.Services.Processor.Entities;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Processor.Services
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

        public AtlasService(IOptions<BackgroundTaskSettings> settings, HttpClient client, ILogger<AtlasService> logger, ITokenProvider tokenProvider)
        {
            _client = client;
            _logger = logger;
            _tokenProvider = tokenProvider;
            _client.DefaultRequestHeaders.Add("Accept", MediaTypeNames.Application.Json);
            _client.DefaultRequestHeaders.Add("Atlas-Program-Id", "Atlas");
            _client.Timeout = TimeSpan.FromSeconds(settings.Value.HttpClientTimeout);
        }

        public async Task CallAtlasApiAsync(Message message, ProcessType processType)
        {
            var token = await _tokenProvider.GetBearerTokenAsync("AtlasApiOAuth2");

            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var requestUri = new Uri(message.CompanyId != null ? processType.EndPoint.Replace("{company}", message.CompanyId, StringComparison.InvariantCultureIgnoreCase) : processType.EndPoint);

            //string json = JsonConvert.SerializeObject(message, Formatting.Indented, new JsonSerializerSettings
            //{
            //    ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver()
            //});

            string json = message.Content;
            HttpRequestMessage requestMessage = new HttpRequestMessage
            {
                Method = new HttpMethod(processType.Verb),
                RequestUri = requestUri,
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            };

            _logger.LogInformation($"Calling Atlas API {requestUri.ToString()}.");

            var response = await _client.SendAsync(requestMessage);

            if (!response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();

                _logger.LogError("Calling Atlas API failed with status code {Atlas_HttpResponseStatusCode} and content {Atlas_HttpResponseContent}.", response.StatusCode, content);

                throw new Exception(content);
            }
        }
    }
}
