using LDC.Atlas.Services.Reporting.Application.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mime;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Reporting.Controllers
{
    [Route("api/v1/reporting/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class AuditsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AuditsController(
            IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Process data change logs
        /// </summary>
        /// <param name="processDataChangeLogsRequest">The identifier of the data change log to process.</param>
        [HttpPost("processdatachangelog")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> ProcessDataChangeLogs(ProcessDataChangeLogsRequest processDataChangeLogsRequest)
        {
            await _mediator.Send(processDataChangeLogsRequest);

            return Ok();
        }
    }
}