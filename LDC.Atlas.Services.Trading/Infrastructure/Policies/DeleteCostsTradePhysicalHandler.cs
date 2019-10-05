using LDC.Atlas.Authorization.PolicyProvider.Services;
using LDC.Atlas.Services.Trading.Entities;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Infrastructure.Policies
{
    public class DeleteCostsTradePhysicalHandler :
        AuthorizationHandler<DeleteCostsTradePhysicalRequirement, Section>
    {
        private readonly IPrivilegeChecker _privilegeChecker;

        public DeleteCostsTradePhysicalHandler(IPrivilegeChecker privilegeChecker)
        {
            _privilegeChecker = privilegeChecker;
        }

        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            DeleteCostsTradePhysicalRequirement requirement,
            Section resource)
        {
            var isContractApprovedOnce = resource.FirstApprovalDateTime != null;

            if (!isContractApprovedOnce && resource.ContractStatusCode == ContractStatus.Unapproved)
            {
                context.Succeed(requirement);
            }
            else if (resource.ContractStatusCode == ContractStatus.Approved)
            {
                if (requirement.Privileges.All(p => _privilegeChecker.HasPrivilege(context.User, p.Name, p.Permission)))
                {
                    context.Succeed(requirement);
                }
            }

            return Task.CompletedTask;
        }
    }
}