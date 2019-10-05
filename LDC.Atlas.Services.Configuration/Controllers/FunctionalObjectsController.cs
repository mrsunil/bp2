using LDC.Atlas.Application.Common.Configuration;
using LDC.Atlas.Application.Common.Configuration.Dto;
using LDC.Atlas.Infrastructure.Swagger;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Configuration.Application.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using static LDC.Atlas.Services.Configuration.Infrastructure.Policies.AuthorizationPoliciesExtension;

namespace LDC.Atlas.Services.Configuration.Controllers
{
    [Route("api/v1/configuration/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    public class FunctionalObjectsController : ControllerBase
    {
        private readonly IFunctionalObjectService _functionalObjectQueries;
        private readonly IMediator _mediator;

        public FunctionalObjectsController(IFunctionalObjectService functionalObjectQueries, IMediator mediator)
        {
            _functionalObjectQueries = functionalObjectQueries;
            _mediator = mediator;
        }

        /// <summary>
        /// Returns the list of functional objects.
        /// </summary>
        /// <param name="pagingOptions">The options for pagination.</param>
        /// <param name="name">Search term for functional object's name.</param>
        [HttpGet]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<FunctionalObjectDto>), StatusCodes.Status200OK)]
        [Authorize(Policies.ReadGlobalParametersPolicy)]
        public async Task<ActionResult<PaginatedCollectionViewModel<FunctionalObjectDto>>> GetAllFunctionalObjects(
            [FromQuery] PagingOptions pagingOptions,
            [FromQuery] string name)
        {
            IEnumerable<FunctionalObjectDto> functionalObjects = await _functionalObjectQueries.GetAllFunctionalObjectsAsync(name);

            functionalObjects = functionalObjects.Skip(pagingOptions.Offset.Value).Take(pagingOptions.Limit.Value);
            var response = new PaginatedCollectionViewModel<FunctionalObjectDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, functionalObjects.ToList(), null);

            return Ok(response);
        }

        /// <summary>
        /// Returns a functional object by its name.
        /// </summary>
        /// <param name="functionalObjectId">ID of functional object.</param>
        [HttpGet("{functionalObjectId:int}")]
        [ProducesResponseType(typeof(FunctionalObjectDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Authorize(Policies.ReadGlobalParametersPolicy)]
        public async Task<ActionResult<FunctionalObjectDto>> GetFunctionalObjectById([Range(1, long.MaxValue)] int functionalObjectId)
        {
            var functionalObject = await _functionalObjectQueries.GetFunctionalObjectByIdAsync(functionalObjectId);

            return Ok(functionalObject);

        }

        /// <summary>
        /// Creates a new functional object.
        /// </summary>
        /// <param name="functionalObject">DTO that contains the required data to create a functional object.</param>
        [HttpPost("create")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [SwaggerResponseHeader(StatusCodes.Status201Created, HeaderNames.Location, "string", "Location of the newly created resource")]
        [Authorize(Policies.CreateFunctionalObjectPolicy)]
        public async Task<IActionResult> CreateFunctionalObject([FromBody, Required] CreateFunctionalObjectCommand functionalObject)
        {
            var functionalObjectId = await _mediator.Send(functionalObject);

            return CreatedAtAction(nameof(GetFunctionalObjectById), new { functionalObjectId }, null);
        }

        /// <summary>
        /// Edit a new functional object.
        /// </summary>
        /// <param name="functionalObject">DTO that contains the required data to create a functional object.</param>
        [HttpPost("update")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [SwaggerResponseHeader(StatusCodes.Status201Created, HeaderNames.Location, "string", "Location of the newly created resource")]
        [Authorize(Policies.CreateFunctionalObjectPolicy)]
        public async Task<IActionResult> UpdateFunctionalObject([FromBody, Required] UpdateFunctionalObjectCommand functionalObject)
        {
            var functionalObjectId = await _mediator.Send(functionalObject);

            return CreatedAtAction(nameof(GetFunctionalObjectById), new { functionalObjectId }, null);
        }

        /// <summary>
        /// Checks if a functional object exists.
        /// </summary>
        /// <param name="name">The name of the functional object.</param>
        /// <param name="id">The id of the current functional object.</param>
        [HttpPost("{id}/{name}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.ReadGlobalParametersPolicy)]
        public async Task<IActionResult> CheckFunctionalObjectNameExists(string name, int id)
        {
            var functionalObjectExists = await _functionalObjectQueries.IsFunctionalObjectExistsAsync(name, id);

            if (!functionalObjectExists)
            {
                return NoContent();
            }

            return Ok();
        }
    }
}