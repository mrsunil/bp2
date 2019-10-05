using Microsoft.AspNetCore.Authorization;

namespace LDC.Atlas.Services.Configuration.Infrastructure.Policies
{
    public class UpdateDeleteFilterSetRequirement : IAuthorizationRequirement
    {
        public UpdateDeleteFilterSetRequirement()
        {
        }
    }
}
