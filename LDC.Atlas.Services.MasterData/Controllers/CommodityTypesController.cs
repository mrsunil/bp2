using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.MasterData.Application.Command.CommodityTypes.CreateCommodityTypes;
using LDC.Atlas.Services.MasterData.Application.Command.CommodityTypes.DeleteCommodityTypes;
using LDC.Atlas.Services.MasterData.Application.Command.CommodityTypes.UpdateCommodityTypes;
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
    [Route("api/v1/masterdata/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class CommodityTypesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICommodityTypeRepository _commodityTypeRepository;
        private readonly IRedisConnectionFactory _cache;
        private readonly IMediator _mediator;

        public CommodityTypesController(IUnitOfWork unitOfWork, ICommodityTypeRepository commodityTypeRepository, IRedisConnectionFactory cache, IMediator mediator)
        {
            _unitOfWork = unitOfWork;
            _commodityTypeRepository = commodityTypeRepository;
            _cache = cache;
            _mediator = mediator;
        }

        /// <summary>
        /// Returns the list of commodity types.
        /// </summary>
        /// <param name="code">The code to search for.</param>
        /// <param name="description">The description to search for.</param>
        /// <param name="includeDeactivated">Include or not deactivated lines.</param>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<CommodityType>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<CommodityType>>> Get(
            [FromQuery] string code = null,
            [FromQuery] string description = null,
            [FromQuery] bool includeDeactivated = false)
        {
            var commodityTypes = await _commodityTypeRepository.GetAllAsync(includeDeactivated, code, description);

            var response = new CollectionViewModel<CommodityType>(commodityTypes.ToList());

            return Ok(response);
        }

        /// <summary>
        /// Updates commodity types on the global level.
        /// </summary>
        /// <param name="request">The command object which contains the commodity types records to update.</param>
        [HttpPatch("global")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Update([FromBody, Required] UpdateCommodityTypesCommand request)
        {
            await _mediator.Send(request);

            return NoContent();
        }

        /// <summary>
        /// Create commodity types on the global level.
        /// </summary>
        /// <param name="request">The command object which contains the commodity types records to create.</param>
        [HttpPost("global")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> CreateGlobal([FromBody, Required] CreateCommodityTypesCommand request)
        {
            await _mediator.Send(request);

            return NoContent();
        }

        /// <summary>
        /// Delete a list of commodity types.
        /// </summary>
        /// <param name="request">The list of commodity types to delete.</param>
        [HttpPost("delete")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(CollectionViewModel<MasterDataDeletionResult>), StatusCodes.Status200OK)]
        public async Task<IActionResult> Delete([FromBody, Required] DeleteCommodityTypesCommand request)
        {
            var result = await _mediator.Send(request);

            return Ok(new CollectionViewModel<MasterDataDeletionResult>(result.ToList()));
        }
    }
}
