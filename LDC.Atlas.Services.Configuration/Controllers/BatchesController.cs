using LDC.Atlas.Infrastructure;
using LDC.Atlas.Services.Configuration.Application.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Net.Mime;
using System.Threading.Tasks;
using static LDC.Atlas.Services.Configuration.Infrastructure.Policies.AuthorizationPoliciesExtension;

namespace LDC.Atlas.Services.Configuration.Controllers
{
    [Route("api/v1/configuration/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class BatchesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public BatchesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Execute a batch action on a group of companies.
        /// </summary>
        /// <param name="groupId">The group identifier.</param>
        /// <param name="actionId">The action identifier to execute.</param>
        /// <response code="204">Batch executed.</response>
        [HttpPost("{groupId}/{actionId}")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.BatchesPolicy)]
        [ProducesDefaultResponseType]
        public async Task<IActionResult> ExecuteBatch(int groupId, int actionId)
        {
            try
            {
                await _mediator.Send(new ExecuteBatchCommand { GroupId = groupId, ActionId = actionId });
            }
#pragma warning disable CA1031 // Do not catch general exception types
            catch (Exception e)
            {
                // Explicitly return code 400 for OPCON
                return StatusCode(StatusCodes.Status400BadRequest, new ExceptionProblemDetails(e)
                {
                    Status = StatusCodes.Status400BadRequest,
                    Detail = e.Message,
                    Instance = HttpContext.Request.Path
            });
            }
#pragma warning restore CA1031 // Do not catch general exception types

            return NoContent();
        }
    }
}