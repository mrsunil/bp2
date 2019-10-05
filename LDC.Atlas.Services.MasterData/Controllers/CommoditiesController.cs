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
    public class CommoditiesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICommodityRepository _commodityRepository;
        private readonly IRedisConnectionFactory _cache;

        public CommoditiesController(IUnitOfWork unitOfWork, ICommodityRepository commodityRepository, IRedisConnectionFactory cache)
        {
            _unitOfWork = unitOfWork;
            _commodityRepository = commodityRepository;
            _cache = cache;
        }

        /// <summary>
        /// Returns the list of commodities.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="pagingOptions">Options for pagination.</param>
        /// <param name="commoditySearchTerm">Search terms for commodities.</param>
        /// <param name="code">Parameter to support the quick search functionality for masterdata management.</param>
        /// <param name="description">The description to search for.</param>
        /// <param name="includeDeactivated">Include or not deactivated lines.</param>
        /// <param name="viewMode">The view mode (Local, Global). If not specified, Local by default.</param>
        [HttpGet]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<Commodity>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<Commodity>>> Get(
            string company,
            [FromQuery] PagingOptions pagingOptions,
            [FromQuery] CommoditySearchTerm commoditySearchTerm,
            [FromQuery] string code = null,
            [FromQuery] string description = null,
            [FromQuery] bool includeDeactivated = false,
            [FromQuery] string viewMode = MasterDataViewMode.Local)
        {
            if (!string.IsNullOrEmpty(code))
            {
                commoditySearchTerm.PrincipalCommodity = code;
            }

            var commodities = await _commodityRepository.GetAllAsync(viewMode == MasterDataViewMode.Local ? company : null, commoditySearchTerm, pagingOptions.Offset, null /*pagingOptions.Limit*/, includeDeactivated, description);

            var response = new PaginatedCollectionViewModel<Commodity>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, commodities.ToList());

            return Ok(response);
        }
    }
}
