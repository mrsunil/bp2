using Microsoft.AspNetCore.Authentication;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace LDC.Atlas.Infrastructure.Services.Authentication
{
    public class ClaimsTransformer : IClaimsTransformation
    {
        public Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
        {
            if (principal == null)
            {
                throw new ArgumentNullException(nameof(principal));
            }

            var email = principal.FindFirst(ClaimTypes.Upn)?.Value;
            if (!string.IsNullOrWhiteSpace(email))
            {
                ((ClaimsIdentity)principal.Identity).AddClaim(new Claim(ClaimTypes.Email, email));
            }

            return Task.FromResult(principal);
        }
    }
}
