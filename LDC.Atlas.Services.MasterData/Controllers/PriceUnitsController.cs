using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.MasterData.Application.Command.CreatePricesUnits;
using LDC.Atlas.Services.MasterData.Application.Command.PricesUnits.DeletePricesUnits;
using LDC.Atlas.Services.MasterData.Application.Command.PriceUnitCommands;
using LDC.Atlas.Services.MasterData.Application.Command.UpdatePricesUnits;
using LDC.Atlas.Services.MasterData.Application.Queries.Dto;
using LDC.Atlas.Services.MasterData.Entities;
using LDC.Atlas.Services.MasterData.Model;
using LDC.Atlas.Services.MasterData.Repositories;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Controllers
{
    [Route("api/v1/masterdata/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class PriceUnitsController : ControllerBase
    {
        private readonly IPriceUnitRepository _priceUnitRepository;
        private readonly IRedisConnectionFactory _cache;
        private readonly IMediator _mediator;

        public PriceUnitsController(
            IPriceUnitRepository priceUnitRepository,
            IRedisConnectionFactory cache,
            IMediator mediator)
        {
            _priceUnitRepository = priceUnitRepository;
            _cache = cache;
            _mediator = mediator;
        }

        /// <summary>
        /// Returns the list of price units.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="code">The code to search for.</param>
        /// <param name="description">The description to search for.</param>
        /// <param name="includeDeactivated">Include or not deactivated lines.</param>
        /// <param name="viewMode">The view mode (Local, Global). If not specified, Local by default.</param>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<PriceUnit>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<PriceUnit>>> Get(
            string company,
            [FromQuery] string code = null,
            [FromQuery] string description = null,
            [FromQuery] bool includeDeactivated = false,
            [FromQuery] string viewMode = MasterDataViewMode.Local)
        {
            var priceUnits = await _priceUnitRepository.GetAllAsync(viewMode == MasterDataViewMode.Local ? company : null, includeDeactivated, code, description);

            var response = new CollectionViewModel<PriceUnit>(priceUnits.ToList());

            return Ok(response);
        }

        /// <summary>
        /// Updates price units on the company level.
        /// </summary>
        /// <param name="company">Then company that the user belongs to.</param>
        /// <param name="request">The command object which contains the price unit records to update.</param>
        [HttpPatch]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Update(string company, [FromBody, Required] UpdatePricesUnitsLocalCommand request)
        {
            request.CompanyId = company;
            await _mediator.Send(request);

            return NoContent();
        }

        /// <summary>
        /// Updates price units on the global level.
        /// </summary>
        /// <param name="company">Then company that the user belongs to.</param>
        /// <param name="request">The command object which contains the price unit records to update.</param>
        [HttpPatch("global")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> UpdateGlobal(string company, [FromBody, Required] UpdatePricesUnitsCommand request)
        {
            request.CompanyId = company;

            await _mediator.Send(request);

            return NoContent();
        }

        /// <summary>
        /// Create price units on the global level.
        /// </summary>
        /// <param name="company">Then company that the user belongs to.</param>
        /// <param name="request">The command object which contains the price unit records to create.</param>
        [HttpPost("global")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> CreateGlobal(string company, [FromBody, Required] CreatePricesUnitsCommand request)
        {
            request.CompanyId = company;

            await _mediator.Send(request);

            return NoContent();
        }

        /// <summary>
        /// Delete a list of prices units.
        /// </summary>
        /// <param name="request">The list of prices units to delete.</param>
        [HttpPost("delete")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(CollectionViewModel<MasterDataDeletionResult>), StatusCodes.Status200OK)]
        public async Task<IActionResult> Delete([FromBody, Required] DeletePricesUnitsCommand request)
        {
            var result = await _mediator.Send(request);

            return Ok(new CollectionViewModel<MasterDataDeletionResult>(result.ToList()));
        }

        /// <summary>
        /// Returns the list of assignments for price units.
        /// </summary>
        /// <param name="request">The list of price units.</param>
        [HttpPost("assignments")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(CollectionViewModel<CompanyAssignment>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<CompanyAssignment>>> GetAssignments([FromBody, Required] GetAssignmentsRequest request)
        {
            var assignments = await _priceUnitRepository.GetAssignmentsAsync(request.MasterDataList);

            var response = new CollectionViewModel<CompanyAssignment>(assignments.ToList());

            return Ok(response);
        }

        /// <summary>
        /// Assigns or deassigns a list of price units to companies.
        /// </summary>
        /// <param name="company">Then company that the user belongs to.</param>
        /// <param name="request">The masterdata to assign or deassign.</param>
        [HttpPost("assign")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Assign(string company, [FromBody, Required] AssignPriceUnitCommand request)
        {
            request.CompanyId = company;

            await _mediator.Send(request);

            return NoContent();
        }

        /// <summary>
        /// Returns the list of activations for price units.
        /// </summary>
        /// <param name="request">The list of price units.</param>
        [HttpPost("activations")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(CollectionViewModel<CompanyActivation>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<CompanyActivation>>> GetActivations([FromBody, Required] GetActivationsRequest request)
        {
            var activations = await _priceUnitRepository.GetActivationsAsync(request.MasterDataList);

            var response = new CollectionViewModel<CompanyActivation>(activations.ToList());

            return Ok(response);
        }

        /// <summary>
        /// Activates or deactivates a list of price units to companies.
        /// </summary>
        /// <param name="company">Then company that the user belongs to.</param>
        /// <param name="request">The masterdata to activate or deactivate.</param>
        [HttpPost("activate")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Activate(string company, [FromBody, Required] ActivatePriceUnitCommand request)
        {
            request.CompanyId = company;

            await _mediator.Send(request);

            return NoContent();
        }
    }
}
