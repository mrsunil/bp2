using LDC.Atlas.Authorization.Core.Entities;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace LDC.Atlas.Authorization.PolicyProvider.Services
{
    public class PrivilegeProvider : IPrivilegeProvider
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserIdentityService _userIdentityService;
        private IEnumerable<UserCompanyPrivilegesDto> _privileges;
        private AuthenticatedUser _user;

        public PrivilegeProvider(IHttpContextAccessor httpContextAccessor, UserIdentityService userIdentityService)
        {
            _userIdentityService = userIdentityService;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<AuthenticatedUser> LoadCurrentUserAsync(string companyId)
        {
            if (_user != null)
            {
                return _user;
            }

            // TODO: go back to GetTokenAsync with .NetCore 2.2
            string token = GetToken(); // await _httpContextAccessor.HttpContext.GetTokenAsync("access_token");

            _user = await _userIdentityService.GetCurrentUserAsync(token);

            _privileges = await _userIdentityService.GetCurrentUserPrivilegesAsync(token, companyId);

            return _user;
        }

        public IEnumerable<UserCompanyPrivilegesDto> GetCurrentUserPrivilegesAsync(ClaimsPrincipal user)
        {
            return _privileges ?? Enumerable.Empty<UserCompanyPrivilegesDto>();
        }

        // .Net Core 2.1 bug : https://github.com/aspnet/Security/issues/1765
        private string GetToken()
        {
            string authorization = _httpContextAccessor.HttpContext.Request.Headers["Authorization"];

            if (string.IsNullOrEmpty(authorization))
            {
                return null;
            }

            if (authorization.StartsWith("Bearer ", System.StringComparison.OrdinalIgnoreCase))
            {
                return authorization.Substring("Bearer ".Length).Trim();
            }

            return null;
        }
    }
}
