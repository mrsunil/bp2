using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Trading.Application.Commands.MergeSection;
using LDC.Atlas.Services.Trading.Application.Queries;
using LDC.Atlas.Services.Trading.Application.Queries.Dto;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Controllers
{
    [Route("api/v1/trading/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    public class SectionsMergeController : ControllerBase
    {
        private readonly ISectionMergeQueries _sectionMergeQueries;
        private readonly IMediator _mediator;

        public SectionsMergeController(IMediator mediator, ISectionMergeQueries sectionMergeQueries)
        {
            _sectionMergeQueries = sectionMergeQueries;
            _mediator = mediator;
        }

        /// <summary>
        /// Returns the enable/disable information for trade merge button
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="sectionId">The section identifier</param>
        /// <param name="dataVersionId">The data version id. Null for current one.</param>
        [HttpGet("contextualdataforcontractmerge/{sectionId:long}")]
        [ProducesResponseType(typeof(MergeAllowedForContractsDto),StatusCodes.Status200OK)]
        public async Task<ActionResult<MergeAllowedForContractsDto>> GetContextualDataForContractMerge(string company, long sectionId, [FromQuery] int? dataVersionId = null)
        {
            var mergeAllowedForContracts = await _sectionMergeQueries.GetContextualDataForContractMergeAsync(company,sectionId, dataVersionId);

            return Ok(mergeAllowedForContracts);
        }

        /// <summary>
        /// Returns the family of contract for trade merge.
        /// </summary>
        /// <param name="company">The company code</param>
        /// <param name="sectionId">The section identifier</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        /// <param name="dataVersionId">The data version id. Null for current one.</param>
        /// <returns>list of contracts for trade merge</returns>
        [HttpGet("getcontractfamilyformerge/{sectionId:long}")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<ContractFamilyForMergeDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<ContractFamilyForMergeDto>>> GetContractFamilyForMerge(string company, long sectionId, [FromQuery] PagingOptions pagingOptions, [FromQuery] int? dataVersionId = null)
        {
            var result = await _sectionMergeQueries.GetContractFamilyForMergeAsync(company, sectionId, dataVersionId);
            var response = new PaginatedCollectionViewModel<ContractFamilyForMergeDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, result.ToList());

            return Ok(response);
        }

        /// <summary>
        /// Returns the warning/blocking messages along with the list of section Ids
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="sectionIds">List of Section Ids selected for merge</param>
        /// <param name="dataVersionId">The data version id. Null for current one.</param>
        [HttpGet("contextualdataforselectedcontractmerge")]
        [ProducesResponseType(typeof(CollectionViewModel<TradeMergeMessageDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<TradeMergeMessageDto>>> GetContextualDataForSelectedContractMerge(string company, string sectionIds, [FromQuery] int? dataVersionId = null)
        {
            var tradeMergeMessages = await _sectionMergeQueries.GetContextualDataForSelectedContractMergeAsync(company, sectionIds.Split(',').Select(long.Parse).ToArray(), dataVersionId);
            var response = new CollectionViewModel<TradeMergeMessageDto>(tradeMergeMessages.ToList());
            return Ok(response);
        }

        /// <summary>
        /// merges the selected sections
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="request">The sections to merge.</param>
        [HttpPost("mergecontracts")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> MergeContracts(string company, [FromBody, Required] MergeSectionCommand request)
        {
            request.Company = company;
            var response = await _mediator.Send(request);

            return Ok(response);
        }
    }
}
