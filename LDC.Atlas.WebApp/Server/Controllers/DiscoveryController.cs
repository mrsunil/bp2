using LDC.Atlas.Infrastructure.Models;
using LDC.Atlas.Infrastructure.Utils;
using LDC.Atlas.WebApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace LDC.Atlas.WebApp.Server.Controllers
{
    [Route("api/v1/[controller]")]
    public class DiscoveryController : ControllerBase
    {
        private readonly OAuthEndpoints _oAuthConfig;
        private readonly ApplicationInsightsConfiguration _applicationInsights;
        private readonly WebApp.Models.ApplicationDetail _applicationDetail;

        public DiscoveryController(
            IOptions<WebApp.Models.ApplicationDetail> applicationDetail,
            IOptions<OAuthEndpoints> oAuthConfig,
            IOptions<ApplicationInsightsConfiguration> applicationInsights)
        {
            _oAuthConfig = oAuthConfig.Value;
            _applicationInsights = applicationInsights.Value;
            _applicationDetail = applicationDetail.Value;
            _applicationDetail.ApplicationInsights = _applicationInsights;
        }

        [HttpGet]
        [Authorize]
        public WebApp.Models.ApplicationDetail Get()
        {
            _applicationDetail.Version = AppInfoUtils.InformationalVersion;
            _applicationDetail.FriendlyName = "Atlas";

            return _applicationDetail;
        }

        [HttpGet("oauth")]
        public OAuthEndpoints GetOAuthEndpoints()
        {
            return _oAuthConfig;
        }
    }
}
