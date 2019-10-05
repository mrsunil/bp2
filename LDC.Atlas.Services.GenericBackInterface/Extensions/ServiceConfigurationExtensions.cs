using LDC.Atlas.Services.GenericBackInterface.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace LDC.Atlas.Services.GenericBackInterface.Extensions
{
    public static class ServiceConfigurationExtensions
    {
        public static void AddAtlasServices(this IServiceCollection services, IConfiguration configuration)
        {
            // Add typed HTTP client (as transient)
            // https://docs.microsoft.com/en-us/aspnet/core/fundamentals/http-requests?view=aspnetcore-2.1#typed-clients
            services.AddHttpClient<AtlasService>();
        }
    }
}
