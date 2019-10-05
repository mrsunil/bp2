using LDC.Atlas.Authorization.Core.Common;
using LDC.Atlas.Authorization.Core.Entities;
using LDC.Atlas.Authorization.PolicyProvider.Authorization;
using Microsoft.Extensions.DependencyInjection;

namespace LDC.Atlas.Services.Configuration.Infrastructure.Policies
{
    public static class AuthorizationPoliciesExtension
    {
        public static void AddConfigurationAuthorizationPolicies(this IServiceCollection services)
        {
            services.AddAuthorization(options =>
            {
                options.AddPolicy(Policies.ReadGlobalParametersPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeRequirement(AtlasPrivileges.AdminPrivileges.GlobalParameters, PermissionLevel.Read));
                });

                options.AddPolicy(Policies.CreateFunctionalObjectPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.AdminPrivileges.GlobalParameters,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.AdminPrivileges.CreateFunctionalObject,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });

                options.AddPolicy(Policies.FilterSetAdministratorPolicy, policy =>
                {
                    policy.AddRequirements(new UpdateDeleteFilterSetRequirement());
                });

                options.AddPolicy(Policies.GridViewAdministratorPolicy, policy =>
                {
                    policy.AddRequirements(new UpdateDeleteGridViewRequirement());
                });

                options.AddPolicy(Policies.BatchesPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeRequirement(AtlasPrivileges.ApplicationInterfacesPrivileges.Batches, PermissionLevel.Read));
                });
            });
        }

        internal static class Policies
        {
            public const string ReadGlobalParametersPolicy = "ReadGlobalParametersPolicy";
            public const string CreateFunctionalObjectPolicy = "CreateFunctionalObjectPolicy";
            public const string FilterSetAdministratorPolicy = "FilterSetAdministratorPolicy";
            public const string GridViewAdministratorPolicy = "GridViewAdministratorPolicy";
            public const string BatchesPolicy = "BatchesPolicy";
        }
    }
}
