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
    public class TimeZonesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ITimeZoneRepository _timeZoneRepository;
        private readonly IRedisConnectionFactory _cache;

        public TimeZonesController(IUnitOfWork unitOfWork, ITimeZoneRepository repo, IRedisConnectionFactory cache)
        {
            _unitOfWork = unitOfWork;
            _timeZoneRepository = repo;
            _cache = cache;
        }

        /// <summary>
        /// Returns the list of time zones.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<TimeZone>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<TimeZone>>> Get()
        {
            IEnumerable<TimeZone> timeZone = await _timeZoneRepository.GetAllAsync();

            var response = new CollectionViewModel<TimeZone>(timeZone.ToList());

            return Ok(response);
        }
    }
}
