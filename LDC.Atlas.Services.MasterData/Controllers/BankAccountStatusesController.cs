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
    public class BankAccountStatusesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IBankAccountStatusRepository _bankAccountStatusRepository;
        private readonly IRedisConnectionFactory _cache;

        public BankAccountStatusesController(IUnitOfWork unitOfWork, IBankAccountStatusRepository bankAccountStatusRepository, IRedisConnectionFactory cache)
        {
            _unitOfWork = unitOfWork;
            _bankAccountStatusRepository = bankAccountStatusRepository;
            _cache = cache;
        }

        /// <summary>
        /// Returns the list of bank account status.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<BankAccountStatus>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<BankAccountStatus>>> Get()
        {
            IEnumerable<BankAccountStatus> bankAccountStatus = await _bankAccountStatusRepository.GetAllAsync();

            var response = new CollectionViewModel<BankAccountStatus>(bankAccountStatus.ToList());

            return Ok(response);
        }
    }
}