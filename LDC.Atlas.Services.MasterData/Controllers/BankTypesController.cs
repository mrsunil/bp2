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
    public class BankTypesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IBankTypeRepository _bankTypeRepository;
        private readonly IRedisConnectionFactory _cache;

        public BankTypesController(IUnitOfWork unitOfWork, IBankTypeRepository bankTypeRepository, IRedisConnectionFactory cache)
        {
            _unitOfWork = unitOfWork;
            _bankTypeRepository = bankTypeRepository;
            _cache = cache;
        }

        /// <summary>
        /// Returns the list of bank types.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<BankType>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<BankType>>> Get()
        {
            IEnumerable<BankType> bankTypes = await _bankTypeRepository.GetAllAsync();

            var response = new CollectionViewModel<BankType>(bankTypes.ToList());

            return Ok(response);
        }
    }
}
