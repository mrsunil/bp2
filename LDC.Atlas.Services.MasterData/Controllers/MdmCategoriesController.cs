using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.MasterData.Entities;
using LDC.Atlas.Services.MasterData.Model;
using LDC.Atlas.Services.MasterData.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace LDC.Atlas.Services.MasterData.Controllers
{
    [Route("api/v1/masterdata/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]

    public class MdmCategoriesController : ControllerBase
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly IMdmCategoryRepository _mdmCategoryRepository;
        private readonly IRedisConnectionFactory _cache;

        public MdmCategoriesController(IUnitOfWork unitOfWork, IMdmCategoryRepository mdmCategoryRepository, IRedisConnectionFactory cache)
        {
            _unitOfWork = unitOfWork;
            _mdmCategoryRepository = mdmCategoryRepository;
            _cache = cache;
        }

        /// <summary>
        /// Returns the list of MdmCategories.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<MdmCategory>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<MdmCategory>>> Get()
        {
            IEnumerable<MdmCategory> mdmCategories = await _mdmCategoryRepository.GetAllAsync();

            var response = new CollectionViewModel<MdmCategory>(mdmCategories.ToList());

            return Ok(response);
        }
    }
}
