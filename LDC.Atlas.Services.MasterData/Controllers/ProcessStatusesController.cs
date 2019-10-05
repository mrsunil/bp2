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
    public class ProcessStatusesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IProcessStatusRepository _processStatusRepository;
        private readonly IRedisConnectionFactory _cache;

        public ProcessStatusesController(IUnitOfWork unitOfWork, IProcessStatusRepository processStatusRepository, IRedisConnectionFactory cache)
        {
            _unitOfWork = unitOfWork;
            _processStatusRepository = processStatusRepository;
            _cache = cache;
        }

        /// <summary>
        /// Returns the list of process status.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<ProcessStatus>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<ProcessStatus>>> Get()
        {
            IEnumerable<ProcessStatus> processStatus = await _processStatusRepository.GetAllAsync();

            var response = new CollectionViewModel<ProcessStatus>(processStatus.ToList());

            return Ok(response);
        }
    }
}