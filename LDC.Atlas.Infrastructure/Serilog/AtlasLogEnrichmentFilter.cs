using LDC.Atlas.Application.Core.Services;
using Microsoft.AspNetCore.Mvc.Filters;
using Serilog.Context;

namespace LDC.Atlas.Infrastructure.Serilog
{
    /// <summary>
    /// A action filter to enrich <see cref="LogContext"/> logs with additional Atlas data.
    /// </summary>
    /// <seealso cref="Microsoft.AspNetCore.Mvc.Filters.IActionFilter" />
    public class AtlasLogEnrichmentFilter : IActionFilter
    {
        private readonly IIdentityService _identityService;

        public AtlasLogEnrichmentFilter(IIdentityService identityService)
        {
            _identityService = identityService ?? throw new System.ArgumentNullException(nameof(identityService));
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            if (_identityService.GetUser().Identity.IsAuthenticated)
            {
                LogContext.PushProperty("Atlas.UserName", _identityService.GetUserName());
            }
            else
            {
                LogContext.PushProperty("Atlas.UserName", "Anonymous");
            }
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
        }
    }
}
