using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.MasterData.Entities;
using LDC.Atlas.Services.MasterData.Model;
using LDC.Atlas.Services.MasterData.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Globalization;
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
    public class CompaniesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICompanyRepository _companyRepository;
        private readonly IRedisConnectionFactory _cache;
        private readonly ISystemDateTimeService _systemDateTimeService;

        public CompaniesController(IUnitOfWork unitOfWork, ICompanyRepository companyRepository, ISystemDateTimeService systemDateTimeService, IRedisConnectionFactory cache)
        {
            _unitOfWork = unitOfWork;
            _companyRepository = companyRepository;
            _systemDateTimeService = systemDateTimeService;
            _cache = cache;
        }

        /// <summary>
        /// Returns the list of companies.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<Company>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<Company>>> Get([FromQuery] long? counterpartyId)
        {
            IEnumerable<Company> companies = await _companyRepository.GetAllAsync(counterpartyId);

            var response = new CollectionViewModel<Company>(companies.ToList());

            return Ok(response);
        }

        /// <summary>
        /// Returns a company by its identifier.
        /// </summary>
        /// <param name="companyId">The company identifier.</param>
        [HttpGet("{companyId}")]
        [ProducesResponseType(typeof(Company), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Company>> GetCompanyById(string companyId)
        {
            var company = await _companyRepository.GetCompanyByIdAsync(companyId);

            if (company != null)
            {
                return Ok(company);
            }

            return NotFound();
        }

        /// <summary>
        /// Returns the current date of a specified company.
        /// </summary>
        /// <param name="companyId">The company identifier.</param>
        [HttpGet("{companyId}/date")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(string), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<string>> GetCompanyDate(string companyId)
        {
            var companyDate = await _systemDateTimeService.GetCompanyDate(companyId);

            return Ok(companyDate.Date.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture));
        }

        /// <summary>
        /// List of comapnies mapped with Counterparty
        /// </summary>
        /// <param name="company">Company Id</param>
        /// <param name="counterpartyId">Counterparty Id</param>
        [HttpGet("getConfiguration/{counterpartyId}")]
        [ProducesResponseType(typeof(CollectionViewModel<Company>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<Company>>> GetAllByCounterpartyIdAsync(string company, long counterpartyId)
        {
            IEnumerable<Company> companies = await _companyRepository.GetAllByCounterpartyIdAsync(company, counterpartyId);

            var response = new CollectionViewModel<Company>(companies.ToList());

            return Ok(response);
        }

        /// <summary>
        /// Checks if a company name already exists.
        /// </summary>
        /// <param name="companyName">The company code.</param>
        [HttpHead("{companyname}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> CheckCompanyNameExists(string companyName)
        {
            var result = await _companyRepository.CheckCompanyNameExistsAsync(companyName);

            if (!result)
            {
                return NoContent();
            }

            return Ok();
        }
    }
}
