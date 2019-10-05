using LDC.Atlas.Application.Common.Configuration;
using LDC.Atlas.Application.Common.Configuration.Dto;
using LDC.Atlas.Infrastructure.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mime;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Controllers
{
    [Route("api/v1/configuration/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class ApplicationTablesController : ControllerBase
    {
        private readonly IApplicationTableService _applicationTableQueries;

        public ApplicationTablesController(IApplicationTableService applicationTableQueries)
        {
            _applicationTableQueries = applicationTableQueries;
        }

        /// <summary>
        /// Return the list of application tables.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<ApplicationTableDto>), StatusCodes.Status200OK)]
        [Authorize]
        public async Task<ActionResult<CollectionViewModel<ApplicationTableDto>>> GetAllApplicationTables()
        {
            return Ok(await _applicationTableQueries.GetApplicationTablesAsync());
        }

        /// <summary>
        /// Returns the list of application fields associated to a table.
        /// </summary>
        /// <param name="tableId">The identifier of the application table.</param>
        [HttpGet("{tableId}")]
        [ProducesResponseType(typeof(ApplicationTableDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ApplicationTableDto>> GetApplicationFieldsByTableId(int tableId)
        {
            var applicationTable = await _applicationTableQueries.GetApplicationTableByIdAsync(tableId);

            return Ok(applicationTable);
        }
    }
}