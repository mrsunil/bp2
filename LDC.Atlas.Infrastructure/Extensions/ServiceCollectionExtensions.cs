using LDC.Atlas.Infrastructure.Services.Token;
using LDC.Atlas.Infrastructure.Services.Tokens;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace LDC.Atlas.Infrastructure.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static void AddTokenManagement(this IServiceCollection services)
        {
            services.AddDataProtection();
            services.AddDistributedMemoryCache();
            services.AddScoped<ITokenCacheProvider, TokenCacheProvider>();
            services.AddScoped<ITokenProvider, TokenProvider>();
        }

        public static void ConfigureInvalidModelStateResponseFactory(this IServiceCollection services)
        {
            // https://github.com/aspnet/Mvc/issues/7858
            services.Configure<ApiBehaviorOptions>(options =>
            {
                options.InvalidModelStateResponseFactory = context =>
                {
                    var problemDetails = new ValidationProblemDetails(context.ModelState)
                    {
                        Instance = context.HttpContext.Request.Path,
                        Status = Microsoft.AspNetCore.Http.StatusCodes.Status400BadRequest,
                        Type = "https://atlas.ldc.com/validation-error",
                        Detail = "Please refer to the errors property for additional details."
                    };

                    return new BadRequestObjectResult(problemDetails)
                    {
                        ContentTypes = { "application/problem+json", "application/problem+xml" }
                    };
                };
            });
        }
    }
}
