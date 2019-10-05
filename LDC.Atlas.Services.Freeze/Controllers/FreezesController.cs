using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.Infrastructure.Swagger;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.MasterData.Common;
using LDC.Atlas.Services.Freeze.Application.Commands;
using LDC.Atlas.Services.Freeze.Application.Queries;
using LDC.Atlas.Services.Freeze.Application.Queries.Dto;
using LDC.Atlas.Services.Freeze.Infrastructure.Policies;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Freeze.Controllers
{
    [Route("api/v1/freeze/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class FreezesController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IFreezeQueries _freezeQueries;
        private readonly IIdentityService _identityService;
        private readonly IMasterDataService _masterDataService;

        public FreezesController(
            IMediator mediator,
            IFreezeQueries freezeQueries,
            IIdentityService identityService,
            IMasterDataService masterDataService)
        {
            _mediator = mediator;
            _freezeQueries = freezeQueries;
            _identityService = identityService;
            _masterDataService = masterDataService;
        }

        /// <summary>
        /// Returns the list of freezes.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        /// <param name="dateFrom">The start date.</param>
        /// <param name="dateTo">The end date.</param>
        /// <param name="dataVersionTypeId">The data version type if specified.</param>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<FreezeDto>), StatusCodes.Status200OK)]
        [Authorize(Policies.CutOffPolicy)]
        public async Task<ActionResult<PaginatedCollectionViewModel<FreezeDto>>> GetFreezes(
            string company,
            [FromQuery] PagingOptions pagingOptions,
            [FromQuery] DateTime? dateFrom,
            [FromQuery] DateTime? dateTo,
            [FromQuery] DataVersionTypeDto? dataVersionTypeId)
        {
            var freezes = await _freezeQueries.GetFreezesAsync(company, dateFrom, dateTo, dataVersionTypeId, pagingOptions.Offset, pagingOptions.Limit);

            var response = new PaginatedCollectionViewModel<FreezeDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, freezes.ToList(), null);

            return Ok(response);
        }

        /// <summary>
        /// Returns a freeze by its identifier.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="dataVersionId">The data version of the freeze.</param>
        [HttpGet("{dataVersionId:int}")]
        [ProducesResponseType(typeof(FreezeDto), StatusCodes.Status200OK)]
        [Authorize(Policies.CutOffPolicy)]
        public async Task<ActionResult<FreezeDto>> GetFreeze(string company, int dataVersionId)
        {
            var freeze = await _freezeQueries.GetFreezeAsync(company, dataVersionId);

            return Ok(freeze);
        }

        /// <summary>
        /// Returns a freeze for a specified date.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="freezeDate">The date of the freeze.</param>
        /// <param name="dataVersionTypeId">The data version type of the freeze.</param>
        [HttpGet("{dataVersionTypeId:int}/{freezeDate:datetime}")]
        [ProducesResponseType(typeof(FreezeDto), StatusCodes.Status200OK)]
        [Authorize(Policies.CutOffPolicy)]
        public async Task<ActionResult<FreezeDto>> GetFreeze(string company, DateTime freezeDate, DataVersionTypeDto dataVersionTypeId)
        {
            var freeze = await _freezeQueries.GetFreezeAsync(company, freezeDate, dataVersionTypeId);

            return Ok(freeze);
        }

        /// <summary>
        /// Checks if a freeze exists for a specified date.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="freezeDate">The date of the freeze.</param>
        /// <param name="dataVersionTypeId">The data version type of the freeze.</param>
        [HttpHead("{dataVersionTypeId:int}/{freezeDate:datetime}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Authorize(Policies.CutOffPolicy)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult> CheckFreezeExists(string company, DateTime freezeDate, DataVersionTypeDto dataVersionTypeId)
        {
            var freeze = await _freezeQueries.GetFreezeAsync(company, freezeDate, dataVersionTypeId);

            if (freeze != null)
            {
                return Ok();
            }

            return NoContent();
        }

        /// <summary>
        /// Creates a new freeze.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="freeze">The freeze to add.</param>
        /// <response code="201">Freeze created.</response>
        [HttpPost]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [SwaggerResponseHeader(StatusCodes.Status201Created, HeaderNames.Location, "string", "Location of the newly created resource")]
        [Authorize(Policies.CreateFreezePolicy)]
        public async Task<ActionResult<FreezeDto>> CreateFreeze(string company, [FromBody, Required] CreateFreezeCommand freeze)
        {
            var companyInfo = await _masterDataService.GetCompaniesAsync();

            var currentCompany = companyInfo.FirstOrDefault(x => x.CompanyId == company);

            freeze.CompanyDate = DateTime.UtcNow;

            if (currentCompany != null)
            {
                freeze.CompanyDate = currentCompany.ActiveDate ?? DateTime.UtcNow;
            }

            freeze.Company = company;

            (var dataVersionId, var monthEnd) = await _mediator.Send(freeze);

            return CreatedAtAction(nameof(GetFreeze), new { company = company, dataVersionId = dataVersionId}, monthEnd);
        }

        /// <summary>
        /// Deletes a freeze.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="dataVersionId">The data version identifier of the freeze.</param>
        /// <response code="204">Freeze deleted.</response>
        [HttpDelete("{dataVersionId}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.CreateFreezePolicy)]
        public async Task<IActionResult> DeleteFreeze(string company, int dataVersionId)
        {
            var command = new DeleteFreezeCommand
            {
                Company = company,
                DataVersionId = dataVersionId,
            };

            await _mediator.Send(command);

            return NoContent();
        }

        /// <summary>
        /// Recalculate a freeze.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="dataVersionId">The id of the freeze to recalculate.</param>
        /// <param name="recalculateAccEntries">Is true if recalculate includes accounting data.</param>
        /// <response code="201">Freeze recalculated.</response>
        [HttpPost("{dataVersionId:int}/recalculate")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Authorize(Policies.RecalcFreezePolicy)]
        public async Task<IActionResult> RecalculateFreeze(string company, int dataVersionId, [FromQuery] bool recalculateAccEntries = true)
        {
            var userId = _identityService.GetUserAtlasId();

            var command = new RecalculateFreezeCommand
            {
                Company = company,
                DataVersionId = dataVersionId,
                UserId = userId,
                RecalculateAccEntries = recalculateAccEntries,
            };

            await _mediator.Send(command);

            return NoContent();
        }

        /// <summary>
        /// Creates a new freeze for every company in atlas.
        /// </summary>
        /// <param name="freeze">The freezes to create.</param>
        /// <response code="200">Freezes created.</response>
        [HttpPost("/api/v1/freeze/[controller]")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(CreateGlobalFreezeResult), StatusCodes.Status200OK)]
        [Authorize(Policies.CreateFreezePolicy)]
        public async Task<ActionResult<CreateGlobalFreezeResult>> CreateGlobalFreeze([FromBody, Required] CreateGlobalFreezeCommand freeze)
        {
            var result = await _mediator.Send(freeze);

            return Ok(result);
        }

        /// <summary>
        /// Purges freezes for a company based on retention policies.
        /// </summary>
        /// <param name="company">The company code.</param>
        [HttpPost("purgefreezes")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.CreateFreezePolicy)]
        public async Task<IActionResult> PurgeFreezes(string company)
        {
            var command = new PurgeFreezesCommand
            {
                Company = company
            };

            await _mediator.Send(command);

            return NoContent();
        }

        /// <summary>
        /// Checks if a freeze exists for a specified company list and date.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="companyList">The list of company.</param>
        /// <param name="dataVersionTypeId">The data version type of the freeze.</param>
        /// <param name="freezeDate">The date of the freeze.</param>
        /// <param name="comparisonDataVersionTypeId">The data version type of the comparison db.</param>
        /// <param name="comparisonDbDate">The date of the comparison db.</param>
        [HttpGet("checkFreezeForMultipleCompanies")]
        [ProducesResponseType(typeof(FreezeSearchForCompanyDto), StatusCodes.Status200OK)]
        [Authorize(Policies.CutOffPolicy)]
        public async Task<ActionResult<FreezeSearchForCompanyDto>> CheckFreezeForSelectedDatabase(
            string company,
            [FromQuery] string companyList,
            [FromQuery] DataVersionTypeDto? dataVersionTypeId,
            [FromQuery] DateTime? freezeDate,
            [FromQuery] DataVersionTypeDto? comparisonDataVersionTypeId,
            [FromQuery] DateTime? comparisonDbDate)
        {
            var freezeSearchResultForCompany = await _freezeQueries.CheckFreezeForSelectedDatabase(company, companyList.Split(',').ToArray(), dataVersionTypeId, freezeDate, comparisonDataVersionTypeId, comparisonDbDate);

            return Ok(freezeSearchResultForCompany);
        }

        /// <summary>
        /// Returns a freeze for a specified date.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// /// <param name="companyList">The selected company code.</param>
        /// <param name="freezeDate">The date of the freeze.</param>
        /// <param name="dataVersionTypeId">The data version type of the freeze.</param>
        [HttpGet("getFreezesForSelectedCompanies")]
        [ProducesResponseType(typeof(FreezeDto), StatusCodes.Status200OK)]
        [Authorize(Policies.CutOffPolicy)]
        public async Task<ActionResult<FreezeDto>> GetFreezeForSelectedCompany(
           string company,
           [FromQuery] string companyList,
           [FromQuery] DateTime freezeDate,
           [FromQuery] DataVersionTypeDto dataVersionTypeId)
        {
            companyList = companyList + ',' + company;
            var freeze = await _freezeQueries.GetFreezeForSelectedCompanyAsync(companyList, freezeDate, dataVersionTypeId);

            return Ok(freeze);
        }
    }
}