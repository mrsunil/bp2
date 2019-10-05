using System;
using System.Net.Mime;
using System.Threading.Tasks;
using LDC.Atlas.Services.Execution.Application.Commands;
using LDC.Atlas.Services.Execution.Application.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using LDC.Atlas.Services.Execution.Infrastructure.Policies;

namespace LDC.Atlas.Services.Execution.Controllers
{
    [Route("api/v1/execution/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class MonthEndTemporaryAdjustmentController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IAccountingSetUpQueries _accountingSetUpQueries;

        public MonthEndTemporaryAdjustmentController(IMediator mediator, IAccountingSetUpQueries accountingSetUpQueries)
        {
            _mediator = mediator;
            _accountingSetUpQueries = accountingSetUpQueries;
        }

        /// <summary>
        /// Saves the month end report.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="request">Month End TA Details</param>
        [HttpPost("saveMonthEnd")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Authorize(Policies.GenerateEndOfMonthPolicy)]
        [Authorize(Policies.GeneratePostings)]
        public async Task<IActionResult> SaveMonthEndReport(string company, MonthEndTemporaryAdjustmentListCommand request)
        {
            request.Company = company;
            request.DocumentDate = new DateTime(request.DataVersionDate.Year, request.DataVersionDate.Month, DateTime.DaysInMonth(request.DataVersionDate.Year, request.DataVersionDate.Month));

            var response = await _mediator.Send(request);

            return Ok(response);
        }

        /// <summary>
        /// Saves the FxDealmonth end report.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="request">Month End TA Details</param>
        [HttpPost("saveFxDealMonthEnd")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Authorize(Policies.GenerateEndOfMonthPolicy)]
        [Authorize(Policies.GeneratePostings)]
        public async Task<IActionResult> SaveFxDealMonthEndReport(string company, MonthEndTemporaryAdjustmentListCommand request)
        {
            request.Company = company;
            request.DocumentDate = new DateTime(request.DataVersionDate.Year, request.DataVersionDate.Month, DateTime.DaysInMonth(request.DataVersionDate.Year, request.DataVersionDate.Month));

            var response = await _mediator.Send(request);

            return Ok(response);
        }
    }
}
