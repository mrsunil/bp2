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
    public class InterfaceTypeController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IInterfaceTypeRepository _interfaceTypeRepository;
        private readonly IRedisConnectionFactory _cache;

        public InterfaceTypeController(IUnitOfWork unitOfWork, IInterfaceTypeRepository repo, IRedisConnectionFactory cache)
        {
            _unitOfWork = unitOfWork;
            _interfaceTypeRepository = repo;
            _cache = cache;
        }

        /// <summary>
        /// Returns the list of interface types.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<InterfaceTypes>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<InterfaceTypes>>> Get()
        {
            IEnumerable<InterfaceTypes> interfaceType = await _interfaceTypeRepository.GetAllAsync();

            var response = new CollectionViewModel<InterfaceTypes>(interfaceType.ToList());

            return Ok(response);
        }
    }
}
