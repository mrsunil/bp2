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
    public class AddressTypesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAddressTypeRepository _addressTypeRepository;
        private readonly IRedisConnectionFactory _cache;

        public AddressTypesController(IUnitOfWork unitOfWork, IAddressTypeRepository addressTypeRepository, IRedisConnectionFactory cache)
        {
            _unitOfWork = unitOfWork;
            _addressTypeRepository = addressTypeRepository;
            _cache = cache;
        }

        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<EnumEntity>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<EnumEntity>>> Get()
        {
            IEnumerable<EnumEntity> addressType = await _addressTypeRepository.GetAllAsync();

            var response = new CollectionViewModel<EnumEntity>(addressType.ToList());

            return Ok(response);
        }
    }
}