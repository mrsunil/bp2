using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.MasterData.Application.Command.CountryCommands;
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
    public class CountriesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICountryRepository _countryRepository;
        private readonly IRedisConnectionFactory _cache;
        private readonly IMediator _mediator;

        public CountriesController(IUnitOfWork unitOfWork, ICountryRepository countryRepository, IRedisConnectionFactory cache, IMediator mediator)
        {
            _unitOfWork = unitOfWork;
            _countryRepository = countryRepository;
            _cache = cache;
            _mediator = mediator;
        }

        /// <summary>
        /// Returns the list of countries.
        /// </summary>
        /// <param name="code">The code to search for.</param>
        /// <param name="description">The description to search for.</param>
        /// <param name="includeDeactivated">Include or not deactivated lines.</param>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<Country>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<Country>>> Get(
            [FromQuery] string code = null,
            [FromQuery] string description = null,
            [FromQuery] bool includeDeactivated = false)
        {
            var countries = await _countryRepository.GetAllAsync(includeDeactivated, code, description);

            var response = new CollectionViewModel<Country>(countries.ToList());

            return Ok(response);
        }

        [HttpPatch]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.EditCountryPolicy)]
        public async Task<IActionResult> Update(string company, [FromBody, Required] CountryUpdateCommands request)
        {
            await _mediator.Send(request);

            return NoContent();
        }

        /// <summary>
        /// Delete a list of countries.
        /// </summary>
        /// <param name="request">The list of countries to delete.</param>
        [HttpPost("delete")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(CollectionViewModel<MasterDataDeletionResult>), StatusCodes.Status200OK)]
        public async Task<IActionResult> Delete([FromBody, Required] DeleteCountriesCommand request)
        {
            var result = await _mediator.Send(request);

            return Ok(new CollectionViewModel<MasterDataDeletionResult>(result.ToList()));
        }
    }
}
