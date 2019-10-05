using LDC.Atlas.Application.Core.Services;
using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.Extensibility;

namespace LDC.Atlas.Infrastructure.ApplicationInsights
{
    // // https://github.com/Microsoft/ApplicationInsights-aspnetcore/wiki/Custom-Configuration#add-request-level-properties-for-all-telemetry-items
    public class UserTelemetryInitializer : ITelemetryInitializer
    {
        private readonly IIdentityService _identityService;

        public UserTelemetryInitializer(IIdentityService identityService)
        {
            _identityService = identityService;
        }

        public void Initialize(ITelemetry telemetry)
        {
            if (_identityService.GetUser() != null && _identityService.GetUser().Identity.IsAuthenticated)
            {
                telemetry.Context.User.Id = _identityService.GetUserName();
            }
        }
    }
}
