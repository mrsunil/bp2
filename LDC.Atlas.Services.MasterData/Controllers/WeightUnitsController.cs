using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.MasterData.Entities;
using LDC.Atlas.Services.MasterData.Model;
using LDC.Atlas.Services.MasterData.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using MediatR;
using System.ComponentModel.DataAnnotations;
using LDC.Atlas.Services.MasterData.Application.Command;
using LDC.Atlas.Services.MasterData.Infrastructure.Policies;

namespace LDC.Atlas.Services.MasterData.Controllers
{
    [Route("api/v1/masterdata/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class WeightUnitsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IWeightUnitRepository _weightUnitRepository;
        private readonly IRedisConnectionFactory _cache;
        private readonly IMediator _mediator;

        public WeightUnitsController(IUnitOfWork unitOfWork, IWeightUnitRepository weightUnitRepository, IRedisConnectionFactory cache, IMediator mediator)
        {
            _unitOfWork = unitOfWork;
            _weightUnitRepository = weightUnitRepository;
            _cache = cache;
            _mediator = mediator;
        }

        /// <summary>
        /// Returns the list of weight units.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="code">The code to search for.</param>
        /// <param name="description">The description to search for.</param>
        /// <param name="includeDeactivated">Include or not deactivated lines.</param>
        /// <param name="viewMode">The view mode (Local, Global). If not specified, Local by default.</param>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<WeightUnit>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<WeightUnit>>> Get(
            string company,
            [FromQuery] string code = null,
            [FromQuery] string description = null,
            [FromQuery] bool includeDeactivated = false,
            [FromQuery] string viewMode = MasterDataViewMode.Local)
        {
            var weightUnits = await _weightUnitRepository.GetAllAsync(viewMode == MasterDataViewMode.Local ? company : null, includeDeactivated, code, description);

            var response = new CollectionViewModel<WeightUnit>(weightUnits.ToList());

            return Ok(response);
        }

        [HttpPatch]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.EditWeightUnitPolicy)]
        public async Task<IActionResult> Update([FromBody, Required] WeightUnitsUpdateCommands request)
        {
            await _mediator.Send(request);

            return NoContent();
        }
    }
}
