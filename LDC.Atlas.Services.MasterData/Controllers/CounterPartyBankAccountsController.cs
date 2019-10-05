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
    public class CounterPartyBankAccountsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICounterPartyBankAccountsRepository _counterPartyAccountsRepository;
        private readonly IRedisConnectionFactory _cache;

        public CounterPartyBankAccountsController(IUnitOfWork unitOfWork, ICounterPartyBankAccountsRepository repo, IRedisConnectionFactory cache)
        {
            _unitOfWork = unitOfWork;
            _counterPartyAccountsRepository = repo;
            _cache = cache;
        }

        /// <summary>
        /// Returns the list of bank names based on the counterparty code and currency code.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="counterParty">The counterparty identifier.</param>
        /// <param name="currency">The currency code.</param>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<CounterPartyBankAccount>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<CounterPartyBankAccount>>> Get(string company, int counterParty, string currency)
        {
            IEnumerable<CounterPartyBankAccount> counterPartyBankAccounts = await _counterPartyAccountsRepository.GetAllAsync(company, counterParty, currency);

            var response = new CollectionViewModel<CounterPartyBankAccount>(counterPartyBankAccounts.ToList());

            return Ok(response);
        }
    }
}