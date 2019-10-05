using LDC.Atlas.Authorization.Core.Common;
using LDC.Atlas.Authorization.Core.Entities;
using LDC.Atlas.Authorization.PolicyProvider.Authorization;
using Microsoft.Extensions.DependencyInjection;

namespace LDC.Atlas.Services.Freeze.Infrastructure.Policies
{
    public static class AuthorizationPolicyExtension
    {
        public static void AddFreezeAuthorizationPolicies(this IServiceCollection services)
        {
            services.AddAuthorization(options =>
            {
                options.AddPolicy(Policies.CreateFreezePolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.CutOff,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.CreateFreeze,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });

                options.AddPolicy(Policies.FrozenDatabasePolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.CutOff,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.FrozenDatabase,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });

                options.AddPolicy(Policies.RecalcFreezePolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.CutOff,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.RecalculateFreeze,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });

                options.AddPolicy(Policies.CutOffPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeRequirement(AtlasPrivileges.FinancialPrivileges.CutOff, PermissionLevel.Read));
                });
            });
        }
    }

    internal static class Policies
    {
        public const string CreateFreezePolicy = "CreateFreezePolicy";
        public const string FrozenDatabasePolicy = "FrozenDatabasePolicy";
        public const string RecalcFreezePolicy = "RecalcFreezePolicy";
        public const string CutOffPolicy = "CutOffPolicy";
    }
}
