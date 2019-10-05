using LDC.Atlas.Application.Common.Configuration;
using LDC.Atlas.Application.Common.Configuration.Dto;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Configuration.Application.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
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
    public class GridsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IGridService _gridConfigurationQueries;

        public GridsController(IMediator mediator, IGridService gridConfigurationQueries)
        {
            _mediator = mediator;

            _gridConfigurationQueries = gridConfigurationQueries;
        }

        /// <summary>
        /// Returns list of grids for configuration by its grid type.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="configurationTypeId">The configuration type id.</param>
        [HttpGet("{configurationTypeId:long}/getGridConfigByConfigurationTypeId")]
        [ProducesResponseType(typeof(GridDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<GridDto>>> GetGridConfigByConfigurationTypeId(string company, string configurationTypeId)
        {
            var gridList = await _gridConfigurationQueries.GetGridConfigByConfigurationTypeId(configurationTypeId, company);

            var response = new CollectionViewModel<GridDto>(gridList);

            return Ok(response);
        }

        /// <summary>
        /// Returns a grid configuration by its grid code.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="gridCode">The grid code.</param>
        [HttpGet("{gridCode}")]
        [ProducesResponseType(typeof(GridDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<GridDto>> GetGridConfiguration(string company, string gridCode)
        {
            var config = await _gridConfigurationQueries.GetGrid(gridCode, company);

            return Ok(config);
        }

        /// <summary>
        /// Returns a grid configuration by its grid id.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="gridId">The grid Id.</param>
        [HttpGet("{gridId:long}/getGridConfigById")]
        [ProducesResponseType(typeof(GridDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<GridDto>> GetGridConfigurationByGridId(string company, long gridId)
        {
            var config = await _gridConfigurationQueries.GetGridByGridId(gridId, company);

            return Ok(config);
        }

        /// <summary>
        /// Updates an existing grid configuration.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="gridId">The id of the grid to update.</param>
        /// <param name="grid">The grid to update.</param>
        /// <response code="204">Grid updated</response>
        [HttpPost("{gridId:long}/updateGridConfig")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> UpdateGridConfiguration(string company, long gridId, [FromBody, Required] UpdateGridCommand grid)
        {
            grid.CompanyId = company;
            grid.GridId = gridId;

            await _mediator.Send(grid);

            return NoContent();
        }
    }
}