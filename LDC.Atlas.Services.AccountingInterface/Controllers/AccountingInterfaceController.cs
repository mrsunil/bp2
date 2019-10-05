using LDC.Atlas.Application.Core.Entities;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.AccountingInterface.Application.Commands;
using LDC.Atlas.Services.AccountingInterface.Application.Queries;
using LDC.Atlas.Services.AccountingInterface.Application.Queries.Dto;
using LDC.Atlas.Services.AccountingInterface.Entities;
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

namespace LDC.Atlas.Services.AccountingInterface.Controllers
{
    [Route("api/v1/accountinginterface/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class AccountingInterfaceController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IAccountingInterfaceQueries _accountingInterfaceQueries;

        public AccountingInterfaceController(IMediator mediator, IAccountingInterfaceQueries accountingInterfaceQueries)
        {
            _mediator = mediator;
            _accountingInterfaceQueries = accountingInterfaceQueries;
        }

        /// <summary>
        /// Process AX message logs
        /// </summary>
        /// <param name="processInterfaceDataChangeLogsRequest">Process the Accounting Document queued in Message queue.</param>
        [HttpPost("processaccountinginterfacedatachangelog")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> ProcessAXDataLogsRequest(ProcessInterfaceDataChangeLogsRequest processInterfaceDataChangeLogsRequest)
        {
            await _mediator.Send(processInterfaceDataChangeLogsRequest);

            return Ok();
        }

        /// <summary>
        /// Process the response for the accounting interface from generic back interface
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
        /// Get List of functional Errors for Accounting Error Screen
        /// </summary>
        /// <param name="company">The company code</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        [HttpGet("listerrorsforerrormanagement")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<AccountingInterfaceErrorDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<AccountingInterfaceErrorDto>>> GetListOfErrorsForErrorManagement(string company, [FromQuery] PagingOptions pagingOptions)
        {
            var result = await _accountingInterfaceQueries.GetListOfTechnicalErrorsAsync(company);
            var response = new PaginatedCollectionViewModel<AccountingInterfaceErrorDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, result.ToList(), null);
            return Ok(response);
        }

        /// <summary>
        /// Update the Flag "ToBeInterfaced" for given DocRefs
        /// </summary>
        /// <param name="company">The company code</param>
        /// <param name="errorLines">Doc Refs of the Documents to be updated the interface status for</param>
        [HttpPost("updatestatusofaccountingerror")]
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
