using MediatR;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.MasterData.Entities;
using LDC.Atlas.Services.MasterData.Model;
using LDC.Atlas.Services.MasterData.Repositories;
using LDC.Atlas.Services.MasterData.Application.Queries.Dto;
using LDC.Atlas.Services.MasterData.Application.Command;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using LDC.Atlas.Services.MasterData.Application.Queries;
using System.ComponentModel.DataAnnotations;
using LDC.Atlas.Services.MasterData.Infrastructure.Policies;

namespace LDC.Atlas.Services.MasterData.Controllers
{
    [Route("api/v1/masterdata/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class CounterpartiesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICounterpartyRepository _counterpartyRepository;
        private readonly IRedisConnectionFactory _cache;
        private readonly ICounterpartyQueries _counterpartyQueries;
        private readonly IMediator _mediator;

        public CounterpartiesController(IUnitOfWork unitOfWork, ICounterpartyRepository counterpartyRepository, IRedisConnectionFactory cache, ICounterpartyQueries counterpartyQueries, IMediator mediator)
        {
            _unitOfWork = unitOfWork;
            _counterpartyRepository = counterpartyRepository;
            _cache = cache;
            _counterpartyQueries = counterpartyQueries;
            _mediator = mediator;
        }

        /// <summary>
        /// Returns the list of counter parties.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        /// <param name="code">The start of the counterparty code to search for</param>
        /// <param name="description">The search term for the description of the counterparty</param>
        [HttpGet]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<Counterparty>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<Counterparty>>> Get(
            string company,
            [FromQuery] PagingOptions pagingOptions,
            [FromQuery] string code,
            [FromQuery] string description = null)
        {
            IEnumerable<Counterparty> counterparties = await _counterpartyRepository.GetAllAsync(company, code, pagingOptions.Offset, null /*pagingOptions.Limit*/, description);

            var response = new PaginatedCollectionViewModel<Counterparty>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, counterparties.ToList());

            return Ok(response);
        }

        /// <summary>
        /// Returns the list of futures options clients.
        /// </summary>
        /// <param name="company">The company code.</param>
        [HttpGet]
        [Route("/api/v1/masterdata/{company}/FuturesOptionsClients")]
        [ProducesResponseType(typeof(CollectionViewModel<Counterparty>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<Counterparty>>> GetFuturesOptionsClients(string company)
        {
            IEnumerable<Counterparty> counterparties = await _counterpartyRepository.GetByPricingMethodAndDealTypeAsync(company, PricingMethod.FnO, DealType.Direct);

            var response = new CollectionViewModel<Counterparty>(counterparties.ToList());

            return Ok(response);
        }

        /// <summary>
        /// Returns the list of futures options brokers.
        /// </summary>
        /// <param name="company">The company code.</param>
        [HttpGet]
        [Route("/api/v1/masterdata/{company}/FuturesOptionsBrokers")]
        [ProducesResponseType(typeof(CollectionViewModel<Counterparty>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<Counterparty>>> GetFuturesOptionsBrokers(string company)
        {
            IEnumerable<Counterparty> counterparties = await _counterpartyRepository.GetByPricingMethodAndDealTypeAsync(company, PricingMethod.FnO, DealType.Broker);

            var response = new CollectionViewModel<Counterparty>(counterparties.ToList());

            return Ok(response);
        }

        /// <summary>
        /// Returns a Counterparty details along with addresses, bank accounts, contacts, taxes by its identifier.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="counterpartyId">The counter party identifier.</param>
        [HttpGet("{counterpartyId:long}")]
        [ProducesResponseType(typeof(CounterpartyDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<CounterpartyDto>> GetCounterpartyById(string company, long counterpartyId)
        {
            var counterparty = await _counterpartyQueries.GetCounterpartyByIdAsync(company, counterpartyId);

            return Ok(counterparty);
        }

        /// <summary>
        /// Returns MDM category and Accoount Type Mapping Data
        /// </summary>
      
        [HttpGet("mapping")]
        [ProducesResponseType(typeof(MdmCategoryAccountTypeMapping), StatusCodes.Status200OK)]
        public async Task<ActionResult<MdmCategoryAccountTypeMapping>> GetMdmCategoryAccountTypeMapping()
        {
            var counterparty = await _counterpartyQueries.GetMdmCategoryAccountTypeMappingAsync();

            var response = new CollectionViewModel<MdmCategoryAccountTypeMapping>(counterparty.ToList());

            return Ok(response);
        }

        /// <summary>
        /// Add or Update the Counterpart details along with addresses, bank accounts, contacts, taxes
        /// </summary>
        /// <param name="company">The company code</param>
        /// <param name="counterparty">Counterpart object</param>
        /// <returns>Counterparty Id single or multiple</returns>
        [HttpPost]
        [Authorize(Policies.EditCounterpartyPolicy)]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> AddUpdateCounterparty(string company, [FromBody, Required] AddUpdateCounterpartyCommand counterparty)
        {
            counterparty.Company = company;
            var counterpartyId = await _mediator.Send(counterparty);

            return Ok(counterpartyId);
        }

        /// <summary>
        /// Bulk update Counterpart details
        /// </summary>
        /// <param name="company">The company code</param>
        /// <param name="counterparties">Counterparty object list</param>
        /// <returns>Counterparty Id single or multiple</returns>
        [HttpPost("bulkupdatecounterparties")]
        [Authorize(Policies.EditCounterpartyPolicy)]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> BulkUpdateCounterparty(string company, [FromBody, Required] BulkUpdateCounterpartyCommand counterparties)
        {
            var counterpartyIds = await _mediator.Send(counterparties);

            return Ok(counterpartyIds);
        }
    }
}