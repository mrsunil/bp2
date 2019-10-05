using LDC.Atlas.Application.Core;
using LDC.Atlas.Application.Core.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Infrastructure.Middlewares
{
    /// <summary>
    /// An ASP.NET Core middleware for creating the Atlas context information.
    /// </summary>
    public class ContextInformationMiddleware
    {
        private readonly RequestDelegate _next;

        /// <summary>
        /// Initializes a new instance of the <see cref="ContextInformationMiddleware"/> class.
        /// </summary>
        /// <param name="next">The next middleware in the pipeline.</param>
        public ContextInformationMiddleware(RequestDelegate next)
        {
            _next = next ?? throw new ArgumentNullException(nameof(next));
        }

        public async Task Invoke(HttpContext context, IIdentityService identityService, IContextInformation contextInformation)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }

            if (identityService == null)
            {
                throw new ArgumentNullException(nameof(identityService));
            }

            var programId = context.Request.Headers.FirstOrDefault(x => x.Key == AtlasHeaderNames.AtlasProgramId).Value.ToString();

            if (string.IsNullOrWhiteSpace(programId))
            {
                var error = new ProblemDetails
                {
                    Title = Resources.ExceptionProblemInvalidOperationTitle,
                    Type = "https://atlas.ldc.com/business-error",
                    Status = StatusCodes.Status400BadRequest,
                    Detail = $"The HTTP header {AtlasHeaderNames.AtlasProgramId} is missing.",
                    Instance = context.Request.Path
                };

                context.Response.ContentType = "application/problem+json";
                context.Response.StatusCode = StatusCodes.Status400BadRequest;

                await context.Response.WriteAsync(JsonConvert.SerializeObject(error, Formatting.Indented, new JsonSerializerSettings
                {
                    ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver()
                }));
            }
            else
            {
                contextInformation.ApiActionName = programId;

                contextInformation.UserId = identityService.GetUserName();

                await _next(context);
            }
        }
    }
}
