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

namespace LDC.Atlas.Services.MasterData.Controllers
{
    [Route("api/v1/masterdata/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class CashTypesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICashTypeRepository _cashTypeRepository;
        private readonly IRedisConnectionFactory _cache;

        public CashTypesController(IUnitOfWork unitOfWork, ICashTypeRepository repo, IRedisConnectionFactory cache)
        {
            _unitOfWork = unitOfWork;
            _cashTypeRepository = repo;
            _cache = cache;
        }

        /// <summary>
        /// Returns the list of cash types.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<CashType>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<CashType>>> Get()
        {
            IEnumerable<CashType> cashType = await _cashTypeRepository.GetAllAsync();

            var response = new CollectionViewModel<CashType>(cashType.ToList());

            return Ok(response);
        }
    }
}
