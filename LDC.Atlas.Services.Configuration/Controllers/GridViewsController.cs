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
    public class GridViewsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IGridViewService _gridViewQueries;
        private readonly IIdentityService _identityService;

        public GridViewsController(
            IMediator mediator,
            IGridViewService gridViewQueries,
            IIdentityService identityService)
        {
            _mediator = mediator;
            _gridViewQueries = gridViewQueries;
            _identityService = identityService;
        }

        /// <summary>
        /// Returns the current user's list of gridViewss for a grid.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="gridCode">The grid code.</param>
        [HttpGet("/api/v1/configuration/{company}/grids/{gridCode}/mygridviews")]
        [ProducesResponseType(typeof(CollectionViewModel<UserGridViewDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<UserGridViewDto>>> GetUserGridViews(string company, string gridCode)
        {
            var gridViews = await _gridViewQueries.GetUserGridViews(company, gridCode);

            var response = new CollectionViewModel<UserGridViewDto>(gridViews.ToList());

            return Ok(response);
        }

        /// <summary>
        /// Returns a gridView by its identifier.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="gridCode">The grid code.</param>
        /// <param name="gridViewId">The gridView identifier.</param>
        [HttpGet("/api/v1/configuration/{company}/grids/{gridCode}/mygridviews/{gridViewId:int}")]
        [ProducesResponseType(typeof(UserGridViewDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<UserGridViewDto>> GetUserGridViewById(string company, string gridCode, int gridViewId)
        {
            var userId = _identityService.GetUserName();

            var config = await _gridViewQueries.GetUserGridViewById(userId, company, gridViewId);

            return Ok(config);
        }

        /// <summary>
        /// Creates a gridView.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="gridCode">The grid code.</param>
        /// <param name="gridView">The gridView to add.</param>
        /// <response code="201">Grid configuration created</response>
        [HttpPost("/api/v1/configuration/{company}/grids/{gridCode}/mygridviews")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(int), StatusCodes.Status201Created)]
        [SwaggerResponseHeader(StatusCodes.Status201Created, HeaderNames.Location, "string", "Location of the newly created resource")]
        public async Task<ActionResult<int>> CreateUserGridView(string company, string gridCode, [FromBody, Required] CreateGridViewCommand gridView)
        {
            gridView.CompanyId = company;
            gridView.GridCode = gridCode;

            var gridViewId = await _mediator.Send(gridView);

            return CreatedAtAction(nameof(GetUserGridViewById), new { company, gridCode, gridViewId }, gridViewId);
        }

        /// <summary>
        /// Updates an existing gridView.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="gridCode">The code of the grid.</param>
        /// <param name="gridViewId">The identifier of the gridView to update.</param>
        /// <param name="gridView">The gridView to update.</param>
        /// <response code="204">Grid updated</response>
        [HttpPatch("/api/v1/configuration/{company}/grids/{gridCode}/mygridviews/{gridViewId:int}")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> UpdateUserGridView(string company, string gridCode, int gridViewId, [FromBody, Required] UpdateGridViewCommand gridView)
        {
            gridView.CompanyId = company;
            gridView.GridCode = gridCode;
            gridView.GridViewId = gridViewId;

            await _mediator.Send(gridView);

            return NoContent();
        }

        /// <summary>
        /// Removes a gridView.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="gridCode">The code of the grid.</param>
        /// <param name="gridViewId">The identifier of the gridView to delete.</param>
        [HttpDelete("/api/v1/configuration/{company}/grids/{gridCode}/mygridviews/{gridViewId:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> DeleteUserGridView(string company, string gridCode, int gridViewId)
        {
            var userId = _identityService.GetUserName();

            var command = new DeleteGridViewCommand
            {
                CompanyId = company,
                GridCode = gridCode,
                GridViewId = gridViewId,
                UserId = userId,
            };

            await _mediator.Send(command);

            return NoContent();
        }

        [HttpPost("/api/v1/configuration/{company}/grids/{gridCode}/favoritegridviews")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> SetGridViewAsFavorite(string company, string gridCode, [FromBody, Required] UserGridViewDto gridView)
        {
            var command = new SetFavoriteGridViewCommand
            {
                CompanyId = company,
                GridCode = gridCode,
                GridViewId = gridView.GridViewId,
                GridViewColumnConfig = gridView.GridViewColumnConfig,
                Name = gridView.Name,
            };

            await _mediator.Send(command);

            return NoContent();
        }

        /// <summary>
        /// Checks if the name of the grid view exists regardless of the user.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="gridCode">The code of the grid.</param>
        /// <param name="gridViewName">The name of the grid view.</param>
        [HttpHead("/api/v1/configuration/{company}/grids/{gridCode}/mygridviews/{gridViewName}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> CheckGridViewName(string company, string gridCode, string gridViewName)
        {
            var gridViewExists = await _gridViewQueries.IsGridViewNameExists(company, gridCode, gridViewName);

            if (!gridViewExists)
            {
                return NoContent();
            }

            return Ok();
        }
    }
}
