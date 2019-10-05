using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Reporting.Application.Commands;
using LDC.Atlas.Services.Reporting.Application.Queries;
using LDC.Atlas.Services.Reporting.Application.Queries.Dto;
using LDC.Atlas.Services.Reporting.Entities;
using LDC.Atlas.Services.Reporting.Infrastructure.Policies;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Net.Http.Headers;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using System;

namespace LDC.Atlas.Services.Reporting.Controllers
{
    [Route("api/v1/reporting/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class LdrepManualAdjustmentController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILdrepManualAdjustmentQueries _ldrepManualAdjustmentQueries;

        public LdrepManualAdjustmentController(IMediator mediator, ILdrepManualAdjustmentQueries ldrepManualAdjustmentQueries)
        {
            _mediator = mediator;
            _ldrepManualAdjustmentQueries = ldrepManualAdjustmentQueries;
        }

        /// <summary>
        /// Creates or updates LDREP manual adjustment(s).
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="adjustments">The ldrep manual adjustment to add.</param>
        [HttpPost("createupdateadjustment")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(LdrepManualAdjustment), StatusCodes.Status200OK)]
        [Authorize(Policies.EditReportPolicy)]
        public async Task<IActionResult> CreateUpdateLdrepManualAdjustment(string company, [FromBody, Required] CreateUpdateLdrepManualAdjustmentCommand adjustments)
        {
            adjustments.Company = company;
            var result = await _mediator.Send(adjustments);

            return Ok(result);
        }

        /// <summary>
        /// Returns Ldrep manual adjustments between date range.
        /// </summary>
        /// <param name="fromDate">The from date</param>
        /// <param name="toDate">The to date</param>
        /// <param name="company">The company code.</param>
        [HttpGet("getldrepmanualadjustments")]
        [ProducesResponseType(typeof(LdrepManualAdjustmentDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<LdrepManualAdjustmentDto>> GetLdrepManualAdjustments(string company, [FromQuery] DateTime fromDate, [FromQuery] DateTime? toDate, [FromQuery] PagingOptions pagingOptions)
        {
            var result = await _ldrepManualAdjustmentQueries.GetLdrepManualAdjustments(fromDate, toDate, company);
            var response = new PaginatedCollectionViewModel<LdrepManualAdjustmentDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, result.ToList(), null);

            return Ok(response);
        }

        /// <summary>
        /// Delete Ldrep manual adjustment.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="ldrepManualAdjustment">documents to unmatch manual matching.</param>
        [HttpPost("deletemanualadjustment")]
        [Consumes(MediaTypeNames.Application.Json)]
        [Authorize(Policies.EditReportPolicy)]
        public async Task<IActionResult> DeleteLdrepManualAdjustment(string company, [FromBody] DeleteLdrepManualAdjustmentCommand ldrepManualAdjustment)
        {
            ldrepManualAdjustment.Company = company;

            var response = await _mediator.Send(ldrepManualAdjustment);

            return Ok(response);
        }
    }
}
