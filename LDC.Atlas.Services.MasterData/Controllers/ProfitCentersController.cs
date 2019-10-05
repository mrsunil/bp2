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
    public class ProfitCentersController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IProfitCenterRepository _profitCenterRepository;
        private readonly IRedisConnectionFactory _cache;
        private readonly IMediator _mediator;

        public ProfitCentersController(IUnitOfWork unitOfWork, IProfitCenterRepository profitCenterRepository, IRedisConnectionFactory cache, IMediator mediator)
        {
            _unitOfWork = unitOfWork;
            _profitCenterRepository = profitCenterRepository;
            _cache = cache;
            _mediator = mediator;
        }

        /// <summary>
        /// Returns the list of profit centers.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="selectedCompanies">The list of section identifiers.</param>
        /// <param name="code">The code to search for.</param>
        /// <param name="description">The description to search for.</param>
        /// <param name="includeDeactivated">Include or not deactivated lines.</param>
        /// <param name="viewMode">The view mode (Local, Global). If not specified, Local by default.</param>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<ProfitCenter>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<ProfitCenter>>> Get(
            string company,
            [FromQuery] string selectedCompanies,
            [FromQuery] string code = null,
            [FromQuery] string description = null,
            [FromQuery] bool includeDeactivated = false,
            [FromQuery] string viewMode = MasterDataViewMode.Local)
        {
            if (!string.IsNullOrEmpty(company) && !string.IsNullOrEmpty(selectedCompanies))
            {
                company = selectedCompanies + ',' + company;
            }

            var profitCenters = await _profitCenterRepository.GetAllAsync(viewMode == MasterDataViewMode.Local ? company.Split(',').ToArray() : null, includeDeactivated, code, description);

            var response = new CollectionViewModel<ProfitCenter>(profitCenters.ToList());

            return Ok(response);
        }

        [HttpPatch]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.EditProfitCenterPolicy)]
        public async Task<IActionResult> Update(string company, [FromBody, Required] ProfitCentersUpdateCommands request)
        {
            await _mediator.Send(request);

            return NoContent();
        }
    }
}
