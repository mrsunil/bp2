using LDC.Atlas.Authorization.Core.Entities;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace LDC.Atlas.Authorization.PolicyProvider.Services
{
    public interface IPrivilegeProvider
    {
        Task<AuthenticatedUser> LoadCurrentUserAsync(string companyId);

        IEnumerable<UserCompanyPrivilegesDto> GetCurrentUserPrivilegesAsync(ClaimsPrincipal user);
    }
}
