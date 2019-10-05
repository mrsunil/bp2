using LDC.Atlas.Authorization.Core.Common;
using LDC.Atlas.Authorization.Core.Entities;
using LDC.Atlas.Authorization.PolicyProvider.Authorization;
using Microsoft.Extensions.DependencyInjection;

namespace LDC.Atlas.Services.AccountingInterface.Infrastructure.Policies
{
    public static class AuthorizationPolicyExtension
    {
        public static void AddAccountingInterfaceAuthorizationPolicies(this IServiceCollection services)
        {
            services.AddAuthorization(options =>
            {
                options.AddPolicy(Policies.ResendNotPostedAccountingInterfacePolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.InterfaceErrors,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.ResendNotPosted,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.ResendErrorAccountingInterfacePolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.InterfaceErrors,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.ResendError,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.TagErrorAccountingInterfacePolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.InterfaceErrors,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.FinancialPrivileges.TagCancel,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
            });
        }

        internal static class Policies
        {
            public const string ResendNotPostedAccountingInterfacePolicy = "ResendNotPostedAccountingInterfacePolicy";
            public const string ResendErrorAccountingInterfacePolicy = "ResendErrorAccountingInterfacePolicy";
            public const string TagErrorAccountingInterfacePolicy = "TagErrorAccountingInterfacePolicy";
        }

    }
}