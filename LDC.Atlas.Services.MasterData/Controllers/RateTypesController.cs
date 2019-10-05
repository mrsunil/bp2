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
    public class RateTypesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IRateTypesRepository _rateTypesRepository;

        public RateTypesController(IUnitOfWork unitOfWork, IRateTypesRepository rateTypesRepository)
        {
            _unitOfWork = unitOfWork;
            _rateTypesRepository = rateTypesRepository;
        }

        /// <summary>
        /// Returns the list of Rate Types.
        /// </summary>
        /// <param name="company">The company code.</param>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<EnumEntity>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<EnumEntity>>> Get(string company)
        {
            IEnumerable<EnumEntity> rateTypes = await _rateTypesRepository.GetAllAsync(company);

            var response = new CollectionViewModel<EnumEntity>(rateTypes.ToList());

            return Ok(response);
        }
    }
}
