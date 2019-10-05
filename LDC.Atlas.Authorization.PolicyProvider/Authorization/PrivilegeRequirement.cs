using LDC.Atlas.Authorization.Core.Entities;
using Microsoft.AspNetCore.Authorization;

namespace LDC.Atlas.Authorization.PolicyProvider.Authorization
{
    public class PrivilegeRequirement : IAuthorizationRequirement
    {
        public PrivilegeRequirement(string privilegeName)
        {
            PrivilegeName = privilegeName;
        }

        public PrivilegeRequirement(string privilegeName, PermissionLevel permissionLevel)
        {
            PrivilegeName = privilegeName;
            PermissionLevel = permissionLevel;
        }

        public string PrivilegeName { get; }

        public PermissionLevel PermissionLevel { get; }
    }
}
