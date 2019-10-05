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
    public class ProvincesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IProvinceRepository _provinceRepository;
        private readonly IRedisConnectionFactory _cache;

        public ProvincesController(IUnitOfWork unitOfWork, IProvinceRepository provinceRepository, IRedisConnectionFactory cache)
        {
            _unitOfWork = unitOfWork;
            _provinceRepository = provinceRepository;
            _cache = cache;
        }

        /// <summary>
        /// Returns the list of provinces.
        /// </summary>
        /// <param name="code">The code to search for.</param>
        /// <param name="description">The description to search for.</param>
        /// <param name="includeDeactivated">Include or not deactivated lines.</param>
        /// <param name="company">Company Identifier</param>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<Province>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<Province>>> Get(
            string company = null,
            [FromQuery] string code = null,
            [FromQuery] string description = null,
            [FromQuery] bool includeDeactivated = false)
        {
            var provinces = await _provinceRepository.GetAllAsync(company, includeDeactivated, code, description);

            var response = new CollectionViewModel<Province>(provinces.ToList());

            return Ok(response);
        }
    }
}
