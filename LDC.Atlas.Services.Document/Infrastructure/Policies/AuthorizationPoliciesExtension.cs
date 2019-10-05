using LDC.Atlas.Authorization.Core.Common;
using LDC.Atlas.Authorization.Core.Entities;
using LDC.Atlas.Authorization.PolicyProvider.Authorization;
using Microsoft.Extensions.DependencyInjection;

namespace LDC.Atlas.Services.Document.Infrastructure.Policies
{
    public static class AuthorizationPoliciesExtension
    {
        public static void AddDocumentAuthorizationPolicies(this IServiceCollection services)
        {
            services.AddAuthorization(options =>
            {
                options.AddPolicy(Policies.GenerateContractAdvicePolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeRequirement(AtlasPrivileges.TradesPrivileges.GenerateContractAdvice, PermissionLevel.ReadWrite));
                });
                options.AddPolicy(Policies.CanManageTemplatesPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeRequirement(AtlasPrivileges.ReportsPrivileges.GlobalReports, PermissionLevel.ReadWrite));
                });
                options.AddPolicy(Policies.CanReadTemplatesPolicy, policy =>
                {
                    policy.AddRequirements(new PrivilegeRequirement(AtlasPrivileges.ReportsPrivileges.GlobalReports, PermissionLevel.Read));
                });
            });
        }
    }

    internal static class Policies
    {
        public const string GenerateContractAdvicePolicy = "GenerateContractAdvicePolicy";
        public const string CanManageTemplatesPolicy = "CanManageTemplatesPolicy";
        public const string CanReadTemplatesPolicy = "CanReadTemplatesPolicy";
    }
}
