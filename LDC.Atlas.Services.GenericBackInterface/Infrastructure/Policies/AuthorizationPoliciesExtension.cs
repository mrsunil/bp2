using LDC.Atlas.Authorization.Core.Common;
using LDC.Atlas.Authorization.Core.Entities;
using LDC.Atlas.Authorization.PolicyProvider.Authorization;
using Microsoft.Extensions.DependencyInjection;

namespace LDC.Atlas.Services.GenericBackInterface.Infrastructure.Policies
{
    public static class AuthorizationPoliciesExtension
    {
        public static void AddGenericBackInterfaceAuthorizationPolicies(this IServiceCollection services)
        {
            services.AddAuthorization(options =>
            {
                options.AddPolicy(Policies.GenericBackInterfacePolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeRequirement(AtlasPrivileges.ApplicationInterfacesPrivileges.GenericBackInterface, PermissionLevel.Read));
                });
            });
        }

        internal static class Policies
        {
            public const string GenericBackInterfacePolicy = "GenericBackInterfacePolicy";
        }
    }
}
