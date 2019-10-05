using Microsoft.AspNetCore.Builder;

namespace LDC.Atlas.Infrastructure.Middlewares.Extensions
{
    /// <summary>
    /// The <see cref="IApplicationBuilder"/> extensions for adding errors handling middleware support.
    /// </summary>
    public static class ExceptionHandlingMiddlewareExtensions
    {
        /// <summary>
        /// Adds the LDC.Atlas.Infrastructure.Middlewares.ExceptionHandlingMiddleware to the
        /// specified Microsoft.AspNetCore.Builder.IApplicationBuilder, which enables errors handling capabilities.
        /// </summary>
        /// <param name="builder">The Microsoft.AspNetCore.Builder.IApplicationBuilder to add the middleware to.</param>
        public static IApplicationBuilder UseAtlasExceptionHandling(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ExceptionHandlingMiddleware>();
        }
    }
}
