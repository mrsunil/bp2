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

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace LDC.Atlas.Services.MasterData.Controllers
{
    [Route("api/v1/masterdata/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class MonthEndReportTypeController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMonthEndReportTypeRepository _monthEndReportTypeRepository;
        public MonthEndReportTypeController(IUnitOfWork unitOfWork, IMonthEndReportTypeRepository monthEndReportTypeRepository)
        {
            _unitOfWork = unitOfWork;
            _monthEndReportTypeRepository = monthEndReportTypeRepository;
        }


        /// <summary>
        /// Returns the list of MOnth end report types.
        /// </summary>
        /// <param name="company">The company code.</param>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<EnumEntity>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<EnumEntity>>> Get(string company)
        {
            IEnumerable<EnumEntity> monthEndReportType = await _monthEndReportTypeRepository.GetAllAsync(company);

            var response = new CollectionViewModel<EnumEntity>(monthEndReportType.ToList());

            return Ok(response);
        }
    }
}
