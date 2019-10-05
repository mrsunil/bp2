using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.MasterData.Entities;
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
    public class ContractTypesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IContractTypeRepository _contractTypeRepository;

        public ContractTypesController(IUnitOfWork unitOfWork, IContractTypeRepository contractTypeRepository)
        {
            _unitOfWork = unitOfWork;
            _contractTypeRepository = contractTypeRepository;
        }

        /// <summary>
        /// Returns the list of contract types.
        /// </summary>
        /// <param name="company">The company code.</param>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<EnumEntity>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<EnumEntity>>> Get(string company)
        {
            IEnumerable<EnumEntity> contractTypes = await _contractTypeRepository.GetAllAsync(company);

            var response = new CollectionViewModel<EnumEntity>(contractTypes.ToList());

            return Ok(response);
        }
    }
}
