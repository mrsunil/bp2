using LDC.Atlas.Application.Core.Entities;
using LDC.Atlas.Services.PaymentRequestInterface.Application.Commands;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Net.Mime;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PaymentRequestInterface.Controllers
{
    [Route("api/v1/paymentrequestinterface/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    public class PaymentRequestController : ControllerBase
    {
        private readonly IMediator _mediator;

        public PaymentRequestController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Process PaymentRequest message logs
        /// </summary>
        /// <param name="processInterfaceDataChangeLogsRequest">The identifier of the data change log to process.</param>
        [HttpPost("processpaymentrequestdatachangelog")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> ProcessPaymentRequestdatachangelog(ProcessInterfaceDataChangeLogsRequest processInterfaceDataChangeLogsRequest)
        {
            await _mediator.Send(processInterfaceDataChangeLogsRequest);

            return Ok();
        }

        /// <summary>
        /// Process the response for the PaymentRequest from generic back interface
        /// </summary>
        /// <param name="esbResponse">The identifier of the data response.</param>
        [HttpPost("esbresponse")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ProcessESBResult>> ProcessESBResponse(ProcessESBResponse esbResponse)
        {
            ProcessESBResult esbResult = await _mediator.Send(esbResponse);

            return Ok(esbResult);
        }

        /// <summary>
        /// Update the Flag "Ready to transmit" for given DocRefs
        /// </summary>
        /// <param name="company">The company code</param>
        /// <param name="errorLines">Doc Refs of the Documents to be updated the interface status for</param>
        [HttpPost("updatestatusofpaymenterror")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> UpdateAccountingErrorStatus(string company, [FromBody, Required] UpdateInterfaceStatusCommand errorLines)
        {
            errorLines.Company = company;
            await _mediator.Send(errorLines);
            return Ok(true);
        }
    }
}
