using LDC.Atlas.Services.Configuration.Application.Commands;
using LDC.Atlas.Services.Configuration.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Controllers
{
    [Route("api/v1/configuration/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class CompanyCreationController : ControllerBase
    {
        private readonly IMediator _mediator;

        public CompanyCreationController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Create a new company from scratch.
        /// </summary>
        /// <param name="request">The company details to create.</param>
        /// <response code="204">company created</response>
        [HttpPost("createcompanyconfiguration")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> CreateCompanyConfiguration([FromBody, Required] CreateCompanyConfigurationCommand request)
        {
            await _mediator.Send(request);

            return NoContent();
        }

        /// <summary>
        /// Creates a new company by copy
        /// </summary>
        /// <param name="request">The company details to copy.</param>
        [HttpPost("createcompanybycopy")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> CreateCompanyByCopy([FromBody, Required] CopyCompanyCommand request)
        {
            await _mediator.Send(request);

            return NoContent();
        }
    }
}