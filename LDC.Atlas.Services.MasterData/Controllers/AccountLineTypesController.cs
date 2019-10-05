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
    public class AccountLineTypesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAccountLineTypeRepository _accountLineTypeRepository;
        private readonly IRedisConnectionFactory _cache;

        public AccountLineTypesController(IUnitOfWork unitOfWork, IAccountLineTypeRepository accountLineTypeRepository, IRedisConnectionFactory cache)
        {
            _unitOfWork = unitOfWork;
            _accountLineTypeRepository = accountLineTypeRepository;
            _cache = cache;
        }

        /// <summary>
        /// Returns the list of account line types.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<Currency>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<AccountLineType>>> Get()
        {
            IEnumerable<AccountLineType> accountLineType = await _accountLineTypeRepository.GetAllAsync();

            var response = new CollectionViewModel<AccountLineType>(accountLineType.ToList());

            return Ok(response);
        }
    }
}
