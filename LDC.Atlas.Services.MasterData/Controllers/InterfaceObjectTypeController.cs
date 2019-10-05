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
    public class InterfaceObjectTypeController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IInterfaceObjectTypeRepository _interfaceObjectTypeRepository;
        private readonly IRedisConnectionFactory _cache;

        public InterfaceObjectTypeController(IUnitOfWork unitOfWork, IInterfaceObjectTypeRepository repo, IRedisConnectionFactory cache)
        {
            _unitOfWork = unitOfWork;
            _interfaceObjectTypeRepository = repo;
            _cache = cache;
        }

        /// <summary>
        /// Returns the list of interface types.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<InterfaceObjectType>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<InterfaceObjectType>>> Get()
        {
            IEnumerable<InterfaceObjectType> interfaceObjectTypes = await _interfaceObjectTypeRepository.GetAllAsync();

            var response = new CollectionViewModel<InterfaceObjectType>(interfaceObjectTypes.ToList());

            return Ok(response);
        }
    }
}
