using LDC.Atlas.Infrastructure.Models;
using LDC.Atlas.WebApp.Server.Models;

namespace LDC.Atlas.WebApp.Models
{
    public class ApplicationDetail
    {
        public ServiceEndpoints Endpoints { get; set; }

        public string Version { get; set; }

        public string FriendlyName { get; set; }

        public string EnvironmentType { get; set; }

        public string EnvironmentName { get; set; }
        public string WebAppRoot { get; set; }

        public ApplicationInsightsConfiguration ApplicationInsights { get; set; }

        public TokenConfiguration TokenConfiguration { get; set; }
    }
}
