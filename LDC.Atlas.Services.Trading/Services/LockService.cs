using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Services
{
    public class LockService
    {
        private readonly HttpClient _client;
        private readonly LockSettings _lockSettings;
        private readonly ILogger _logger;

        public LockService(HttpClient client, IOptions<LockSettings> configuration, ILogger<LockService> logger)
        {
            _client = client;
            _logger = logger;
            _lockSettings = configuration.Value;
            _client.BaseAddress = new Uri(_lockSettings.BaseUrl);
            _client.DefaultRequestHeaders.Add("Accept", "application/json");
            _client.DefaultRequestHeaders.Add("Atlas-Program-Id", "Atlas");
            _logger.LogInformation("BaseUrl: {Atlas_BaseAddress}", _client.BaseAddress);
        }

        public async Task CreateLockAsync(string token, string companyId, CreateLockCommand createLockCommand)
        {
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            string url = $"{companyId}/locks";

            var response = await _client.PostAsJsonAsync(url, createLockCommand);

            response.EnsureSuccessStatusCode();
        }
    }

    public class LockSettings
    {
        public string BaseUrl { get; set; }
    }

    public class CreateLockCommand
    {
        internal string Company { get; set; } // internal to avoid the exposure in Swagger

        public string FunctionalContext { get; set; }

        public string ResourceId { get; set; }
    }
}
