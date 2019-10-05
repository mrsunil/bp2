using LDC.Atlas.Authorization.Core.Common;
using LDC.Atlas.Authorization.PolicyProvider.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace LDC.Atlas.Authorization.PolicyProvider.Middleware
{
    /// <summary>
    /// This middleware is used to load the privileges associated with the current user and the current company.
    /// </summary>
    public class LoadUserPrivilegesMiddleware
    {
        private readonly RequestDelegate _next;

        public LoadUserPrivilegesMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext httpContext, IPrivilegeProvider privilegeProvider, ILogger<LoadUserPrivilegesMiddleware> logger)
        {
            if (httpContext.User.Identity.IsAuthenticated)
            {
                var companyId = (string)httpContext.GetRouteValue(ApiRoutes.CompanyParameter);

                var user = await privilegeProvider.LoadCurrentUserAsync(companyId);

                // User has no account in Atlas
                if (user == null)
                {
                    logger.LogWarning($"No account found for the current user: {httpContext.User.Identity.Name}");

                    var error = new ProblemDetails
                    {
                        Title = "You do not have the necessary permissions for this resource.",
                        Type = "https://atlas.ldc.com/security-error",
                        Status = StatusCodes.Status403Forbidden,
                        Detail = "No account found for the current user.",
                        Instance = httpContext.Request.Path
                    };

                    httpContext.Response.ContentType = "application/problem+json";
                    httpContext.Response.StatusCode = StatusCodes.Status403Forbidden;

                    await httpContext.Response.WriteAsync(JsonConvert.SerializeObject(error, Formatting.Indented, new JsonSerializerSettings
                    {
                        ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver()
                    }));

                    return;
                }

                var userPrivileges = privilegeProvider.GetCurrentUserPrivilegesAsync(null);

                // User is not configured for the given company
                if (!string.IsNullOrWhiteSpace(companyId) && !userPrivileges.Any(p => p.CompanyId == companyId))
                {
                    logger.LogWarning($"User {user.SamAccountName} is not allowed to access this company: {companyId}");

                    var error = new ProblemDetails
                    {
                        Title = "You do not have the necessary permissions for this resource.",
                        Type = "https://atlas.ldc.com/security-error",
                        Status = StatusCodes.Status403Forbidden,
                        Detail = $"User {user.SamAccountName} is not allowed to access this company: {companyId}.",
                        Instance = httpContext.Request.Path
                    };

                    httpContext.Response.ContentType = "application/problem+json";
                    httpContext.Response.StatusCode = StatusCodes.Status403Forbidden;

                    await httpContext.Response.WriteAsync(JsonConvert.SerializeObject(error, Formatting.Indented, new JsonSerializerSettings
                    {
                        ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver()
                    }));

                    return;
                }

                ClaimsIdentity identity = new ClaimsIdentity("AtlasPolicyProviderMiddleware", ClaimTypes.WindowsAccountName, null);
                identity.AddClaim(new Claim(ClaimConstants.AtlasId, user.UserId.ToString(CultureInfo.InvariantCulture), ClaimValueTypes.Integer64, ClaimConstants.AtlasIssuer));
                identity.AddClaim(new Claim(ClaimTypes.Upn, user.UserPrincipalName, ClaimValueTypes.UpnName, ClaimConstants.AtlasIssuer));
                identity.AddClaim(new Claim(ClaimTypes.WindowsAccountName, user.SamAccountName, ClaimValueTypes.String, ClaimConstants.AtlasIssuer));
                if (user.Email != null)
                {
                    identity.AddClaim(new Claim(ClaimTypes.Email, user.Email, ClaimValueTypes.Email));
                }

                if (user.Permissions.Any(p => p.CompanyId == companyId && p.ProfileName == AtlasProfiles.Administrator))
                {
                    identity.AddClaim(new Claim(ClaimConstants.IsAdministrator, bool.TrueString, ClaimValueTypes.Boolean, ClaimConstants.AtlasIssuer));
                }

                httpContext.User.AddIdentity(identity);
            }

            await _next(httpContext);
        }
    }
}
