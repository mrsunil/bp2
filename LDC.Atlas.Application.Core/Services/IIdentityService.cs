using System.Security.Claims;

namespace LDC.Atlas.Application.Core.Services
{
    public interface IIdentityService
    {
        /// <summary>
        /// Gets the user for the current request.
        /// </summary>
        ClaimsPrincipal GetUser();

        /// <summary>
        /// Gets the STS identifier (oid or sub) of the current user.
        /// </summary>
        string GetUserIdentifier();

        /// <summary>
        /// Gets the account name of the current user.
        /// </summary>
        string GetUserName();

        /// <summary>
        /// Gets the user principal name (UPN) of the user
        /// </summary>
        string GetUserPrincipalName();

        /// <summary>
        /// Gets the email address of the user
        /// </summary>
        string GetUserEmail();

        /// <summary>
        /// Gets the Atlas identifier of the user
        /// </summary>
        long GetUserAtlasId();
    }
}
