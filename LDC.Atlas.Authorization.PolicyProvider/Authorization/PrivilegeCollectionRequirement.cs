using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;

namespace LDC.Atlas.Authorization.PolicyProvider.Authorization
{
    /// <summary>
    /// This definition is a requirement which contains a collection of actions which are the permissions required by a method in the API
    /// </summary>
    public class PrivilegeCollectionRequirement : IAuthorizationRequirement
    {
        public PrivilegeCollectionRequirement(IEnumerable<Core.Entities.PrivilegePermission> privileges)
        {
            Privileges = privileges;
        }

        public IEnumerable<Core.Entities.PrivilegePermission> Privileges { get; }
    }
}
