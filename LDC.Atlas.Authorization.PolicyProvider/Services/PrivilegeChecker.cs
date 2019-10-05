using LDC.Atlas.Authorization.Core.Entities;
using System;
using System.Linq;
using System.Security.Claims;

namespace LDC.Atlas.Authorization.PolicyProvider.Services
{
    public class PrivilegeChecker : IPrivilegeChecker
    {
        private readonly IPrivilegeProvider _privilegeProvider;

        public PrivilegeChecker(IPrivilegeProvider privilegeProvider)
        {
            _privilegeProvider = privilegeProvider;
        }

        /// <summary>
        /// Determines whether the user has a privilege.
        /// </summary>
        /// <param name="user">The user.</param>
        /// <param name="privilege">The privilege.</param>
        /// <param name="permissionLevel">The permission level.</param>
        /// <exception cref="ArgumentNullException">
        /// user
        /// or
        /// privilege
        /// </exception>
        public bool HasPrivilege(ClaimsPrincipal user, string privilege, PermissionLevel permissionLevel)
        {
            if (user == null)
            {
                throw new ArgumentNullException(nameof(user));
            }

            if (privilege == null)
            {
                throw new ArgumentNullException(nameof(privilege));
            }

            var privileges = _privilegeProvider.GetCurrentUserPrivilegesAsync(user);

            var companyPrivileges = privileges.SelectMany(p => p.Privileges);

            return companyPrivileges.Any(p => p.PrivilegeName == privilege && (p.Permission >= (int)permissionLevel));
        }
    }
}
