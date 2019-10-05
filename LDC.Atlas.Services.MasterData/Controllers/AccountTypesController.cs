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
    public class AccountTypesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAccountTypeRepository _accountTypeRepository;
        private readonly IRedisConnectionFactory _cache;

        public AccountTypesController(IUnitOfWork unitOfWork, IAccountTypeRepository accountTypeRepository, IRedisConnectionFactory cache)
        {
            _unitOfWork = unitOfWork;
            _accountTypeRepository = accountTypeRepository;
            _cache = cache;
        }

        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<AccountType>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<AccountType>>> Get()
        {
            IEnumerable<AccountType> accountType = await _accountTypeRepository.GetAllAsync();

            var response = new CollectionViewModel<AccountType>(accountType.ToList());

            return Ok(response);
        }
    }
}