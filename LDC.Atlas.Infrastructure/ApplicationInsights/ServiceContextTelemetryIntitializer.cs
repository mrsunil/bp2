using LDC.Atlas.Infrastructure.Utils;
using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.Extensibility;

namespace LDC.Atlas.Infrastructure.ApplicationInsights
{
    public class ServiceContextTelemetryIntitializer : ITelemetryInitializer
    {
        public void Initialize(ITelemetry telemetry)
        {
            telemetry.Context.Component.Version = AppInfoUtils.InformationalVersion;
        }
    }
}
