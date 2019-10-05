using LDC.Atlas.Infrastructure.Services.Logging;
using Microsoft.AspNetCore.Mvc.Filters;

namespace LDC.Atlas.Services.Trading.Infrastructure.Filters
{
    public class LoggingFilterAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var logger = (ILogger)context.HttpContext.RequestServices.GetService(typeof(ILogger));
            logger.TrackEvent(context.ActionDescriptor.DisplayName + "_started");
            base.OnActionExecuting(context);
        }

        public override void OnActionExecuted(ActionExecutedContext context)
        {
            var logger = (ILogger)context.HttpContext.RequestServices.GetService(typeof(ILogger));
            logger.TrackEvent(context.ActionDescriptor.DisplayName + "_finished");
            base.OnActionExecuted(context);
        }
    }
}
