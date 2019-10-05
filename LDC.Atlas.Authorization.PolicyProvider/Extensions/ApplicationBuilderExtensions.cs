using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc.Internal;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;

namespace LDC.Atlas.Authorization.PolicyProvider.Middleware
{
    public static class ApplicationBuilderExtensions
    {
        public static IApplicationBuilder UseAtlasCurrentUserPrivileges(this IApplicationBuilder applicationBuilder)
        {
            return applicationBuilder.UseMiddleware<LoadUserPrivilegesMiddleware>();
        }

        public static IApplicationBuilder UseRouteMiddleware(this IApplicationBuilder applicationBuilder)
        {
            var router = GenerateRouter(applicationBuilder);
            return applicationBuilder.UseMiddleware<RouteInitializationMiddleware>(router);
        }

        private static IRouter GenerateRouter(IApplicationBuilder applicationBuilder)
        {
            var routes = new RouteBuilder(applicationBuilder)
            {
                DefaultHandler = applicationBuilder.ApplicationServices.GetRequiredService<MvcRouteHandler>()
            };
            routes.Routes.Insert(0, AttributeRouting.CreateAttributeMegaRoute(applicationBuilder.ApplicationServices));
            return routes.Build();
        }
    }
}
