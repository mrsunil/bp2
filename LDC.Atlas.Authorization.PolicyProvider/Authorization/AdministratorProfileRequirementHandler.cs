using LDC.Atlas.Authorization.Core.Common;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;

namespace LDC.Atlas.Authorization.PolicyProvider.Authorization
{
    public class AdministratorProfileRequirementHandler : AuthorizationHandler<AdministratorProfileRequirement>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, AdministratorProfileRequirement requirement)
        {
            if (context.User.HasClaim(c =>
                c.Type == ClaimConstants.IsAdministrator &&
                 c.Issuer == ClaimConstants.AtlasIssuer &&
                 c.Value == bool.TrueString))
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }
}
