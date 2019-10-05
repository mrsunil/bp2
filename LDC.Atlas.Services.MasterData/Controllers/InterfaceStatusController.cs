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
    public class InterfaceStatusController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IInterfaceStatusRepository _interfaceStatusRepository;
        private readonly IRedisConnectionFactory _cache;

        public InterfaceStatusController(IUnitOfWork unitOfWork, IInterfaceStatusRepository repo, IRedisConnectionFactory cache)
        {
            _unitOfWork = unitOfWork;
            _interfaceStatusRepository = repo;
            _cache = cache;
        }

        /// <summary>
        /// Returns the list of interface status.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<InterfaceStatus>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<InterfaceStatus>>> Get()
        {
            IEnumerable<InterfaceStatus> interfaceStatus = await _interfaceStatusRepository.GetAllAsync();

            var response = new CollectionViewModel<InterfaceStatus>(interfaceStatus.ToList());

            return Ok(response);
        }
    }
}
