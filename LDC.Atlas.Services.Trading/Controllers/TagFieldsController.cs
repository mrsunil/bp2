using LDC.Atlas.Services.Trading.Application.Queries;
using LDC.Atlas.Services.Trading.Application.Queries.Dto;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections;
using System.Collections.Generic;
using System.Net.Mime;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Controllers
{
    [Route("api/v1/trading/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class TagFieldsController : ControllerBase
    {
        private readonly ITagFieldsQueries _tagFieldsQueries;

        public TagFieldsController(ITagFieldsQueries tagFieldsQueries)
        {
            _tagFieldsQueries = tagFieldsQueries;
        }

        /// <summary>
        /// Returns all tag parameters.
        /// </summary>
        /// <param name="company">Company</param>
        /// <returns>All tag parameters.</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<TagParameterDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult> GetAllTagParametersAsync(string company)
        {
            var result = await _tagFieldsQueries.GetAllTagParametersAsync(company);

            return Ok(result);
        }
    }
}