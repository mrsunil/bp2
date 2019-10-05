using LDC.Atlas.Application.Core.Services;
using Microsoft.AspNetCore.Http;
using System;
using System.Globalization;
using System.Security.Claims;

namespace LDC.Atlas.Infrastructure.Services
{
    public class IdentityService : IIdentityService
    {
        private readonly IHttpContextAccessor _context;

        public IdentityService(IHttpContextAccessor context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public ClaimsPrincipal GetUser()
        {
            return _context.HttpContext?.User;
        }

        public string GetUserIdentifier()
        {
            var claim = _context.HttpContext.User.FindFirst(AtlasClaimTypes.ObjectIdentifier) ?? _context.HttpContext.User.FindFirst(AtlasClaimTypes.Subject);

            return claim.Value;
        }

        public string GetUserPrincipalName()
        {
            return _context.HttpContext.User.FindFirst(ClaimTypes.Upn)?.Value ?? _context.HttpContext.User.FindFirst(AtlasClaimTypes.UniqueName)?.Value;
        }

        public string GetUserEmail()
        {
            return _context.HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;
        }

        public string GetUserName()
        {
            return _context.HttpContext.User.FindFirst(ClaimTypes.WindowsAccountName)?.Value
                ?? _context.HttpContext.User.Identity.Name;
        }

        public long GetUserAtlasId()
        {
            return long.Parse(_context.HttpContext.User.FindFirst(AtlasClaimTypes.AtlasId).Value, CultureInfo.InvariantCulture);
        }
    }
}
