using LDC.Atlas.Authorization.PolicyProvider.Services;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Authorization.PolicyProvider.Authorization
{
    public class PrivilegeRequirementHandler : AuthorizationHandler<PrivilegeRequirement>
    {
        private readonly IPrivilegeChecker _privilegeChecker;

        public PrivilegeRequirementHandler(IPrivilegeChecker privilegeChecker)
        {
            _privilegeChecker = privilegeChecker;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, PrivilegeRequirement requirement)
        {
            if (_privilegeChecker.HasPrivilege(context.User, requirement.PrivilegeName, requirement.PermissionLevel))
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }

    public class PrivilegeCollectionRequirementHandler : AuthorizationHandler<PrivilegeCollectionRequirement>
    {
        private readonly IPrivilegeChecker _privilegeChecker;

        public PrivilegeCollectionRequirementHandler(IPrivilegeChecker privilegeChecker)
        {
            _privilegeChecker = privilegeChecker;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, PrivilegeCollectionRequirement requirement)
        {
            if (requirement.Privileges.All(p => _privilegeChecker.HasPrivilege(context.User, p.Name, p.Permission)))
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }
}
