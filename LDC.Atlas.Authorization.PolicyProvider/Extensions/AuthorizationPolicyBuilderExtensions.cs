using LDC.Atlas.Authorization.PolicyProvider.Authorization;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;

namespace LDC.Atlas.Authorization.PolicyProvider.Extensions
{
    public static class AuthorizationPolicyBuilderExtensions
    {
        public static AuthorizationPolicyBuilder RequirePrivilegeCollection(this AuthorizationPolicyBuilder builder, IEnumerable<Core.Entities.PrivilegePermission> privileges)
        {
            builder.AddRequirements(new PrivilegeCollectionRequirement(privileges));
            return builder;
        }
    }
}
