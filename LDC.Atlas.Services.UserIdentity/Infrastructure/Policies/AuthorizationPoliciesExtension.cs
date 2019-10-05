using LDC.Atlas.Authorization.Core.Common;
using LDC.Atlas.Authorization.Core.Entities;
using LDC.Atlas.Authorization.PolicyProvider.Authorization;
using LDC.Atlas.Infrastructure;
using Microsoft.Extensions.DependencyInjection;

namespace LDC.Atlas.Services.UserIdentity.Infrastructure.Policies
{
    public static class AuthorizationPoliciesExtension
    {
        public static void AddTradeAuthorizationPolicies(this IServiceCollection services)
        {
            services.AddAuthorization(options =>
            {
                options.AddPolicy(AtlasStandardPolicies.AdministratorAreaPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeRequirement(AtlasPrivileges.AdminPrivileges.Administration, PermissionLevel.Read));
                });

                options.AddPolicy(Policies.ProfilesPolicy, policy =>
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
                                Name = AtlasPrivileges.AdminPrivileges.Profiles,
                                Permission = PermissionLevel.ReadWrite
                            }
                    }));
                });

                options.AddPolicy(Policies.UsersPolicy, policy =>
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
                                Name = AtlasPrivileges.AdminPrivileges.Users,
                                Permission = PermissionLevel.ReadWrite
                            }
                    }));
                });
            });
        }

        internal static class Policies
        {
            public const string ProfilesPolicy = "ProfilesPolicy";
            public const string UsersPolicy = "UsersPolicy";
        }
    }
}
