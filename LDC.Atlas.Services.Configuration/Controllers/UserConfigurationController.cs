using LDC.Atlas.Application.Common.Configuration;
using LDC.Atlas.Application.Common.Configuration.Dto;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.Services.Configuration.Application.Commands;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Net.Mime;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Controllers
{
    [Route("api/v1/configuration/[controller]/{company}")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    public class UserConfigurationController : ControllerBase
    {
        private readonly Atlas.Application.Common.Configuration.IUserConfigurationService _userConfigurationQueries;
        private readonly IIdentityService _identityService;
        private readonly Application.Commands.IUserConfigurationService _userConfigurationService;

        public UserConfigurationController(
            Atlas.Application.Common.Configuration.IUserConfigurationService userConfigurationQueries,
            IIdentityService identityService,
            Application.Commands.IUserConfigurationService userConfigurationService)
        {
            _userConfigurationQueries = userConfigurationQueries;
            _identityService = identityService;
            _userConfigurationService = userConfigurationService;
        }

        /// <summary>
        /// Creates the user favourite columns in a specific grid
        /// </summary>
        /// <param name="company">the company code</param>
        /// <param name="userPreference">the user preferences to create</param>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Authorize]
        public async Task<IActionResult> CreateUserPreferenceColumns(string company, [FromBody] CreateUserPreferenceCommand userPreference)
        {
            await _userConfigurationService.CreateUserPreference(company, userPreference);

            return CreatedAtAction(nameof(GetUserPreferenceColumns), new { company, componentId = userPreference.ComponentId }, null);
        }

        /// <summary>
        /// Returns the user preference columns for a specific grid.
        /// </summary>
        /// <param name="company">The company code</param>
        /// <param name="componentId">The specific grid identifier</param>
        [HttpGet("{componentId}")]
        [ProducesResponseType(typeof(List<UserConfigurationDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize]
        public async Task<ActionResult<UserConfigurationDto>> GetUserPreferenceColumns(string company, string componentId)
        {
            var userId = _identityService.GetUserAtlasId();
            var userConfig = await _userConfigurationQueries.GetUserPreferenceColumns(userId, company, componentId);

            return Ok(userConfig);
        }
    }
}