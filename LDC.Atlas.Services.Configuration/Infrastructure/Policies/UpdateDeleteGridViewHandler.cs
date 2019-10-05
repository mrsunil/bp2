using LDC.Atlas.Authorization.Core.Common;
using LDC.Atlas.Services.Configuration.Entities;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Infrastructure.Policies
{
    public class UpdateDeleteGridViewHandler : AuthorizationHandler<UpdateDeleteGridViewRequirement, GridView>
    {
        public UpdateDeleteGridViewHandler()
        {
        }

        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            UpdateDeleteGridViewRequirement requirement,
            GridView resource)
        {
            var isGridViewDefault = resource.IsDefault;

            if (isGridViewDefault)
            {
                if (context.User.HasClaim(c =>
                    c.Type == ClaimConstants.IsAdministrator &&
                    c.Issuer == ClaimConstants.AtlasIssuer &&
                    c.Value == bool.TrueString))
                {
                    context.Succeed(requirement);
                }
            }
            else
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }
}
