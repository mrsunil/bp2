using LDC.Atlas.Authorization.Core.Common;
using LDC.Atlas.Authorization.Core.Entities;
using LDC.Atlas.Authorization.PolicyProvider.Authorization;
using Microsoft.Extensions.DependencyInjection;

namespace LDC.Atlas.Services.Reporting.Infrastructure.Policies
{
    public static class AuthorizationPolicyExtension
    {
        public static void AddReportingAuthorizationPolicies(this IServiceCollection services)
        {
            services.AddAuthorization(options =>
            {
                options.AddPolicy(Policies.ViewTradeCostReportPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReportsPrivileges.Reports,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReportsPrivileges.TradeCostReport,
                            Permission = PermissionLevel.Read
                        }
                    }));
                });
                options.AddPolicy(Policies.ViewTradingAndExecutionPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReferentialPrivileges.Referential,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReferentialPrivileges.TradingAndExecution,
                            Permission = PermissionLevel.Read
                        }
                    }));
                });
                options.AddPolicy(Policies.CreateUpdateLdrepManualAdjustmentPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReportsPrivileges.Reports,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReportsPrivileges.LDREPManualAdjustmentReport,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
                options.AddPolicy(Policies.DeleteLdrepManualAdjustmentPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReportsPrivileges.Reports,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReportsPrivileges.LDREPManualAdjustmentReport,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });

                options.AddPolicy(Policies.EditReportPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeCollectionRequirement(new[]
                    {
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReportsPrivileges.PLReport,
                            Permission = PermissionLevel.Read
                        },
                        new PrivilegePermission
                        {
                            Name = AtlasPrivileges.ReportsPrivileges.EditReport,
                            Permission = PermissionLevel.ReadWrite
                        }
                    }));
                });
            });
        }
    }

    internal static class Policies
    {
        public const string ViewTradeCostReportPolicy = "ViewTradeCostReportPolicy";
        public const string ViewTradingAndExecutionPolicy = "ViewTradingAndExecutionPolicy";
        public const string CreateUpdateLdrepManualAdjustmentPolicy = "CreateUpdateLdrepManualAdjustmentPolicy";
        public const string DeleteLdrepManualAdjustmentPolicy = "DeleteLdrepManualAdjustmentPolicy";
        public const string EditReportPolicy = "EditReportPolicy";
    }
}
