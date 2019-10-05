using LDC.Atlas.Application.Core.Services;
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
using System.Collections.Generic;
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
    public class ManualDocumentMatchingController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IIdentityService _identityService;
        private readonly IManualDocumentMatchingQueries _documentMatchingQueries;

        public ManualDocumentMatchingController(IMediator mediator, IIdentityService identityService, IManualDocumentMatchingQueries documentMatchingQueries)
        {
            _mediator = mediator;
            _documentMatchingQueries = documentMatchingQueries;
            _identityService = identityService;
        }

        /// <summary>
        /// Returns the list of documents for document matching.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="counterpartyId">The counterparty identifier.</param>
        /// <param name="department">The department of the documents.</param>
        /// <param name="currency">The currency of the documents.</param>
        /// <param name="bitEdit">Boolean value to check if edit or create.</param>
        /// <param name="matchFlagId">The matchflag identifier.</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        [HttpGet("getdocumentsformatching")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<DocumentMatchingDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<DocumentMatchingDto>>> DocumentsToMatch(
            string company,
            [FromQuery] long counterpartyId,
            [FromQuery] string department,
            [FromQuery] string currency,
            bool bitEdit,
            long? matchFlagId,
            [FromQuery] PagingOptions pagingOptions)
        {
            var result = await _documentMatchingQueries.GetDocumentToMatchAsync(company, counterpartyId, department, currency, bitEdit, matchFlagId, pagingOptions.Offset.Value, pagingOptions.Limit.Value);
            var response = new PaginatedCollectionViewModel<DocumentMatchingDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, result.ToList(), null);

            return Ok(response);
        }

        /// <summary>
        /// Returns the list of document reference.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="matchType">The type of transaction.</param>
        [HttpGet("getdocumentreferencelist")]
        [ProducesResponseType(typeof(CollectionViewModel<DocumentMatchingDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<DocumentMatchingDto>>> Get(string company, int matchType)
        {
            IEnumerable<DocumentMatchingDto> documentReference = await _documentMatchingQueries.GetDocumentReferenceAsync(company, matchType);

            var response = new CollectionViewModel<DocumentMatchingDto>(documentReference.ToList());

            return Ok(response);
        }

        /// <summary>
        /// Returns list of the documents based on document reference.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="docReference">the document reference code</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        [HttpGet("getdocumentbydocumentreference")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<DocumentMatchingDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<DocumentMatchingDto>>> GetDocumentByDocumentReference(string company, [FromQuery, Required] string docReference, [FromQuery] PagingOptions pagingOptions)
        {
            var result = await _documentMatchingQueries.GetDocumentByDocumentReference(company, docReference, pagingOptions.Offset.Value, pagingOptions.Limit.Value);

            var response = new PaginatedCollectionViewModel<DocumentMatchingDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, result.ToList(), null);

            return Ok(response);
        }

        /// <summary>
        /// Returns the list of documents for unmatching documents.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="counterpartyId">The counterparty identifier.</param>
        /// <param name="department">The department of the documents.</param>
        /// <param name="currency">The currency of the documents.</param>
        /// <param name="documentReference">Document reference</param>
        /// <param name="matchFlagCode">Match Flag Code</param>
        /// <param name="pagingOptions">Paging Options</param>
        [HttpGet("getdocumentsforunmatch")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<MatchedDocumentInfo_ForUnmatchDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<MatchedDocumentInfo_ForUnmatchDto>>> DocumentsToUnmatch(
            string company,
            [FromQuery] long counterpartyId,
            [FromQuery] string department,
            [FromQuery] string currency,
            [FromQuery] string documentReference,
            [FromQuery] string matchFlagCode,
            [FromQuery] PagingOptions pagingOptions)
        {
            var result = await _documentMatchingQueries.GetDocumentToUnMatchAsync(company, counterpartyId, department, currency, documentReference, matchFlagCode, pagingOptions.Offset.Value, pagingOptions.Limit.Value);
            var response = new PaginatedCollectionViewModel<MatchedDocumentInfo_ForUnmatchDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, result.ToList(), null);
            return Ok(response);
        }

        /// <summary>
        /// Returns the list of match flag for unmatch.
        /// </summary>
        /// <param name="company">The company code.</param>
        [HttpGet("getmatchflaglist")]
        [ProducesResponseType(typeof(CollectionViewModel<DocumentMatchingDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<DocumentMatchingDto>>> GetMatchFlag(string company)
        {
            IEnumerable<DocumentMatchingDto> matchFlag = await _documentMatchingQueries.GetMatchFlagAsync(company);

            var response = new CollectionViewModel<DocumentMatchingDto>(matchFlag.ToList());

            return Ok(response);
        }

        /// <summary>
        /// Returns the documents based on match flag for unmatch.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="matchFlagCode">The match flag code.</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        [HttpGet("getdocumentbymatchflag")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<DocumentMatchingDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<DocumentMatchingDto>>> GetDocumentByMatchFlag(string company, [FromQuery] string matchFlagCode, [FromQuery] PagingOptions pagingOptions)
        {
            var result = await _documentMatchingQueries.GetDocumentByMatchFlag(company, matchFlagCode, pagingOptions.Offset.Value, pagingOptions.Limit.Value);

            var response = new PaginatedCollectionViewModel<DocumentMatchingDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, result.ToList(), null);

            return Ok(response);
        }

        /// <summary>
        /// Returns the documents based on document reference for unmatch.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="docReference">The document reference code.</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        [HttpGet("getdocumenttounmatchbydocumentreference")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<DocumentMatchingDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<DocumentMatchingDto>>> GetDocumentToUnmatchByDocumentReference(string company, [FromQuery] string docReference, [FromQuery] PagingOptions pagingOptions)
        {
            var result = await _documentMatchingQueries.GetDocumentToUnmatchByDocumentReference(company, docReference, pagingOptions.Offset.Value, pagingOptions.Limit.Value);

            var response = new PaginatedCollectionViewModel<DocumentMatchingDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, result.ToList(), null);

            return Ok(response);
        }

        /// <summary>
        /// Creates Manual Document Matching.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="document">The documents to create manual matching.</param>
        [HttpPost("creatematch")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(ManualDocumentMatchingRecord), StatusCodes.Status200OK)]
        [Authorize(Policies.CreateDeleteMatchFlagPolicy)]
        public async Task<IActionResult> CreateManualDocumentMatching(string company, [FromBody] CreateManualDocumentMatchingCommand document)
        {
            document.Company = company;

            var response = await _mediator.Send(document);

            return Ok(response);
        }

        /// <summary>
        /// Unmatches Manual Document Matching.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="documents">documents to unmatch manual matching.</param>
        [HttpPost("deletematch")]
        [Consumes(MediaTypeNames.Application.Json)]
        [Authorize(Policies.CreateDeleteMatchFlagPolicy)]
        public async Task<IActionResult> UnmatchManualDocumentMatching(string company, [FromBody] UnmatchManualDocumentMatchingCommand documents)
        {
            documents.Company = company;

            var response = await _mediator.Send(documents);

            return Ok(response);
        }

        [HttpPatch("{matchFlagId:long}")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> UpdateDocumentMatching(string company, [Range(1, long.MaxValue)] long matchFlagId, [FromBody, Required] UpdateDocumentMatchingCommand manualDocumentMatching)
        {
            manualDocumentMatching.Company = company;
            manualDocumentMatching.MatchFlagId = matchFlagId;

            await _mediator.Send(manualDocumentMatching);

            return NoContent();
        }
    }
}
