using LDC.Atlas.Application.Common.Configuration.Dto;
using LDC.Atlas.Authorization.Core.Common;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Infrastructure.Policies
{
    public class UpdateDeleteFilterSetHandler :
        AuthorizationHandler<UpdateDeleteFilterSetRequirement, UserFilterSetDto>
    {
        public UpdateDeleteFilterSetHandler()
        {
        }

        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            UpdateDeleteFilterSetRequirement requirement,
            UserFilterSetDto resource)
        {
            var isFilterSetDefault = resource.IsDefault;

            if (isFilterSetDefault)
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
