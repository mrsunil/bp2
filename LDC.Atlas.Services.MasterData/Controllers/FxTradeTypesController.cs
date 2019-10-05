using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.MasterData.Entities;
using LDC.Atlas.Services.MasterData.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using LDC.Atlas.Services.MasterData.Application.Command;
using LDC.Atlas.Services.MasterData.Infrastructure.Policies;
using MediatR;
using System.ComponentModel.DataAnnotations;

namespace LDC.Atlas.Services.MasterData.Controllers
{
    [Route("api/v1/masterdata/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class FxTradeTypesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFxTradeTypeRepository _fxTradeTypeRepository;
        private readonly IMediator _mediator;
        public FxTradeTypesController(IUnitOfWork unitOfWork, IFxTradeTypeRepository fxTradeTypeRepository, IMediator mediator)
        {
            _unitOfWork = unitOfWork;
            _fxTradeTypeRepository = fxTradeTypeRepository;
            _mediator = mediator;
        }

        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<FxTradeType>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<FxTradeType>>> Get(string company,
            [FromQuery] string code = null,
            [FromQuery] string description = null,
            [FromQuery] bool includeDeactivated = false,
            [FromQuery] string viewMode = MasterDataViewMode.Local)
        {
            IEnumerable<FxTradeType> fxTradeTypes = await _fxTradeTypeRepository.GetAllAsync(viewMode == MasterDataViewMode.Local ? company : null, includeDeactivated, code, description);

            var response = new CollectionViewModel<FxTradeType>(fxTradeTypes.ToList());

            return Ok(response);
        }

        [HttpPatch("global")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.EditFxTradeTypePolicy)]
        public async Task<IActionResult> Update(string company, [FromBody, Required] FxTradeTypeGlobalUpdateCommands request)
        {
            request.Company = company;

            await _mediator.Send(request);

            return NoContent();
        }

        [HttpPatch]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.EditFxTradeTypePolicy)]
        public async Task<IActionResult> Update(string company, [FromBody, Required] FxTradeTypeLocalUpdateCommands request)
        {
            request.Company = company;

            await _mediator.Send(request);

            return NoContent();
        }

        [HttpPost]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Create(string company, [FromBody, Required] FxTradeTypeCreateCommands request)
        {
            await _mediator.Send(request);

            return NoContent();
        }
    }
}