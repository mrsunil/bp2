using LDC.Atlas.Infrastructure;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Trading.Application.Queries;
using LDC.Atlas.Services.Trading.Application.Queries.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Controllers
{
    [Route("api/v1/trading/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize(AtlasStandardPolicies.TradingAreaPolicy)]
    public class TradersController : ControllerBase
    {
        private readonly ITraderQueries _traderQueries;

        public TradersController(ITraderQueries traderQueries)
        {
            _traderQueries = traderQueries;
        }

        /// <summary>
        /// Returns the list of traders.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="name">The name of the trader.</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        [HttpGet]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<TraderDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<TraderDto>>> GetTradersAsync(
            string company,
            [FromQuery] string name,
            [FromQuery] PagingOptions pagingOptions)
        {
            var traders = await _traderQueries.GetTradersAsync(company, name);

            traders = traders.Skip(pagingOptions.Offset.Value).Take(pagingOptions.Limit.Value);
            var response = new PaginatedCollectionViewModel<TraderDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, traders.ToList(), null);

            return Ok(response);
        }
    }
}