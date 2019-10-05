using Microsoft.AspNetCore.Authorization;

namespace LDC.Atlas.Services.Execution.Infrastructure.Policies
{
    public class CreateCashRequirement : IAuthorizationRequirement
    {
        public CreateCashRequirement()
        {
        }
    }
}
