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

namespace LDC.Atlas.Services.MasterData.Controllers
{
    [Route("api/v1/masterdata/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class VatsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IVatRepository _vatRepository;
        private readonly IRedisConnectionFactory _cache;

        public VatsController(IUnitOfWork unitOfWork, IVatRepository vatRepository, IRedisConnectionFactory cache)
        {
            _unitOfWork = unitOfWork;
            _vatRepository = vatRepository;
            _cache = cache;
        }

        /// <summary>
        /// Returns the list of vat.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="code">The code to search for.</param>
        /// <param name="description">The description to search for.</param>
        /// <param name="includeDeactivated">Include or not deactivated lines.</param>
        /// <param name="viewMode">The view mode (Local, Global). If not specified, Local by default.</param>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<Vat>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<Vat>>> Get(
            string company,
            [FromQuery] string code = null,
            [FromQuery] string description = null,
            [FromQuery] bool includeDeactivated = false,
            [FromQuery] string viewMode = MasterDataViewMode.Local)
        {
            var vats = await _vatRepository.GetAllAsync(viewMode == MasterDataViewMode.Local ? company : null, includeDeactivated, code, description);

            var response = new CollectionViewModel<Vat>(vats.ToList());

            return Ok(response);
        }
    }
}
