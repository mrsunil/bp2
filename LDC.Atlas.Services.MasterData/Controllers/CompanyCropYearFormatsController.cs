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
    public class CompanyCropYearFormatsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICompanyCropYearFormatRepository _companyCropYearFormatRepository;
        private readonly IRedisConnectionFactory _cache;
        private readonly ISystemDateTimeService _systemDateTimeService;

        public CompanyCropYearFormatsController(IUnitOfWork unitOfWork, ICompanyCropYearFormatRepository companyCropYearFormatRepository, ISystemDateTimeService systemDateTimeService, IRedisConnectionFactory cache)
        {
            _unitOfWork = unitOfWork;
            _companyCropYearFormatRepository = companyCropYearFormatRepository;
            _systemDateTimeService = systemDateTimeService;
            _cache = cache;
        }

        /// <summary>
        /// Returns the list of company crop year formats.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<EnumEntity>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<EnumEntity>>> Get()
        {
            IEnumerable<EnumEntity> companies = await _companyCropYearFormatRepository.GetAllAsync();

            var response = new CollectionViewModel<EnumEntity>(companies.ToList());

            return Ok(response);
        }
    }
}