using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Infrastructure.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Threading.Tasks;

namespace LDC.Atlas.Infrastructure.Middlewares
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IHostingEnvironment _env;

        public ExceptionHandlingMiddleware(RequestDelegate next, IHostingEnvironment env)
        {
            _next = next;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context, ILogger<ExceptionHandlingMiddleware> logger)
        {
            try
            {
                await _next(context);
            }
#pragma warning disable CA1031 // Do not catch general exception types
            catch (Exception ex)
            {
                logger.LogError(ex, ex.Message);
                await HandleExceptionAsync(context, ex);
            }
#pragma warning restore CA1031 // Do not catch general exception types
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            ProblemDetails error;

            if (ex is ApplicationValidationException validationEx)
            {
                error = new ValidationProblemDetails(validationEx.Errors)
                {
                    Status = StatusCodes.Status400BadRequest,
                    Detail = Resources.ApplicationValidationProblemDescriptionDetail,
                    Instance = context.Request.Path
                };
            }
            else if (ex is AtlasBusinessException)
            {
                error = new ProblemDetails
                {
                    Title = Resources.ExceptionProblemInvalidOperationTitle,
                    Type = "https://atlas.ldc.com/business-error",
                    Status = StatusCodes.Status400BadRequest,
                    Detail = ex.Message,
                    Instance = context.Request.Path
                };
            }
            else if (ex is NotFoundException)
            {
                error = new ProblemDetails
                {
                    Title = Resources.ExceptionProblemNotFoundTitle,
                    Type = "https://atlas.ldc.com/not-found",
                    Status = StatusCodes.Status404NotFound,
                    Detail = ex.Message,
                    Instance = context.Request.Path
                };
            }
            else if (ex is AtlasSecurityException securityEx)
            {
                error = new ApplicationSecurityProblemDetails(securityEx.Errors)
                {
                    Status = StatusCodes.Status403Forbidden,
                    Detail = securityEx.Message,
                    Instance = context.Request.Path
                };
            }
            else if (ex is AtlasLockRefreshException)
            {
                error = new ProblemDetails
                {
                    Title = Resources.ExceptionProblemInvalidOperationTitle,
                    Type = "https://atlas.ldc.com/lock-refresh-error",
                    Status = StatusCodes.Status400BadRequest,
                    Detail = ex.Message,
                    Instance = context.Request.Path,
                };
            }
            else
            {
                error = new ExceptionProblemDetails(ex);
                error.Status = StatusCodes.Status500InternalServerError;
                error.Detail = ex.Message;
                error.Instance = context.Request.Path;

                if (ex is InvalidOperationException)
                {
                    error.Status = StatusCodes.Status400BadRequest;
                    error.Title = Resources.ExceptionProblemInvalidOperationTitle;
                }
                else if (ex is ArgumentNullException)
                {
                    error.Status = StatusCodes.Status400BadRequest;
                    error.Title = Resources.ExceptionProblemArgumentNullTitle;
                }
            }

            context.Response.ContentType = "application/problem+json";
            context.Response.StatusCode = error.Status ?? StatusCodes.Status500InternalServerError;

            // https://www.newtonsoft.com/json/help/html/ReferenceLoopHandlingIgnore.htm
            await context.Response.WriteAsync(JsonConvert.SerializeObject(error, Formatting.Indented, new JsonSerializerSettings
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver()
            }));
        }
    }
}
