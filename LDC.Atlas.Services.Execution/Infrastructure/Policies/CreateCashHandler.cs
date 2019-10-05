using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using LDC.Atlas.Services.Execution.Entities;

namespace LDC.Atlas.Services.Execution.Infrastructure.Policies
{
    public class CreateCashHandler : AuthorizationHandler<CreateCashRequirement, Cash>
    {
        public CreateCashHandler()
        {
        }

        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            CreateCashRequirement requirement, Cash cash)
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }
    }
}
