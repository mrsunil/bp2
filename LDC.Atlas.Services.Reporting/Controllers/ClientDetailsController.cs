using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Reporting.Application.Queries;
using LDC.Atlas.Services.Reporting.Application.Queries.Dto;
using LDC.Atlas.Services.Reporting.Infrastructure.Policies;
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
    public class ClientDetailsController : ControllerBase
    {
        private readonly IClientDetailsQueries _clientDetailsQueries;

        public ClientDetailsController(IClientDetailsQueries clientDetailsQueries)
        {
            _clientDetailsQueries = clientDetailsQueries;
        }

        [HttpPost("search")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<ReferentialCounterPartySearchResultDto>), StatusCodes.Status200OK)]
        [Authorize(Policies.ViewTradingAndExecutionPolicy)]
        public async Task<ActionResult<PaginatedCollectionViewModel<ReferentialCounterPartySearchResultDto>>> SearchReferentialCounterparties(
            string company,
            EntitySearchRequest searchRequest,
            [FromQuery] bool showDuplicateCounterpartyData)
        {
            var searchResult = await _clientDetailsQueries.SearchReferentialCounterPartyListAsync(company, searchRequest, showDuplicateCounterpartyData);

            var response = searchResult.ToPaginatedCollectionViewModel(searchRequest);

            return Ok(response);
        }

        [HttpPost("getBulkEditdata")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<ReferentialBulkEditDto>), StatusCodes.Status200OK)]
        [Authorize(Policies.ViewTradingAndExecutionPolicy)]
        public async Task<ActionResult<PaginatedCollectionViewModel<ReferentialBulkEditDto>>> SearchBulkEditReferentialCounterparties(
           string company,
           EntitySearchRequest searchRequest)
        {
            var searchResult = await _clientDetailsQueries.SearchBulkEditReferentialCounterPartyListAsync(company, searchRequest);

            var response = searchResult.ToPaginatedCollectionViewModel(searchRequest);

            return Ok(response);
        }
    }
}
