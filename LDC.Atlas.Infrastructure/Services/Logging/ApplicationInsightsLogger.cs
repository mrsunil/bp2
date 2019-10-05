using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;

namespace LDC.Atlas.Infrastructure.Services.Logging
{
    public class ApplicationInsightsLogger : ILogger
    {
        private readonly LDC.Atlas.Infrastructure.Models.ApplicationInsightsConfiguration _options;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly TelemetryClient _telemetryClient;

        public ApplicationInsightsLogger(IOptionsSnapshot<LDC.Atlas.Infrastructure.Models.ApplicationInsightsConfiguration> options, IHttpContextAccessor httpContextAccessor)
        {
            _options = options.Value;
            _httpContextAccessor = httpContextAccessor;
            _telemetryClient = new TelemetryClient(new Microsoft.ApplicationInsights.Extensibility.TelemetryConfiguration(_options.InstrumentationKey));
        }

        public void TrackEvent(string eventName, IDictionary<string, string> properties = null)
        {
            EventTelemetry eventTelemetry = new EventTelemetry
            {
                Name = eventName,
                Timestamp = DateTime.UtcNow
            };

            if (properties != null)
            {
                foreach (var item in properties)
                {
                    eventTelemetry.Properties.Add(item);
                }
            }

            AddCommonData(eventTelemetry);

            _telemetryClient.TrackEvent(eventTelemetry);
        }

        public void TrackException(string message, Exception exception, IDictionary<string, string> properties = null)
        {
            ExceptionTelemetry exceptionTelemetry = new ExceptionTelemetry
            {
                Message = message,
                Exception = exception,
                Timestamp = DateTime.UtcNow
            };

            if (properties != null)
            {
                foreach (var item in properties)
                {
                    exceptionTelemetry.Properties.Add(item);
                }
            }

            AddCommonData(exceptionTelemetry);

            _telemetryClient.TrackException(exceptionTelemetry);
        }

        private void AddCommonData(ISupportProperties telemetry)
        {
            if (_httpContextAccessor != null)
            {
                telemetry.Properties.Add("User", _httpContextAccessor.HttpContext.User.Identity.Name);
            }
        }
    }
}
