using LDC.Atlas.Services.Reporting.Application.Commands;
using LDC.Atlas.Services.Reporting.Application.Queries.Dto;
using LDC.Atlas.Services.Reporting.Infrastructure.Policies;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mime;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Reporting.Controllers
{
    [Route("api/v1/reporting/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class ReportPredicatesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ReportPredicatesController(
            IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Creates report criterias.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="reportCriteriasRequest">The additional criterias to add to the report.</param>
        [HttpPost]
        [ProducesResponseType(typeof(PredicateReference), StatusCodes.Status200OK)]
        [Authorize(Policies.ViewTradeCostReportPolicy)]
        public async Task<ActionResult<PredicateReference>> CreateReportCriterias(
            string company,
            ReportCriteriasRequest reportCriteriasRequest)
        {
            var command = new CreateReportCriteriasCommand
            {
                Company = company,
                ReportCriterias = reportCriteriasRequest
            };

            var predicateId = await _mediator.Send(command);

            return Ok(new PredicateReference { PredicateId = predicateId });
        }
    }
}