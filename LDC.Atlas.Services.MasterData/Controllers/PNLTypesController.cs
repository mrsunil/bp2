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
    public class PNLTypesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPNLTypeRepository _pnlTypeRepository;
        private readonly IRedisConnectionFactory _cache;

        public PNLTypesController(IUnitOfWork unitOfWork, IPNLTypeRepository repo, IRedisConnectionFactory cache)
        {
            _unitOfWork = unitOfWork;
            _pnlTypeRepository = repo;
            _cache = cache;
        }

        /// <summary>
        /// Returns the list of pnl types.
        /// </summary>
        /// <param name="company">The company code.</param>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<PNLType>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<PNLType>>> Get(string company)
        {
            IEnumerable<PNLType> pnlType = await _pnlTypeRepository.GetAllAsync(company);

            var response = new CollectionViewModel<PNLType>(pnlType.ToList());

            return Ok(response);
        }
    }
}
