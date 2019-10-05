using LDC.Atlas.Services.Processor.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Polly;
using System;

namespace LDC.Atlas.Services.Processor.Extensions
{
    public static class ServiceConfigurationExtensions
    {
        /// <summary>
        /// Use this extension method in order to add all the services that are required for the custom authorization.
        /// </summary>
        /// <param name="services">The Microsoft.Extensions.DependencyInjection.IServiceCollection.</param>
        /// <param name="configuration">Configuration to use.</param>
        public static void AddAtlasServices(this IServiceCollection services, IConfiguration configuration)
        {
            // Add typed HTTP client (as transient)
            // https://docs.microsoft.com/en-us/aspnet/core/fundamentals/http-requests?view=aspnetcore-2.1#typed-clients
            services.AddHttpClient<AtlasService>()

                // Handle transient faults
                // https://docs.microsoft.com/en-us/aspnet/core/fundamentals/http-requests?view=aspnetcore-2.1#handle-transient-faults
                .AddTransientHttpErrorPolicy(p => p.WaitAndRetryAsync(3, _ => TimeSpan.FromMilliseconds(600)));
        }
    }
}
