using System;
using System.Net.Mime;
using System.Threading.Tasks;
using LDC.Atlas.Services.Execution.Application.Commands;
using LDC.Atlas.Services.Execution.Application.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Execution.Application.Queries.Dto;
using System.Linq;

namespace LDC.Atlas.Services.Execution.Controllers
{
    [Route("api/v1/execution/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class YearEndProcessController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IYearEndProcessQueries _yearEndProcessQueries;

        public YearEndProcessController(IMediator mediator, IYearEndProcessQueries yearEndProcessQueries)
        {
            _mediator = mediator;
            _yearEndProcessQueries = yearEndProcessQueries;
        }

        /// <summary>
        /// Returns the list of Year End Process.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="year">year end process according to year</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        [HttpGet("displayPnLClearance/{year}")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<YearEndProcessDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<YearEndProcessDto>>> GetYearEndProcessList(
           int year,  string company, [FromQuery] PagingOptions pagingOptions)
        {
            var yearEndProcessList = await _yearEndProcessQueries.GetYearEndProcessAsync(company, year);

            var response = new PaginatedCollectionViewModel<YearEndProcessDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, yearEndProcessList.ToList(), null);
            return Ok(response);
        }

        /// <summary>
        /// Saves the Year end report.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="request">Year End Details</param>
        [HttpPost("generateposting")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK)]

        public async Task<IActionResult> GenerateYearEndProcess(string company, YearEndProcessListCommand request)
        {
            request.Company = company;

            var response = await _mediator.Send(request);

            return Ok(response);


        }
    }
}
