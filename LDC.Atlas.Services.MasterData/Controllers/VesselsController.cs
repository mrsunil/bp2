using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.MasterData.Application.Command;
using LDC.Atlas.Services.MasterData.Entities;
using LDC.Atlas.Services.MasterData.Infrastructure.Policies;
using LDC.Atlas.Services.MasterData.Model;
using LDC.Atlas.Services.MasterData.Repositories;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
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
    public class VesselsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IVesselRepository _vesselRepository;
        private readonly IRedisConnectionFactory _cache;
        private readonly IMediator _mediator;

        public VesselsController(IUnitOfWork unitOfWork, IVesselRepository vesselRepository, IRedisConnectionFactory cache, IMediator mediator)
        {
            _unitOfWork = unitOfWork;
            _vesselRepository = vesselRepository;
            _cache = cache;
            _mediator = mediator;
        }

        /// <summary>
        /// Returns the list of vessels.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="code">The name to search for.</param>
        /// <param name="description">The description to search for.</param>
        /// <param name="includeDeactivated">Include or not deactivated lines.</param>
        /// <param name="viewMode">The view mode (Local, Global). If not specified, Local by default.</param>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<Vessel>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<Vessel>>> Get(
            string company,
            [FromQuery] string code = null,
            [FromQuery] string description = null,
            [FromQuery] bool includeDeactivated = false,
            [FromQuery] string viewMode = MasterDataViewMode.Local)
        {
            var vessels = await _vesselRepository.GetAllAsync(viewMode == MasterDataViewMode.Local ? company : null, includeDeactivated, code, description);

            var response = new CollectionViewModel<Vessel>(vessels.ToList());

            return Ok(response);
        }

        [HttpPatch]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.EditVesselPolicy)]
        public async Task<IActionResult> Update([FromBody, Required] VesselUpdateCommands request)
        {
            await _mediator.Send(request);

            return NoContent();
        }
    }
}
