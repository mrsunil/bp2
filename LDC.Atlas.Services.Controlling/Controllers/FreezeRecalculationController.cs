using LDC.Atlas.Services.Controlling.Application.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mime;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Controlling.Controllers
{
    [Route("api/v1/controlling/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    public class FreezeRecalculationController : ControllerBase
    {
        private readonly IMediator _mediator;

        public FreezeRecalculationController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Process data change logs
        /// </summary>
        /// <param name="processDataChangeLogsRequest">The identifier of the data change log to process.</param>
        [HttpPost("processrecalculation")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Authorize]
        public async Task<ActionResult> ProcessFreezeRecalculation(ProcessFreezeRecalculationCommand processDataChangeLogsRequest)
        {
            await _mediator.Send(processDataChangeLogsRequest);

            return Ok();
        }
    }
}
