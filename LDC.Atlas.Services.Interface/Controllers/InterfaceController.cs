using System.Net.Mime;
using System.Threading.Tasks;
using LDC.Atlas.Services.Interface.Application.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using LDC.Atlas.Services.Interface.Application.Commands;
using MediatR;
using System.ComponentModel.DataAnnotations;

namespace LDC.Atlas.Services.Interface.Controllers
{
    [Route("api/v1/interface/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class InterfaceController : Controller
    {
        private readonly IInterfaceQueries _interfaceQueries;
        private readonly IMediator _mediator;

        public InterfaceController(IMediator mediator, IInterfaceQueries interfaceQueries)
        {
            _interfaceQueries = interfaceQueries;
            _mediator = mediator;
        }

        /// <summary>
        /// Get the status of the interfaces.
        /// </summary>
        /// <returns>Status of the interfaces.</returns>
        [HttpGet("interfaceactivestatus")]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> GetInterfaceProcessActiveStatus()
        {
            var status = await _interfaceQueries.GetInterfaceProcessActiveStatusAsync();

            return Ok(status);
        }

        /// <summary>
        /// To Start/stop the interfaces.
        /// </summary>
        /// <param name="request">Request with the status of the interfaces.</param>
        /// <returns>Returns whether the interface is started ot stopped.</returns>
        [HttpPost("startstopinterface")]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> StartStopInterfaceProcess([FromBody, Required] StartStopInterfaceProcessCommand request)
        {
            var response = await _mediator.Send(request);

            return Ok(response);
        }
    }
}