using Microsoft.AspNetCore.Builder;

namespace LDC.Atlas.Infrastructure.Middlewares.Extensions
{
    /// <summary>
    /// The <see cref="IApplicationBuilder"/> extensions for creating the Atlas context information.
    /// </summary>
    public static class ContextInformationMiddlewareExtensions
    {
        /// <summary>
        /// Adds the LDC.Atlas.Infrastructure.Middlewares.ContextInformationMiddleware to the
        /// specified Microsoft.AspNetCore.Builder.IApplicationBuilder, which add security headers to requests.
        /// </summary>
        /// <param name="builder">The Microsoft.AspNetCore.Builder.IApplicationBuilder to add the middleware to.</param>
        public static IApplicationBuilder UseAtlasContextInformation(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ContextInformationMiddleware>();
        }
    }
}
