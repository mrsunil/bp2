using LDC.Atlas.Services.Reporting.Application.Commands;
using LDC.Atlas.Services.Reporting.Application.Queries;
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
    public class PnlMovementController : ControllerBase
    {
        private readonly IPnlMovementQueries _pnlMovementQueries;

        public PnlMovementController(
           IPnlMovementQueries pnlMovementQueries)
        {
            _pnlMovementQueries = pnlMovementQueries;
        }

        /// <summary>
        /// Returns a message for a Pnl Movement Report.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// /// <param name="companyList">The selected company code.</param>
        /// <param name="dataVersionIdList">The dataversionId  of the freeze.</param>
        /// <param name="compDataVersionIdList">The Compaarison dataversionId of the freeze.</param>
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult> GetFreezeForSelectedCompany(
           string company,
           [FromQuery] string companyList,
           [FromQuery] string dataVersionIdList,
           [FromQuery] string compDataVersionIdList)
        {
            companyList = companyList + ',' + company;
            var response = await _pnlMovementQueries.GetPnlMovementSummeryMessage(companyList, dataVersionIdList, compDataVersionIdList);

            return Ok(response);
        }
    }
}
