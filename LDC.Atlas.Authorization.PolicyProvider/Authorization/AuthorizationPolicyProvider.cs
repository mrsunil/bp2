using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace LDC.Atlas.Authorization.PolicyProvider.Authorization
{
    /// <summary>
    /// If this policy provider is registered, it tranforms the policy names to actions automatically
    /// </summary>
    public class AuthorizationPolicyProvider : DefaultAuthorizationPolicyProvider
    {
        public AuthorizationPolicyProvider(IOptions<AuthorizationOptions> options)
            : base(options)
        {
        }

        public async override Task<AuthorizationPolicy> GetPolicyAsync(string policyName)
        {
            var policy = await base.GetPolicyAsync(policyName);

            if (policy == null)
            {
                policy = new AuthorizationPolicyBuilder().AddRequirements(new PrivilegeRequirement(policyName)).Build();
            }

            return policy;
        }
    }
}
