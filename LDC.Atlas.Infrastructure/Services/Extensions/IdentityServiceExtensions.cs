using LDC.Atlas.Application.Core.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using System;

namespace LDC.Atlas.Infrastructure.Services.Extensions
{
    /// <summary>
    /// Extension methods for configuring identity service.
    /// </summary>
    public static class IdentityServiceExtensions
    {
        /// <summary>
        /// Adds a default implementation for the <see cref="IIdentityService"/> service.
        /// </summary>
        /// <param name="services">The <see cref="IServiceCollection"/>.</param>
        /// <returns>The service collection.</returns>
        public static IServiceCollection AddAtlasIdentityService(this IServiceCollection services)
        {
            if (services == null)
            {
                throw new ArgumentNullException(nameof(services));
            }

            services.TryAddTransient<IIdentityService, IdentityService>();

            return services;
        }
    }
}
