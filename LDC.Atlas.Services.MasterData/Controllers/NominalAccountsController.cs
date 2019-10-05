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
    public class NominalAccountsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly INominalAccountRepository _nominalAccountRepository;
        private readonly IRedisConnectionFactory _cache;
        private readonly IMediator _mediator;

        public NominalAccountsController(IUnitOfWork unitOfWork, INominalAccountRepository repo, IRedisConnectionFactory cache, IMediator mediator)
        {
            _unitOfWork = unitOfWork;
            _nominalAccountRepository = repo;
            _cache = cache;
            _mediator = mediator;
        }

        /// <summary>
        /// Returns the list of nominal accounts.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="code">The nominal account number to search for.</param>
        /// <param name="description">The description to search for.</param>
        /// <param name="includeDeactivated">Include or not deactivated lines.</param>
        /// <param name="viewMode">The view mode (Local, Global). If not specified, Local by default.</param>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<NominalAccount>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<NominalAccount>>> Get(
            string company,
            [FromQuery] string code = null,
            [FromQuery] string description = null,
            [FromQuery] bool includeDeactivated = false,
            [FromQuery] string viewMode = MasterDataViewMode.Local)
        {
            var nominalAccounts = await _nominalAccountRepository.GetAllAsync(viewMode == MasterDataViewMode.Local ? company : null, includeDeactivated, code, description);

            var response = new CollectionViewModel<NominalAccount>(nominalAccounts.ToList());

            return Ok(response);
        }

        [HttpPatch]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.EditNominalAccountPolicy)]
        public async Task<IActionResult> Update(string company, [FromBody, Required] NominalAccountUpdateCommands request)
        {
            await _mediator.Send(request);

            return NoContent();
        }
    }
}
