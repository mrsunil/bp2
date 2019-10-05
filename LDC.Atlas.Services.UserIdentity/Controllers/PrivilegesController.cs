using LDC.Atlas.Infrastructure;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.UserIdentity.Application.Queries;
using LDC.Atlas.Services.UserIdentity.Application.Queries.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.UserIdentity.Controllers
{
    [Route("api/v1/useridentity/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize(AtlasStandardPolicies.AdministratorAreaPolicy)]
    public class PrivilegesController : ControllerBase
    {
        private readonly IProfileQueries _profileQueries;

        public PrivilegesController(IProfileQueries profileQueries)
        {
            _profileQueries = profileQueries;
        }

        /// <summary>
        /// Returns the list of privileges.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<PrivilegeDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<PrivilegeDto>>> GetPrivileges()
        {
            IEnumerable<PrivilegeDto> privileges = await _profileQueries.GetPrivilegesAsync();

            var response = new CollectionViewModel<PrivilegeDto>(privileges.ToList());

            return Ok(response);
        }
    }
}