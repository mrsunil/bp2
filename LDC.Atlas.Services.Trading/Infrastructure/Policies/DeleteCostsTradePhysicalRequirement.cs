using LDC.Atlas.Authorization.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Trading.Infrastructure.Policies
{
    public class DeleteCostsTradePhysicalRequirement : IAuthorizationRequirement
    {
        public DeleteCostsTradePhysicalRequirement(IEnumerable<PrivilegePermission> privileges)
        {
            Privileges = privileges;
        }

        public IEnumerable<PrivilegePermission> Privileges { get; }
    }
}