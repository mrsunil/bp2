using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using LDC.Atlas.Services.Configuration.Application.Commands;
using LDC.Atlas.Services.Configuration.Application.Commands.Dto;
using LDC.Atlas.Services.Configuration.Application.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LDC.Atlas.Services.Configuration.Controllers
{
    [Route("api/v1/configuration/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class GlobalParametersController : ControllerBase
    {
        private readonly IGlobalParametersQueries _globalParametersQueries;
        private readonly IMediator _mediator;

        public GlobalParametersController(IMediator mediator, IGlobalParametersQueries globalParametersQueries)
        {
            _mediator = mediator;
            _globalParametersQueries = globalParametersQueries;
        }

        /// <summary>
        /// Returns user preference list.
        /// </summary>
        [HttpGet("getuserpreference")]
        [ProducesResponseType(typeof(UserPreferenceDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<UserPreferenceDto>> GetUserPreference(int userId)
        {
            var userPreferenceResult = await _globalParametersQueries.GetUserPreference(userId);

            return Ok(userPreferenceResult);
        }


        /// <summary>
        /// Create global parameters language/date format user preference.
        /// </summary>
        /// <param name="request">The user preference details to create.</param>
        /// <response code="204">user preference created</response>
        [HttpPost("createuserpreference")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> CreateUserPreference([FromBody, Required] CreateUserPreferencesCommand request)
        {
            await _mediator.Send(request);

            return NoContent();
        }

        /// <summary>
        /// Update global parameters language/date format user preference.
        /// </summary>
        /// <param name="request">The user preference details to update.</param>
        /// <response code="204">user preference updated</response>
        [HttpPost("updateuserpreference")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> UpdateUserPreference([FromBody, Required] UpdateUserPreferencesCommand request)
        {
            await _mediator.Send(request);

            return NoContent();
        }

    }
}