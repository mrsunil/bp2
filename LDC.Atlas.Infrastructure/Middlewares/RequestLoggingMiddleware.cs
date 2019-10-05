using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace LDC.Atlas.Infrastructure.Middlewares
{
    public class RequestLoggingMiddleware
    {
        private readonly RequestDelegate _next;

        public RequestLoggingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, ILogger<RequestLoggingMiddleware> logger)
        {
            if (!context.Request.Path.Value.Contains("swagger"))
            {
                // https://devblogs.microsoft.com/aspnet/re-reading-asp-net-core-request-bodies-with-enablebuffering/
                context.Request.EnableBuffering();

                var requestLog = $"REQUEST HttpMethod: {context.Request.Method}, Path: {context.Request.Path}";

                if (context.Request.QueryString.HasValue)
                {
                    requestLog += $", QueryString : {context.Request.QueryString}";
                }

                var bufferSize = 1024 * 30;

                // Leave the body open so the next middleware can read it.
                using (var reader = new StreamReader(
                    context.Request.Body,
                    encoding: Encoding.UTF8,
                    detectEncodingFromByteOrderMarks: false,
                    bufferSize: bufferSize,
                    leaveOpen: true))
                {
                    var body = await reader.ReadToEndAsync();

                    if (!string.IsNullOrWhiteSpace(body))
                    {
                        requestLog += $", Body : {body}";
                    }

                    // Reset the request body stream position so the next middleware can read it
                    context.Request.Body.Position = 0;
                }

                logger.LogInformation(requestLog);
            }

            // Call the next delegate/middleware in the pipeline
            await _next(context);
        }
    }
}
