using LDC.Atlas.Document.Common.Dtos;
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
using Microsoft.Net.Http.Headers;
using System;
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
    public class InvoicesController : ControllerBase
    {
        private readonly IInvoiceQueries _invoiceQueries;
        private readonly IMediator _mediator;

        public InvoicesController(IInvoiceQueries invoiceQueries, IMediator mediator)
        {
            _invoiceQueries = invoiceQueries;
            _mediator = mediator;
        }

        /// <summary>
        /// Returns the list of unpaid invoices.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        /// <param name="searchCriteria">The search criteria.</param>
        [HttpGet("unpaid")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<UnpaidInvoiceDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<UnpaidInvoiceDto>>> GetUnpaidInvoices(
            string company,
            [FromQuery] PagingOptions pagingOptions,
            [FromQuery] string searchCriteria)
        {
            var invoices = await _invoiceQueries.GetUnpaidInvoicesAsync(searchCriteria, company, pagingOptions.Offset, pagingOptions.Limit);
            var response = new PaginatedCollectionViewModel<UnpaidInvoiceDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, invoices.ToList(), null);
            return Ok(response);
        }

        /// <summary>
        /// Returns an invoice by its identifier.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="invoiceId">The invoice identifier.</param>
        [HttpGet("{invoiceId:long}")]
        [ProducesResponseType(typeof(InvoiceDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<InvoiceDto>> GetInvoiceById(string company, [Range(1, long.MaxValue)] long invoiceId)
        {
            var result = await _invoiceQueries.GetInvoiceByIdAsync(company, invoiceId);
            if (result != null)
            {
                HttpContext.Response.Headers.Add(HeaderNames.LastModified, (result.ModifiedDateTime ?? result.CreatedDateTime).ToString("R", CultureInfo.InvariantCulture));
            }

            return Ok(result);
        }

        /// <summary>
        /// Searchs in the list of invoices.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="searchRequest">The search request.</param>
        [HttpPost("search")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<InvoiceDetailsDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<InvoiceDetailsDto>>> SearchInvoices(
            string company,
            EntitySearchRequest searchRequest)
        {
            var searchResult = await _invoiceQueries.SearchInvoicesAsync(company, searchRequest);

            var response = searchResult.ToPaginatedCollectionViewModel(searchRequest);

            return Ok(response);
        }

        /// <summary>
        /// Returns list of contracts to invoice.
        /// </summary>
        /// <param name="company">The company code</param>
        /// <param name="invoiceType">The invoice type.</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        [HttpGet("contractstoinvoicebyinvoicetype")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<ContractsToInvoiceDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<ContractsToInvoiceDto>>> ContractsToInvoiceByInvoiceType(string company, [FromQuery] int invoiceType, [FromQuery] PagingOptions pagingOptions)
        {
            var result = await _invoiceQueries.GetContractsToInvoiceAsync(company, invoiceType, pagingOptions.Offset.Value, pagingOptions.Limit.Value);
            var response = new PaginatedCollectionViewModel<ContractsToInvoiceDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, result.ToList(), null);

            return Ok(response);
        }

        /// <summary>
        /// Searchs in the list of contracts to invoice.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="searchRequest">The search request.</param>
        [HttpPost("contractstopurchaseinvoice/search")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<ContractsToInvoiceDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<ContractsToInvoiceDto>>> SearchContractsToPurchaseInvoice(string company, EntitySearchRequest searchRequest)
        {
            var searchResult = await _invoiceQueries.SearchContractToPurchaseInvoiceAsync(company, searchRequest);

            var response = searchResult.ToPaginatedCollectionViewModel(searchRequest);

            return Ok(response);
        }

        /// <summary>
        /// Searchs in the list of contracts to invoice.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="searchRequest">The search request.</param>
        [HttpPost("contractstosaleinvoice/search")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<ContractsToInvoiceDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<ContractsToInvoiceDto>>> SearchContractsToSaleInvoice(string company, EntitySearchRequest searchRequest)
        {
            var searchResult = await _invoiceQueries.SearchContractToSaleInvoiceAsync(company, searchRequest);

            var response = searchResult.ToPaginatedCollectionViewModel(searchRequest);

            return Ok(response);
        }

        /// <summary>
        /// Returns list of cost contracts to invoice
        /// </summary>
        /// <param name="company">The company code</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        [HttpGet("costcontractsbyinvoicetype")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<ContractsToCostInvoiceDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<ContractsToCostInvoiceDto>>> CostContractsByInvoiceType(string company, [FromQuery] PagingOptions pagingOptions)
        {
            var result = await _invoiceQueries.GetCostContractsToInvoiceAsync(company, pagingOptions.Offset.Value, pagingOptions.Limit.Value);
            var response = new PaginatedCollectionViewModel<ContractsToCostInvoiceDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, result.ToList(), null);

            return Ok(response);
        }

        /// <summary>
        /// Search in the list of contracts with some costs to invoice.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="searchRequest">The search request.</param>
        [HttpPost("costinvoice/search")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<ContractsToCostInvoiceDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<ContractsToCostInvoiceDto>>> SearchContractsForCostInvoice(
            string company,
            EntitySearchRequest searchRequest)
        {
            var searchResult = await _invoiceQueries.SearchContractsForCostInvoice(company, searchRequest);

            var response = searchResult.ToPaginatedCollectionViewModel(searchRequest);

            return Ok(response);
        }

        /// <summary>
        /// Returns the list of invoices for reversal.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        [HttpGet("invoicesforreversal")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<InvoicesForReversalDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<InvoicesForReversalDto>>> SearchInvoicesForReversal(string company, [FromQuery] PagingOptions pagingOptions)
        {
            var result = await _invoiceQueries.GetReversalContractsToInvoiceAsync(company, pagingOptions.Offset.Value, pagingOptions.Limit.Value);
            var response = new PaginatedCollectionViewModel<InvoicesForReversalDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, result.ToList(), null);

            return Ok(response);
        }

        /// <summary>
        /// Searchs in the list of invoices to be reversed
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="searchRequest">The search request.</param>
        [HttpPost("invoicereversal/search")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<ContractsToCostInvoiceDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<InvoicesForReversalDto>>> SearchContractsForReversalInvoice(
            string company,
            EntitySearchRequest searchRequest)
        {
            var searchResult = await _invoiceQueries.SearchReversalContractsToInvoiceAsync(company, searchRequest);

            var response = searchResult.ToPaginatedCollectionViewModel(searchRequest);

            return Ok(response);
        }

        /// <summary>
        /// Returns the invoice marking details of first invoice linked to a section.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="sectionId">The section identifier.</param>
        /// <param name="dataVersionId">The data version id. Null for current one.</param>
        [HttpGet("InvoiceMarkingDetails/{sectionId}")]
        [ProducesResponseType(typeof(InvoiceStatusDetailsDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<InvoiceStatusDetailsDto>> GetInvoiceDetailsAsync(string company, [Range(1, long.MaxValue)] long sectionId, [FromQuery] long? dataVersionId)
        {
            var invoiceInfos = await _invoiceQueries.GetInvoiceDetailsAsync(company, sectionId, dataVersionId);

            return Ok(invoiceInfos);
        }

        /// <summary>
        /// Returns the nvoice marking details of the section.
        /// </summary>
        /// <param name="company">The company code</param>
        /// <param name="sectionId">The section identifier.</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        /// <param name="dataVersionId">The data version id. Null for current one.</param>
        /// <param name = "childFlag">The Child flag to check which type of filter is set</param>
        [HttpGet("DetailsBySection/{sectionId}")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<InvoiceMarkingDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<InvoiceMarkingDto>>> GetInvoiceDetailsBySection(
            string company,
            long sectionId,
            [FromQuery] PagingOptions pagingOptions,
            [FromQuery] long? dataVersionId,
            [FromQuery] int childFlag)
        {
            IEnumerable<InvoiceMarkingDto> invoiceMarkings;
            invoiceMarkings = await _invoiceQueries.GetInvoiceDetailsBySectionAsync(sectionId, company, dataVersionId, childFlag);
            var response = new PaginatedCollectionViewModel<InvoiceMarkingDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, invoiceMarkings.ToList(), null);

            return Ok(response);
        }

        /// <summary>
        /// Returns the invoice marking for the costs of the section.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="sectionId">The section identifier.</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        /// <param name="dataVersionId">The data version id. Null for current one.</param>
        [HttpGet("InvoiceCostBySection/{sectionId}")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<InvoiceMarkingDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<InvoiceMarkingDto>>> GetInvoiceCostBySection(
            string company,
            long sectionId,
            [FromQuery] PagingOptions pagingOptions,
            [FromQuery] long? dataVersionId)
        {
            IEnumerable<InvoiceMarkingDto> invoiceMarkings;
            invoiceMarkings = await _invoiceQueries.GetInvoiceCostBySectionAsync(sectionId, company, dataVersionId);
            var response = new PaginatedCollectionViewModel<InvoiceMarkingDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, invoiceMarkings.ToList(), null);
            return Ok(response);
        }

        [HttpPatch]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult<InvoiceMarking>> UpdateInvoiceMarkingDetails(string company, [FromBody, Required] UpdateInvoiceMarkingCommand invoiceMarkingCommand)
        {
            invoiceMarkingCommand.Company = company;

            var command = await _mediator.Send(invoiceMarkingCommand);

            return NoContent();
        }

        /// <summary>
        /// Returns the invoice setup for a company.
        /// </summary>
        /// <param name="company">The company code.</param>
        [HttpGet("setup")]
        [ProducesResponseType(typeof(InvoiceSetupDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<InvoiceSetupDto>> InvoiceSetupByCompany(string company)
        {
            var result = await _invoiceQueries.GetInvoiceSetupByCompanyAsync(company);

            return Ok(result);
        }

        /// <summary>
        /// Returns the inerface setup for a company.
        /// </summary>
        /// <param name="company">The company code</param>
        /// <param name="interfaceTypeId">The type of interface.</param>
        [HttpGet("interfacesetup")]
        [ProducesResponseType(typeof(InterfaceSetupDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<InterfaceSetupDto>> InterfaceSetupByCompany(string company, long interfaceTypeId)
        {
            var result = await _invoiceQueries.GetInterfaceSetupByCompanyAsync(company, interfaceTypeId);

            return Ok(result);
        }

        [HttpGet("invoiceMarkingCost/{costId}")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<InvoiceMarkingDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<InvoiceMarkingDto>>> GetInvoiceMarkingsForCost(string company, long costId, [FromQuery] PagingOptions pagingOptions, [FromQuery] long? dataVersionId)
        {
            IEnumerable<InvoiceMarkingDto> invoiceMarkingsCost;
            invoiceMarkingsCost = await _invoiceQueries.GetInvoiceMarkingsForCost(company, costId, dataVersionId);

            var response = new PaginatedCollectionViewModel<InvoiceMarkingDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, invoiceMarkingsCost.ToList(), null);

            return Ok(response);
        }

        [HttpPost("insertInvoiceMarkingCost")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult<InvoiceMarking>> UpdateInvoiceMarkingCostDetails(string company, [FromBody, Required] UpdateInvoiceMarkingCommand invoiceMarkingCommand)
        {
            invoiceMarkingCommand.Company = company;

            await _mediator.Send(invoiceMarkingCommand);

            return NoContent();
        }

        [HttpPost("updatepostingstatus")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.UpdatePostingStatusPolicy)]
        public async Task<IActionResult> UpdateInvoiceMarkingPostingStatus(string company, [FromBody, Required] UpdateInvoiceMarkingPostingStatusCommand invoiceMarkingCommand)
        {
            invoiceMarkingCommand.Company = company;

            var command = await _mediator.Send(invoiceMarkingCommand);

            return NoContent();
        }

        [HttpDelete("deleteInvoiceMarking/{invoiceMarkingId}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.DeleteInvoiceMarkingPolicy)]
        public async Task<IActionResult> DeleteCost(string company, long invoiceMarkingId)
        {
            var command = new DeleteInvoiceMarkingCommand
            {
                Company = company,
                InvoiceMarkingId = invoiceMarkingId
            };

            await _mediator.Send(command);

            return NoContent();
        }

        /// <summary>
        /// Returns the contracts to invoice.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="type">The type of contract.</param>
        /// <param name="filterParameter">The filter parameter.</param>
        /// <param name="periodFromDate">The period from.</param>
        /// <param name="periodToDate">The period to.</param>
        [HttpGet("contractstoinvoice")]
        [ProducesResponseType(typeof(CollectionViewModel<ContractToBeInvoicedSearchResultDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<ContractToBeInvoicedSearchResultDto>>> FindContractsToInvoice(string company, [FromQuery] int type, [FromQuery] string filterParameter, [FromQuery] DateTime? periodFromDate, [FromQuery] DateTime? periodToDate)
        {
            InvoiceSearchDto invoiceSearch = new InvoiceSearchDto
            {
                Type = type,
                FilterParameter = filterParameter,
                PeriodFrom = periodFromDate,
                PeriodTo = periodToDate
            };

            var result = await _invoiceQueries.FindContractToInvoiceByReferenceAsync(invoiceSearch, company);

            var response = new CollectionViewModel<ContractToBeInvoicedSearchResultDto>(result.ToList());

            return Ok(response);
        }

        /// <summary>
        /// Returns the costs to invoice.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="costType">Type of the cost.</param>
        /// <param name="supplierCode">The supplier code.</param>
        /// <param name="charter">The charter.</param>
        /// <param name="contractRef">The contract reference.</param>
        [Route("coststoInvoice")]
        [ProducesResponseType(typeof(CollectionViewModel<CostToBeInvoicedSearchResultDto>), StatusCodes.Status200OK)]
        [HttpGet]
        public async Task<ActionResult<CollectionViewModel<CostToBeInvoicedSearchResultDto>>> FindCosts(string company, [FromQuery] string costType, [FromQuery] string supplierCode, [FromQuery] string charter, [FromQuery] string contractRef)
        {
            var result = await _invoiceQueries.FindCostsToInvoiceAsync(costType, supplierCode, charter, contractRef, company);

            var response = new CollectionViewModel<CostToBeInvoicedSearchResultDto>(result.ToList());

            return Ok(response);
        }

        /// <summary>
        /// Returns the contracts to invoice by section identifier.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="sectionId">The section identifier.</param>
        /// <param name="type">The type of contract.</param>
        [HttpGet("contractstoinvoice/{sectionId}")]
        [ProducesResponseType(typeof(CollectionViewModel<ContractToBeInvoicedSearchResultDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<CollectionViewModel<ContractToBeInvoicedSearchResultDto>>> GetContractsToInvoiceBySectionId(string company, long sectionId, [FromQuery] int type)
        {
            IEnumerable<ContractToBeInvoicedSearchResultDto> result = null;

            if (type == 0)
            {
                result = await _invoiceQueries.GetPurchaseContractToInvoiceBySectionIdAsync(sectionId, company);
            }
            else if (type == 1)
            {
                result = await _invoiceQueries.GetSaleContractToInvoiceBySectionIdAsync(sectionId, company);
            }
            else
            {
                return BadRequest("Invalid goods type invoice requested");
            }

            var response = new CollectionViewModel<ContractToBeInvoicedSearchResultDto>(result.ToList());

            return Ok(response);
        }

        /// <summary>
        /// Creates a new invoice.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="invoice">The invoice to create.</param>
        [HttpPost]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(InvoiceRecord), StatusCodes.Status200OK)]
        public async Task<IActionResult> CreateInvoice(string company, [FromBody, Required] CreateInvoiceCommand invoice)
        {
            invoice.CompanyId = company;

            var commandResult = await _mediator.Send(invoice);

            return Ok(commandResult);
        }

        /// <summary>
        /// Returns list of washout contracts to invoice.
        /// </summary>
        /// <param name="company">The company code</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        [HttpGet("getwashoutcontracts")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<ContractsToWashoutInvoiceDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<ContractsToWashoutInvoiceDto>>> GetWashoutContracts(string company, [FromQuery] PagingOptions pagingOptions)
        {
            var result = await _invoiceQueries.GetWashoutContractsToInvoiceAsync(company, pagingOptions.Offset.Value, pagingOptions.Limit.Value);

            var response = new PaginatedCollectionViewModel<ContractsToWashoutInvoiceDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, result.ToList(), null);

            return Ok(response);
        }

        /// <summary>
        /// Returns list of contracts to invoice.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="searchRequest">The search request.</param>
        [HttpPost("washoutcontracts/search")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<ContractsToWashoutInvoiceDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<ContractsToWashoutInvoiceDto>>> SearchWashoutContracts(string company, EntitySearchRequest searchRequest)
        {
            var searchResult = await _invoiceQueries.SearchWashoutContractsToInvoiceAsync(company, searchRequest);

            var response = searchResult.ToPaginatedCollectionViewModel(searchRequest);

            return Ok(response);
        }

        /// <summary>
        /// Returns the list of costs for given contracts.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="sectionIds">The list of section identifiers.</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        [HttpGet("costsbysectionids")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<ContractsToCostInvoiceDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<ContractsToCostInvoiceDto>>> GetCostsForSelectedContracts(string company, [FromQuery] string sectionIds, [FromQuery] PagingOptions pagingOptions)
        {
            var result = await _invoiceQueries.GetCostsForSelectedContractsAsync(company, sectionIds.Split(',').Select(int.Parse).ToArray());

            var response = new PaginatedCollectionViewModel<ContractsToCostInvoiceDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, result.ToList(), null);

            return Ok(response);
        }

        /// <summary>
        /// Returns the list of allocated contracts along with selected section identifiers for Washout Invoice.
        /// </summary>
        /// <param name="selectedSectionIds">The list of section identifiers.</param>
        /// <param name="company">The company code</param>
        [HttpGet("allocatedwashoutsbySectionids")]
        [ProducesResponseType(typeof(CollectionViewModel<ContractsToWashoutInvoiceDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<ContractsToWashoutInvoiceDto>>> GetAllocatedContractsToInvoiceBySectionIds([FromQuery] string selectedSectionIds, string company)
        {
            var result = await _invoiceQueries.GetAllocatedContractsForSelectedSectionIdsAsync(selectedSectionIds.Split(',').Select(int.Parse).ToArray(), company);

            var response = new CollectionViewModel<ContractsToWashoutInvoiceDto>(result.ToList());

            return Ok(response);
        }

        /// <summary>
        /// Checks if a external invoice reference exists.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="externalInvoiceRef">The external invoice reference.</param>
        [HttpHead("{externalInvoiceRef}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> CheckExternalInvoiceReferenceExists(string company, string externalInvoiceRef)
        {
            var referenceExists = await _invoiceQueries.CheckExternalInvoiceReferenceExistsAsync(company, externalInvoiceRef);

            if (!referenceExists)
            {
                return NoContent();
            }

            return Ok();
        }

        [HttpPost("createtransactiondocument")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(TransactionCreationResponse), StatusCodes.Status200OK)]
        //[Authorize(Policies.CreateTransactionDocumentPolicy)]
        public async Task<IActionResult> CreateTransactionDocument(string company, [FromBody, Required] CreateTransactionDocumentCommand request)
        {
            request.Company = company;

            var result = await _mediator.Send(request);

            return Ok(result);
        }

        [HttpPost("{invoiceId:long}/documents/update")]
        [ProducesResponseType(typeof(PhysicalDocumentReferenceDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<PhysicalDocumentReferenceDto>> UpdateInvoiceDocument(string company, long invoiceId, [FromBody, Required] UpdateInvoiceDocumentCommand request)
        {
            request.Company = company;
            request.InvoiceId = invoiceId;

            var result = await _mediator.Send(request);

            return Ok(result);
        }

        /// <summary>
        /// Trade Configuration for Business Sector.
        /// </summary>
        /// <param name="company">The company code</param>
        [HttpGet("businesssectorconfiguration")]
        [ProducesResponseType(typeof(BusinessSectorDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<BusinessSectorDto>> GetBusinessSectorForPosting(string company)
        {
            var result = await _invoiceQueries.GetBusinessSectorForPosting(company);

            return result;
        }

        /// <summary>
        /// Update InvoicePercent in invoice marking line.
        /// </summary>
        [HttpPost("invoicemarkinglines")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> UpdateInvoiceMarkingPercent(string company, UpdateInvoiceMarkingPercentLinesCommand invoiceMarkingPercentLinesCommand, long? dataVersionId)
        {
            invoiceMarkingPercentLinesCommand.Company = company;
            invoiceMarkingPercentLinesCommand.DataVersionId = dataVersionId;
            var response = await _mediator.Send(invoiceMarkingPercentLinesCommand);
            return Ok(response);
        }
    }
}
