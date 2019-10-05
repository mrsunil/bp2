using LDC.Atlas.Authorization.Core.Entities;
using System.Security.Claims;

namespace LDC.Atlas.Authorization.PolicyProvider.Services
{
    public interface IPrivilegeChecker
    {
        bool HasPrivilege(ClaimsPrincipal user, string privilege, PermissionLevel permissionLevel);
    }
}