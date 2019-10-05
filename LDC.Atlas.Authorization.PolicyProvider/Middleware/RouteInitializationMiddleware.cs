using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using System.Threading.Tasks;

namespace LDC.Atlas.Authorization.PolicyProvider.Middleware
{
    public class RouteInitializationMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IRouter _router;

        public RouteInitializationMiddleware(RequestDelegate next, IRouter router)
        {
            _next = next;
            _router = router;
        }

        public async Task Invoke(HttpContext httpContext)
        {
            var routeContext = new RouteContext(httpContext);
            routeContext.RouteData.Routers.Add(_router);
            await _router.RouteAsync(routeContext);

            if (routeContext.Handler != null)
            {
                httpContext.Features[typeof(IRoutingFeature)] = new RoutingFeature()
                {
                    RouteData = routeContext.RouteData
                };
            }

            await _next(httpContext);
        }
    }
}
