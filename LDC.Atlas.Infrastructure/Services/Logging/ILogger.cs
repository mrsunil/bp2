using System;
using System.Collections.Generic;

namespace LDC.Atlas.Infrastructure.Services.Logging
{
    public interface ILogger
    {
        void TrackEvent(string eventName, IDictionary<string, string> properties = null);

        void TrackException(string message, Exception exception, IDictionary<string, string> properties = null);
    }
}
