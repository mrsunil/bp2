using LDC.Atlas.Authorization.Core.Entities;
using LDC.Atlas.Authorization.PolicyProvider.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;

namespace LDC.Atlas.Authorization.PolicyProvider.Authorization
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true, Inherited = true)]
    public class PrivilegeAuthorizationAttribute : AuthorizeAttribute, IAuthorizationFilter
    {
        private readonly IEnumerable<PrivilegePermission> _privilegePermissions;

        public PrivilegeAuthorizationAttribute(IEnumerable<PrivilegePermission> privilegePermissions)
        {
            _privilegePermissions = privilegePermissions;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var user = context.HttpContext.User;

            if (!user.Identity.IsAuthenticated)
            {
                return;
            }

            var privilegeChecker = (IPrivilegeChecker)context.HttpContext.RequestServices.GetService(typeof(IPrivilegeChecker));
            var isAuthorized = _privilegePermissions.All(p => privilegeChecker.HasPrivilege(user, p.Name, p.Permission));
            if (!isAuthorized)
            {
                context.Result = new StatusCodeResult(403);
            }
        }
    }
}
