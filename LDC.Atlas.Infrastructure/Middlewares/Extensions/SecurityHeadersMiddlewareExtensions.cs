using Microsoft.AspNetCore.Builder;

namespace LDC.Atlas.Infrastructure.Middlewares.Extensions
{
    /// <summary>
    /// The <see cref="IApplicationBuilder"/> extensions for adding Security headers middleware support.
    /// </summary>
    public static class SecurityHeadersMiddlewareExtensions
    {
        /// <summary>
        /// Adds the LDC.Atlas.Infrastructure.Middlewares.SecurityHeadersMiddleware to the
        /// specified Microsoft.AspNetCore.Builder.IApplicationBuilder, which add security headers to requests.
        /// </summary>
        /// <param name="builder">The Microsoft.AspNetCore.Builder.IApplicationBuilder to add the middleware to.</param>
        public static IApplicationBuilder UseSecurityHeaders(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<SecurityHeadersMiddleware>();
        }
    }
}
