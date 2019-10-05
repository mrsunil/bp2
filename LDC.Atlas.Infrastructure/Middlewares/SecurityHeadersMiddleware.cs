using LDC.Atlas.Infrastructure.Utils;
using Microsoft.AspNetCore.Http;
using System;
using System.Threading.Tasks;

namespace LDC.Atlas.Infrastructure.Middlewares
{
    /// <summary>
    /// An ASP.NET Core middleware for adding security headers.
    /// </summary>
    public class SecurityHeadersMiddleware
    {
        private readonly RequestDelegate _next;

        /// <summary>
        /// Initializes a new instance of the <see cref="SecurityHeadersMiddleware"/> class.
        /// </summary>
        /// <param name="next">The next middleware in the pipeline.</param>
        public SecurityHeadersMiddleware(RequestDelegate next)
        {
            _next = next ?? throw new ArgumentNullException(nameof(next));
        }

        public async Task Invoke(HttpContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }

            context.Response.OnStarting(() =>
            {
                var headers = context.Response.Headers;

                headers.Add("X-Frame-Options", "sameorigin");
                headers.Add("Access-Control-Expose-Headers", "Last-Modified, Content-Disposition, Location");
                headers.Remove("Server");

                headers.Add("Atlas-Version", AppInfoUtils.InformationalVersion);

                // https://github.com/Microsoft/ApplicationInsights-aspnetcore/issues/504
                headers.Add("Atlas-Request-Id", System.Diagnostics.Activity.Current?.Id ?? context.TraceIdentifier);

                return Task.CompletedTask;
            });

            await _next(context);
        }
    }
}
