using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Execution.Application.Commands;
using LDC.Atlas.Services.Execution.Application.Queries;
using LDC.Atlas.Services.Execution.Application.Queries.Dto;
using LDC.Atlas.Services.Execution.Entities;
using LDC.Atlas.Services.Execution.Infrastructure.Policies;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Controllers
{
    [Route("api/v1/execution/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class AllocationController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ITradeAllocationQueries _tradeAllocationQueries;

        public AllocationController(IMediator mediator, ITradeAllocationQueries tradeAllocationQueries)
        {
            _mediator = mediator;
            _tradeAllocationQueries = tradeAllocationQueries;
        }

        /// <summary>
        /// Finds the contract to allocate.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="originalsectionId">The original section identifier.</param>
        /// <param name="sectionLabelKeyword">The section label to search for.</param>
        /// <param name="pricingMethod">The pricing method.</param>
        [HttpGet("contractstoallocate")]
        [ProducesResponseType(typeof(CollectionViewModel<SectionToAllocate>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<SectionToAllocate>>> FindContractToAllocate(string company, [FromQuery] long originalsectionId, [FromQuery] string sectionLabelKeyword, [FromQuery] int pricingMethod)
        {
            var result = await _tradeAllocationQueries.FindContractToAllocateByContractReferenceAsync(originalsectionId, sectionLabelKeyword, pricingMethod, company);

            var response = new CollectionViewModel<SectionToAllocate>(result.ToList());

            return Ok(response);
        }

        /// <summary>
        /// Get Allocated Details
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="sectionId">The section identifier.</param>
        /// <param name="dataVersionId">The data version id. Null for current one.</param>
        [HttpGet("allocationbysection/{sectionId}")]
        [ProducesResponseType(typeof(AllocationInfoDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllocationBySectionId(string company, long sectionId, [FromQuery] long? dataVersionId = null)
        {
            var allocationInfos = await _tradeAllocationQueries.GetAllocationInfoAsync(sectionId, company, dataVersionId);

            return Ok(allocationInfos);
        }

        /// <summary>
        /// Getting the section traffic information
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="sectionId">The section identifier.</param>
        /// <param name="dataVersionId">The data version id. Null for current one.</param>
        [HttpGet("sectiontraffic/{sectionId}")]
        [ProducesResponseType(typeof(SectionTrafficDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetSectionTrafficDetails(string company, long sectionId, [FromQuery] long? dataVersionId = null)
        {
            var sectionTraffic = await _tradeAllocationQueries.GetSectionTrafficBySectionIdAsync(sectionId, company, dataVersionId);

            return Ok(sectionTraffic);
        }

        /// <summary>
        /// Allocates the specified section.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="request">The allocation request.</param>
        [HttpPost("allocate")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Authorize(Policies.AllocateTradePhysicalPolicy)]
        public async Task<IActionResult> Allocate(string company, [FromBody, Required] AllocateSectionCommand request)
        {
            request.Company = company;

            var response = await _mediator.Send(request);

            return Ok(response);
        }

        [HttpPost("deallocate")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.AllocateTradePhysicalPolicy)]
        public async Task<IActionResult> DeallocateTrade(string company, [FromBody, Required] DeallocateSectionCommand request)
        {
            request.Company = company;

            await _mediator.Send(request);

            return NoContent();
        }

        [HttpPost("bulkdeallocate")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.AllocateTradePhysicalPolicy)]
        public async Task<IActionResult> BulkDeallocateTrade(string company, [FromBody, Required] BulkDeallocateSectionCommand request)
        {
            request.Company = company;

            await _mediator.Send(request);

            return NoContent();
        }

        /// <summary>
        /// Returns the allocation warning messages.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="sectionId">The section identifier</param>
        /// <param name="allocatedSectionId">The allocated section indentifier.</param>
        [HttpGet("getwarningmessages/{sectionId}/{allocatedSectionId}")]
        [ProducesResponseType(typeof(CollectionViewModel<AllocationMessageDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<AllocationMessageDto>>> GetWarningMessageAsync(string company,  long sectionId,  long allocatedSectionId)
        {
            var result = await _tradeAllocationQueries.GetAllocationMessages(sectionId, allocatedSectionId, company);

            var response = new CollectionViewModel<AllocationMessageDto>(result.ToList());

            return Ok(response);
        }

        /// <summary>
        /// Add Multiple Section in Allocation
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="request"></param>
        [HttpPost("allocateSectionList")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Authorize(Policies.AllocateTradePhysicalPolicy)]
        public async Task<IActionResult> AllocateSectionListAsync(string company, [FromBody, Required] AllocateSectionListCommand request)
        {
            request.Company = company;

            await _mediator.Send(request);

            return Ok();
        }

        /// <summary>
        /// Add Multiple Image Section in Allocation
        /// </summary>
        /// <param name="company"The company code.></param>
        /// <param name="request"></param>
        [HttpPost("imageAllocateSectionList")]
        [Authorize(Policies.AllocateTradePhysicalPolicy)]
        public async Task<IActionResult> AllocateImageSectionListAsync(string company, [FromBody, Required] AllocateSectionListCommand request)
        {
            request.Company = company;
            request.IsImageAllocation = true;

            var response = await _mediator.Send(request);

            return Ok(response);
        }

        /// <summary>
        /// to get the poissible allocation for charter
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="charterId">The charter identifier.</param>
        [HttpGet("getPossibleAllocation/{charterId}")]
        [ProducesResponseType(typeof(CollectionViewModel<AllocationSummaryDto>), StatusCodes.Status200OK)]
        [Authorize(Policies.CharterPolicy)]
        public async Task<ActionResult<CollectionViewModel<AllocationSummaryDto>>> GetPossibleAllocationByCharterAsync(string company, int charterId)
        {
            var sections = await _tradeAllocationQueries.GetPossibleAllocationByCharterAsync(charterId, company);

            var response = new CollectionViewModel<AllocationSummaryDto>(sections.ToList());

            return Ok(response);
        }

        /// <summary>
        /// Returns the possible deallocated records.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="charterId">The charter identitifer.</param>
        [HttpGet("getPossiblDeallocation/{charterId}")]
        [ProducesResponseType(typeof(CollectionViewModel<AllocationSummaryDto>), StatusCodes.Status200OK)]
        [Authorize(Policies.CharterPolicy)]
        public async Task<ActionResult<CollectionViewModel<AllocationSummaryDto>>> GetPossibleDeallocationByCharterAsync(string company, int charterId)
        {
            var sections = await _tradeAllocationQueries.GetPossibleDeallocationByCharterAsync(charterId, company);

            var response = new CollectionViewModel<AllocationSummaryDto>(sections.ToList());

            return Ok(response);
        }
    }
}
