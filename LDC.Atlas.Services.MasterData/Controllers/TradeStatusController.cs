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
    public class TradeStatusController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ITradeStatusRepository _tradeStatusRepository;
        private readonly IRedisConnectionFactory _cache;

        public TradeStatusController(IUnitOfWork unitOfWork, ITradeStatusRepository tradeStatusRepository, IRedisConnectionFactory cache)
        {
            _unitOfWork = unitOfWork;
            _tradeStatusRepository = tradeStatusRepository;
            _cache = cache;
        }

        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<EnumEntity>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<EnumEntity>>> Get()
        {
            IEnumerable<EnumEntity> tradeStatus = await _tradeStatusRepository.GetAllAsync();

            var response = new CollectionViewModel<EnumEntity>(tradeStatus.ToList());

            return Ok(response);
        }
    }
}