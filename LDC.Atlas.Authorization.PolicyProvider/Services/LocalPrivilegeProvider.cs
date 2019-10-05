using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.Authorization.Core.Entities;
using LDC.Atlas.Authorization.PolicyProvider.Services;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace LDC.Atlas.Authorization.PolicyProvider.Authorization
{
    public class LocalPrivilegeProvider : IPrivilegeProvider
    {
        private readonly IUserService _userService;
        private readonly IIdentityService _identityService;
        private IEnumerable<UserCompanyPrivilegesDto> _privileges;
        private AuthenticatedUser _user;

        public LocalPrivilegeProvider(IUserService userService, IIdentityService identityService)
        {
            _userService = userService;
            _identityService = identityService;
        }

        public async Task<AuthenticatedUser> LoadCurrentUserAsync(string companyId)
        {
            if (_user != null)
            {
                return _user;
            }

            var userId = _identityService.GetUserIdentifier();

            var user = await _userService.GetUserByActiveDirectoryIdAsync(userId);

            if (user != null)
            {
                _user = new AuthenticatedUser
                {
                    UserId = user.UserId,
                    UserPrincipalName = user.UserPrincipalName,
                    SamAccountName = user.SamAccountName,
                    Email = user.Email,
                };
                user.Permissions.ToList().ForEach(p => _user.Permissions.Add(new UserPermission { CompanyId = p.CompanyId, ProfileName = p.ProfileName }));

                var userPrivileges = await _userService.GetPrivilegesForUserAsync(user.UserId, companyId);
                _privileges = from p in userPrivileges
                              group p by p.CompanyId into g
                              select new UserCompanyPrivilegesDto { CompanyId = g.Key, Privileges = g.Select(p => new UserCompanyPrivilegeDto { ProfileId = p.ProfileId, PrivilegeName = p.PrivilegeName, Permission = p.Permission }) };

                return _user;
            }

            return null;
        }

        public IEnumerable<UserCompanyPrivilegesDto> GetCurrentUserPrivilegesAsync(ClaimsPrincipal user)
        {
            return _privileges ?? Enumerable.Empty<UserCompanyPrivilegesDto>();
        }
    }
}
