using LDC.Atlas.Application.Common.Configuration;
using LDC.Atlas.Document.Common.Dtos;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Execution.Application.Commands;
using LDC.Atlas.Services.Execution.Application.Queries;
using LDC.Atlas.Services.Execution.Application.Queries.Dto;
using LDC.Atlas.Services.Execution.Entities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Net.Http.Headers;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
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
    public class CashController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ICashQueries _cashQueries;
        private readonly IGridService _gridQueries;

        public CashController(IMediator mediator, ICashQueries cashQueries)
        {
            _mediator = mediator;
            _cashQueries = cashQueries;
        }

        /// <summary>
        /// Returns the list of cash payments/receipts.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="costDirectionId">The cost direction reference for cash type (Payment or Receipt.)</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        [HttpGet]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<CashSummaryDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<CashSummaryDto>>> GetCashList(
            string company, [FromQuery] int costDirectionId, [FromQuery] PagingOptions pagingOptions)
        {
            var cashList = await _cashQueries.GetCashListAsync(company, costDirectionId, pagingOptions.Offset, pagingOptions.Limit);

            var response = new PaginatedCollectionViewModel<CashSummaryDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, cashList.ToList(), null);
            return Ok(response);
        }

        /// <summary>
        /// Creates a new cash.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="request">The cash to add.</param>
        [HttpPost]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(Cash), StatusCodes.Status200OK)]
        public async Task<IActionResult> CreateCash(string company, [FromBody, Required] CreateCashCommand request)
        {
            request.CompanyId = company;
            var result = await _mediator.Send(request);

            return Ok(result);
        }

        /// <summary>
        /// Getting default values for cash payment and receipt
        /// </summary>
        /// <param name="company"> The company code</param>
        [HttpGet("cashsetup")]
        [ProducesResponseType(typeof(CashSetupDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<CashSetupDto>> GetCashSetupDetails(string company)
        {
            var cashSetupInfo = await _cashQueries.GetCashSetupInfoAsync(company);
            return Ok(cashSetupInfo);
        }

        /// <summary>
        /// Returns a cash by its identifier.
        /// </summary>
        /// <param name="cashId">The cash identifier</param>
        /// <param name="company">The company code.</param>
        [HttpGet("{cashId:long}")]
        [ProducesResponseType(typeof(CashDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<CashDto>> GetCashById([Range(1, long.MaxValue)] long cashId, string company)
        {
            var cash = await _cashQueries.GetCashByIdAsync(company, cashId);

            if (cash != null)
            {
                HttpContext.Response.Headers.Add(HeaderNames.LastModified, (cash.ModifiedDateTime ?? cash.CreatedDateTime).ToString("R", CultureInfo.InvariantCulture));
            }

            return Ok(cash);
        }

        /// <summary>
        /// Updates an existing cash.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="cashId">The identifier of the cash to update.</param>
        /// <param name="cash">The cash to update.</param>
        /// <response code="204">Cash updated</response>
        [HttpPatch("{cashId:long}")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> UpdateCash(string company, [Range(1, long.MaxValue)] long cashId, [FromBody, Required] UpdateCashCommand cash)
        {
            cash.CompanyId = company;
            cash.CashId = cashId;

            await _mediator.Send(cash);

            return NoContent();
        }

        /// <summary>
        /// Getting the list of invoices based on counterparty department and currency entered.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="counterpartyId">The counterparty identifier</param>
        /// <param name="department"> the department identifier</param>
        /// <param name="currency">the currency identifier</param>
        /// <param name="isEdit">the action identifier whether it is creat/edit</param>
        /// <param name="matchFlagId">matchflad identifier</param>
        /// <param name="documentReference">The document reference.</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        [HttpGet("getinvoiceforcashmatching")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<CashMatchingDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<CashMatchingDto>>> InvoiceToMatch(string company, [FromQuery] long counterpartyId,
            [FromQuery] string department, [FromQuery] string currency, bool isEdit, long? matchFlagId,
            string documentReference,
            [FromQuery] PagingOptions pagingOptions)
        {
            var result = await _cashQueries.ListMatchableDocumentsForCashByPickingAsync(company, counterpartyId, department, currency, isEdit, matchFlagId, pagingOptions.Offset.Value, pagingOptions.Limit.Value, documentReference);
            var response = new PaginatedCollectionViewModel<CashMatchingDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, result.ToList(), null);
            return Ok(response);
        }

        /// <summary>
        /// Getting the list of invoices based on document reference
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="docReference">the document reference code</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        [HttpGet("getinvoicebydocumentreference")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<CashMatchingDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<CashMatchingDto>>> GetInvoiceByDocumentReference(string company, [FromQuery] string docReference, [FromQuery] PagingOptions pagingOptions)
        {
            var result = await _cashQueries.GetDocumentDetailsByDocumentReference(company, docReference, pagingOptions.Offset.Value, pagingOptions.Limit.Value);
            var response = new PaginatedCollectionViewModel<CashMatchingDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, result.ToList(), null);
            return Ok(response);
        }

        /// <summary>
        /// Listing the document reference
        /// </summary>
        /// <param name="company">The company code.</param>
        [HttpGet("getdocumentreferencelist")]
        [ProducesResponseType(typeof(CollectionViewModel<DocumentReferenceSearchDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<DocumentReferenceSearchDto>>> Get(string company)
        {
            IEnumerable<DocumentReferenceSearchDto> documentReference = await _cashQueries.ListMatchableDocumentReferencesAsync(company);
            var response = new CollectionViewModel<DocumentReferenceSearchDto>(documentReference.ToList());

            return Ok(response);
        }

        [HttpDelete("{cashId:long}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> DeleteCash(string company, [Range(1, long.MaxValue)] long cashId)
        {
            var command = new DeleteCashCommand
            {
                Company = company,
                CashId = cashId,
            };

            await _mediator.Send(command);

            return NoContent();
        }

        /// <summary>
        /// Get the FX rate based on currency from and currency to
        /// </summary>
        /// <param name="currencyCodeFrom">The currency of cash</param>
        /// <param name="currencyCodeTo">The matching currency</param>
        [HttpGet("getfxrateforcash")]
        [ProducesResponseType(typeof(CashMatchingDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAsync([FromQuery] string currencyCodeFrom, [FromQuery] string currencyCodeTo)
        {
            var fxRates = await _cashQueries.GetFxRateForCash(currencyCodeFrom, currencyCodeTo);
            return Ok(fxRates);
        }

        [HttpPost("{cashId:long}/documents/update")]
        [ProducesResponseType(typeof(PhysicalDocumentReferenceDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<PhysicalDocumentReferenceDto>> UpdateCashDocument(string company, [Range(1, long.MaxValue)] long cashId, [FromBody, Required] UpdateCashDocumentCommand request)
        {
            request.Company = company;
            request.CashId = cashId;

            var documentId = await _mediator.Send(request);

            return Ok(documentId);
        }

        /// <summary>
        /// Search in the list of cash payment.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="searchRequest">The search request.</param>
        [HttpPost("search")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<CashDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<CashDto>>> SearchCashList(
            string company,
            EntitySearchRequest searchRequest)
        {

            var searchResult = await _cashQueries.SearchCashPaymentListAsync(company, searchRequest);

            var response = searchResult.ToPaginatedCollectionViewModel(searchRequest);

            return Ok(response);

        }



        /// <summary>
        /// Search in the list of cash receipt.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="searchRequest">The search request.</param>
        [HttpPost("searchReceipt")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<CashDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<CashDto>>> SearchCashReceiptList(
            string company,
            EntitySearchRequest searchRequest)
        {
            var searchResult = await _cashQueries.SearchCashReceiptListAsync(company, searchRequest);

            var response = searchResult.ToPaginatedCollectionViewModel(searchRequest);

            return Ok(response);
          
        }
    }
}