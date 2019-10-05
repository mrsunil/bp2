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
    public class CompanyBankAccountsController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICompanyBankAccountsRepository _companyBankAccountsRepository;
        private readonly IRedisConnectionFactory _cache;

        public CompanyBankAccountsController(IUnitOfWork unitOfWork, ICompanyBankAccountsRepository repo, IRedisConnectionFactory cache)
        {
            _unitOfWork = unitOfWork;
            _companyBankAccountsRepository = repo;
            _cache = cache;
        }


        /// <summary>
        /// Returns the list of bank names based on the company and currency code.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="currency">The currency code.</param>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<CompanyBankAccount>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<CompanyBankAccount>>> Get(string company, string currency)
        {
            IEnumerable<CompanyBankAccount> companyBankAccounts = await _companyBankAccountsRepository.GetAllAsync(company, currency);

            var response = new CollectionViewModel<CompanyBankAccount>(companyBankAccounts.ToList());

            return Ok(response);
        }
    }
}
