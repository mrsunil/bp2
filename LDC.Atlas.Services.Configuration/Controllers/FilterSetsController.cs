using LDC.Atlas.Application.Common.Configuration;
using LDC.Atlas.Application.Common.Configuration.Dto;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.Infrastructure.Swagger;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Configuration.Application.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Controllers
{
    [Route("api/v1/configuration/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class FilterSetsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IFilterSetService _filterSetQueries;
        private readonly IIdentityService _identityService;

        public FilterSetsController(
            IMediator mediator,
            IFilterSetService filterSetQueries,
            IIdentityService identityService)
        {
            _mediator = mediator;
            _filterSetQueries = filterSetQueries;
            _identityService = identityService;
        }

        /// <summary>
        /// Returns the current user's list of filters set for a grid.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="gridCode">The grid code.</param>
        [HttpGet("/api/v1/configuration/{company}/grids/{gridCode}/myfiltersets")]
        [ProducesResponseType(typeof(CollectionViewModel<UserFilterSetDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<UserFilterSetDto>>> GetUserFilterSets(string company, string gridCode)
        {
            var userId = _identityService.GetUserAtlasId();

            var filterSets = await _filterSetQueries.GetUserFilterSets(userId, company, gridCode);

            var response = new CollectionViewModel<UserFilterSetDto>(filterSets.ToList());

            return Ok(response);
        }

        /// <summary>
        /// Returns a filter set by its identifier.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="gridCode">The grid code.</param>
        /// <param name="filterSetId">The filter set identifier.</param>
        [HttpGet("/api/v1/configuration/{company}/grids/{gridCode}/myfiltersets/{filterSetId:int}")]
        [ProducesResponseType(typeof(UserFilterSetDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<UserFilterSetDto>> GetUserFilterSetById(string company, string gridCode, int filterSetId)
        {
            var userId = _identityService.GetUserAtlasId();

            var config = await _filterSetQueries.GetUserFilterSetById(userId, company, filterSetId);

            return Ok(config);
        }

        /// <summary>
        /// Creates a filter set.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="gridCode">The grid code.</param>
        /// <param name="filterSet">The filter set to add.</param>
        /// <response code="201">Grid configuration created</response>
        [HttpPost("/api/v1/configuration/{company}/grids/{gridCode}/myfiltersets")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(GridDto), StatusCodes.Status201Created)]
        [SwaggerResponseHeader(StatusCodes.Status201Created, HeaderNames.Location, "string", "Location of the newly created resource")]
        public async Task<ActionResult<GridDto>> CreateUserFilterSet(string company, string gridCode, [FromBody, Required] CreateFilterSetCommand filterSet)
        {
            var userId = _identityService.GetUserAtlasId();

            filterSet.CompanyId = company;
            filterSet.GridCode = gridCode;
            filterSet.UserId = userId;

            var filterSetId = await _mediator.Send(filterSet);

            return CreatedAtAction(nameof(GetUserFilterSetById), new { company, gridCode, filterSetId }, filterSetId);
        }

        /// <summary>
        /// Updates an existing filter set.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="gridCode">The code of the grid.</param>
        /// <param name="filterSetId">The identifier of the filter set to update.</param>
        /// <param name="filterSet">The filter set to update.</param>
        /// <response code="204">Grid updated</response>
        [HttpPatch("/api/v1/configuration/{company}/grids/{gridCode}/myfiltersets/{filterSetId:int}")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> UpdateUserFilterSet(string company, string gridCode, int filterSetId, [FromBody, Required] UpdateFilterSetCommand filterSet)
        {
            filterSet.CompanyId = company;
            filterSet.GridCode = gridCode;
            filterSet.FilterSetId = filterSetId;

            await _mediator.Send(filterSet);

            return NoContent();
        }

        /// <summary>
        /// Remove a filter set.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="gridCode">The code of the grid.</param>
        /// <param name="filterSetId">The identifier of the filter set to delete.</param>
        [HttpDelete("/api/v1/configuration/{company}/grids/{gridCode}/myfiltersets/{filterSetId:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> DeleteUserFilterSet(string company, string gridCode, int filterSetId)
        {
            var userId = _identityService.GetUserAtlasId();

            var command = new DeleteFilterSetCommand
            {
                CompanyId = company,
                GridCode = gridCode,
                FilterSetId = filterSetId,
                UserId = userId,
            };

            await _mediator.Send(command);

            return NoContent();
        }

        [HttpPost("/api/v1/configuration/{company}/grids/{gridCode}/favoritefiltersets/{filterSetId}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> CreateFavoriteFilterSet(string company, string gridCode, int filterSetId)
        {
            var command = new CreateFavoriteFilterSetCommand
            {
                CompanyId = company,
                GridCode = gridCode,
                FilterSetId = filterSetId,
            };

            await _mediator.Send(command);

            return NoContent();
        }
    }
}