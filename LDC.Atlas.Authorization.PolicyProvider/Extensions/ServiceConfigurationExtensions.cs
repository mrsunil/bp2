using LDC.Atlas.Authorization.PolicyProvider.Authorization;
using LDC.Atlas.Authorization.PolicyProvider.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace LDC.Atlas.Authorization.PolicyProvider.Extensions
{
    public static class ServiceConfigurationExtensions
    {
        /// <summary>
        /// Use this extension method in order to add all the services that are required for the custom authorization.
        /// </summary>
        /// <param name="services">The Microsoft.Extensions.DependencyInjection.IServiceCollection.</param>
        /// <param name="configuration">Configuration to use.</param>
        public static PrivilegePolicyBuilder AddAtlasAuthorizationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<UserIdentitySettings>(configuration.GetSection("UserIdentitySettings"));
            services.AddAuthorization();

            // Add typed HTTP client (as transient)
            // https://docs.microsoft.com/en-us/aspnet/core/fundamentals/http-requests?view=aspnetcore-2.1#typed-clients
            // services.AddHttpClient<UserIdentityService>()

                // Handle transient faults
                // https://docs.microsoft.com/en-us/aspnet/core/fundamentals/http-requests?view=aspnetcore-2.1#handle-transient-faults
                // .AddTransientHttpErrorPolicy(p => p.WaitAndRetryAsync(3, _ => TimeSpan.FromMilliseconds(600)));

            services.TryAddScoped<IPrivilegeProvider, LocalPrivilegeProvider>();
            services.TryAddScoped<IPrivilegeChecker, PrivilegeChecker>();

            return new PrivilegePolicyBuilder(services);
        }
    }
}
