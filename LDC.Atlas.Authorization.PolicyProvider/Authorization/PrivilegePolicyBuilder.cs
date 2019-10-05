using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;

namespace LDC.Atlas.Authorization.PolicyProvider.Authorization
{
    /// <summary>
    /// It can be used to add the handlers that are related to custom policies to the IServiceCollection
    /// It has to be used in the Startup class of an ASP.NET Core project
    /// </summary>
    public class PrivilegePolicyBuilder
    {
        public PrivilegePolicyBuilder(IServiceCollection services)
        {
            Services = services;
        }

        public IServiceCollection Services { get; }

        public PrivilegePolicyBuilder AddAtlasPrivilegeAuthorizationHandlers()
        {
            // Use AddScoped and not AddSingleton, because they use scoped services in constructor
            Services.AddScoped<IAuthorizationHandler, PrivilegeRequirementHandler>();
            Services.AddScoped<IAuthorizationHandler, PrivilegeCollectionRequirementHandler>();
            Services.AddScoped<IAuthorizationHandler, AdministratorProfileRequirementHandler>();

            return this;
        }
    }
}
