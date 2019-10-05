using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Execution.Application.Queries;
using LDC.Atlas.Services.Execution.Application.Queries.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Controllers
{
    [Route("api/v1/execution/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class CharterManagersController : Controller
    {
        private readonly ICharterQueries _charterQueries;

        public CharterManagersController(ICharterQueries charterQueries)
        {
            _charterQueries = charterQueries;
        }

        /// <summary>
        /// Returns the list of charter managers.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        /// <param name="name">The name of the charter manager to search for.</param>
        [HttpGet]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<CharterManagerDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult> GetCharterManagersAsync(
            string company,
            [FromQuery] PagingOptions pagingOptions,
            [FromQuery] string name)
        {
            IEnumerable<CharterManagerDto> charterManagers;
            if (string.IsNullOrWhiteSpace(name))
            {
                charterManagers = await _charterQueries.GetCharterManagersAsync(company);
            }
            else
            {
                charterManagers = await _charterQueries.FindCharterManagersByNameAsync(company, name);
            }

            charterManagers = charterManagers.Skip(pagingOptions.Offset.Value).Take(pagingOptions.Limit.Value);
            var response = new PaginatedCollectionViewModel<CharterManagerDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, charterManagers.ToList(), null);

            return Ok(response);
        }
    }
}