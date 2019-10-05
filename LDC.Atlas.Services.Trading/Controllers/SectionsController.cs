using LDC.Atlas.Document.Common.Dtos;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.ListAndSearch.Common;
using LDC.Atlas.Services.Trading.Application.Commands;
using LDC.Atlas.Services.Trading.Application.Queries;
using LDC.Atlas.Services.Trading.Application.Queries.Dto;
using LDC.Atlas.Services.Trading.Entities;
using LDC.Atlas.Services.Trading.Infrastructure.Policies;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
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
    public class SectionsController : ControllerBase
    {
        private const bool CopyAsFavoriteFlag = true;
        private readonly IMediator _mediator;
        private readonly ISectionQueries _sectionQueries;
        private readonly ITradingListAndSearch _tradingListAndSearch;

        public SectionsController(IMediator mediator, ISectionQueries sectionQueries, ITradingListAndSearch tradingListAndSearch)
        {
            _mediator = mediator;
            _sectionQueries = sectionQueries;
            _tradingListAndSearch = tradingListAndSearch;
        }

        /// <summary>
        /// Returns the list of sections.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        /// <param name="physicalContractId">The contractRef identifier</param>
        [HttpGet]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<SectionSearchResultDto>), StatusCodes.Status200OK)]
        [Authorize(Policies.ReadTradePhysicalPolicy)]
        public async Task<ActionResult<PaginatedCollectionViewModel<SectionSearchResultDto>>> GetSections(
            string company,
            [FromQuery] PagingOptions pagingOptions,
            [FromQuery] long? physicalContractId)
        {
            IEnumerable<SectionSearchResultDto> sections = await _sectionQueries.GetSectionsAsync(company, physicalContractId, pagingOptions.Offset, pagingOptions.Limit);

            var response = new PaginatedCollectionViewModel<SectionSearchResultDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, sections.ToList(), null);

            return Ok(response);
        }

        /// <summary>
        /// Returns the Overview as well as Details list of Generate End of Month for a Trade Contracts and Costs.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="reportType">The report type.</param>
        /// <param name="tabType">Type</param>
        /// <param name="dataVersionId">The data version id. Null for current one.</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        [HttpGet("summary")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<TradeCostGenerateMonthEndDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<TradeCostGenerateMonthEndDto>>> GetTradeCostGenerateMonthEnd(string company, [FromQuery] int reportType, [FromQuery] short tabType, [FromQuery] int dataVersionId, [FromQuery] PagingOptions pagingOptions)
        {
            IEnumerable<TradeCostGenerateMonthEndDto> sections = await _sectionQueries.GetTradeCostGenerateMonthEndAsync(company, reportType, tabType, dataVersionId, pagingOptions.Offset, pagingOptions.Limit);

            var response = new PaginatedCollectionViewModel<TradeCostGenerateMonthEndDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, sections.ToList(), null);

            return Ok(response);
        }

        /// <summary>
        /// Search in the list of sections.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="searchRequest">The search request.</param>
        [HttpPost("search")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<SectionSearchResultDto>), StatusCodes.Status200OK)]
        [Authorize(Policies.ReadTradePhysicalPolicy)]
        public async Task<ActionResult<PaginatedCollectionViewModel<SectionSearchResultDto>>> SearchPhysicalContracts(
            string company,
            EntitySearchRequest searchRequest)
        {
            var searchResult = await _tradingListAndSearch.SearchSectionsAsync(company, searchRequest);

            var response = searchResult.ToPaginatedCollectionViewModel(searchRequest);

            return Ok(response);
        }

        /// <summary>
        /// Search in the list of sections. Export the result to a file.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="searchRequest">The search request.</param>
        /// <param name="format">The format of the export.</param>
        [HttpPost("search/export")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Authorize(Policies.ReadTradePhysicalPolicy)]
        public async Task<IActionResult> SearchPhysicalContractsExport(
            string company,
            EntitySearchRequest searchRequest,
            [FromQuery] string format = ListAndSearchExportFormat.Excel)
        {
            var stream = await _tradingListAndSearch.ExportSearchSectionsToStreamAsync(company, searchRequest, format);

            return File(stream, ExportToExcelHelper.XlsxMimeType, _tradingListAndSearch.GetExportFileName(company));
        }

        /// <summary>
        /// Get List of Trades for TradeReport.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="searchRequest">The search request.</param>
        [HttpPost("getTradeReportData")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<SectionSearchResultDto>), StatusCodes.Status200OK)]
        [Authorize(Policies.TradeReport)]
        public async Task<ActionResult<PaginatedCollectionViewModel<TradeReportResultDto>>> GetTradeReportData(
            string company,
            EntitySearchRequest searchRequest)
        {
            var searchResult = await _sectionQueries.GetTradeReportDataAsync(company, searchRequest);

            var response = searchResult.ToPaginatedCollectionViewModel(searchRequest);

            return Ok(response);
        }

        /// <summary>
        /// Get List of child sections for Trade.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="searchRequest">The search request.</param>
        [HttpPost("getTradeChildSections")]
        [ProducesResponseType(typeof(CollectionViewModel<ChildSectionsSearchResultDto>), StatusCodes.Status200OK)]
        [Authorize(Policies.ReadTradePhysicalPolicy)]
        [Obsolete("Use GetSectionChilds")]
        public async Task<ActionResult<CollectionViewModel<ChildSectionsSearchResultDto>>> GetChileSectionData(
            string company,
            EntitySearchRequest searchRequest)
        {
            long sectionId = 0;
            string sectionRef = null;

            foreach (var clause in searchRequest.Clauses.Clauses)
            {
                if (clause.FieldId == 0)
                {
                    sectionId = long.Parse(clause.Value1, CultureInfo.InvariantCulture);
                }
                else
                {
                    sectionRef = clause.Value1;
                }
            }

            IEnumerable<ChildSectionsSearchResultDto> tradeReportContracts = await _sectionQueries.GetTradeChildSectionDataAsync(company, sectionId, sectionRef);

            var response = new CollectionViewModel<ChildSectionsSearchResultDto>(tradeReportContracts.ToList());

            return Ok(response);
        }

        /// <summary>
        /// Returns the childs of a section.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="sectionId">The section identifier.</param>
        /// <param name="dataVersionId">The data version id. Null for current one.</param>
        [HttpGet("{sectionId:long}/childs")]
        [ProducesResponseType(typeof(CollectionViewModel<ChildSectionsSearchResultDto>), StatusCodes.Status200OK)]
        [Authorize(Policies.ReadTradePhysicalPolicy)]
        public async Task<ActionResult<CollectionViewModel<ChildSectionsSearchResultDto>>> GetSectionChilds(
            string company, long sectionId, [FromQuery] int? dataVersionId)
        {
            IEnumerable<ChildSectionsSearchResultDto> tradechildSections = await _sectionQueries.GetTradeChildSectionDataAsync(company, sectionId, null, dataVersionId);

            var response = new CollectionViewModel<ChildSectionsSearchResultDto>(tradechildSections.ToList());

            return Ok(response);
        }

        /// <summary>
        /// Returns a section by its identifier.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="sectionId">The section identifier</param>
        /// <param name="dataVersionId">The data version id. Null for current one.</param>
        [HttpGet("{sectionId:long}")]
        [ProducesResponseType(typeof(PhysicalContractDtoDeprecated), StatusCodes.Status200OK)]
        [Authorize(Policies.ReadTradePhysicalPolicy)]
        public async Task<ActionResult<PhysicalContractDtoDeprecated>> GetSectionById(string company, [Range(1, long.MaxValue)] long sectionId, [FromQuery] int? dataVersionId = null)
        {
            var section = await _sectionQueries.GetSectionByIdAsync(sectionId, company, dataVersionId);

            if (section != null)
            {
                HttpContext.Response.Headers.Add(HeaderNames.LastModified, (section.LastModifiedDate ?? section.CreationDate)?.ToString("R", CultureInfo.InvariantCulture));
            }

            return Ok(section);
        }

        /// <summary>
        /// Returns the charters details to validate closure conditons.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="sectionIds">The Charter identifier.</param>
        [HttpGet("{sectionIds}/closesectiondetails")]
        [ProducesResponseType(typeof(IEnumerable<SectionAssignedToCloseCharterDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetTradeDetailForClosure(string company, string sectionIds)
        {
            var charter = await _sectionQueries.GetTradeDetailForClosure(company, sectionIds.Split(',').Select(long.Parse).ToArray());

            return Ok(charter);
        }

        /// <summary>
        /// Approves a section.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="sectionId">The identifier of the section to approve.</param>
        /// <param name="command">The command containing the sectionId and the dataVersionId</param>
        [HttpPost("{sectionId:long}/approve")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.TradeApprovalPolicy)]
        public async Task<IActionResult> ApproveSection(string company, [Range(1, long.MaxValue)] long sectionId)
        {
            var command = new ApproveSectionCommand
            {
                Company = company,
                SectionId = sectionId
            };

            await _mediator.Send(command);

            return NoContent();
        }

        /// <summary>
        /// Unapproves a section.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="sectionId">The identifier of the section to unapprove.</param>
        [HttpPost("{sectionId:long}/unapprove")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> UnapproveSection(string company, [Range(1, long.MaxValue)] long sectionId)
        {
            var command = new UnapproveSectionCommand
            {
                SectionId = sectionId,
                Company = company
            };

            await _mediator.Send(command);

            return NoContent();
        }

        /// <summary>
        /// Delete a section.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="sectionId">The identifier of the section to delete.</param>
        [HttpPost("{sectionId:long}/delete")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.TradeDeletionPolicy)]
        public async Task<IActionResult> DeleteSection(string company, [Range(1, long.MaxValue)] long sectionId)
        {
            var command = new DeleteSectionCommand
            {
                SectionId = sectionId,
                Company = company
            };

            await _mediator.Send(command);

            return NoContent();
        }

        /// <summary>
        /// Close a section.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="sectionIds">The identifier of the sections to close.</param>
        /// <param name="request">The request containing the data version Id.</param>
        [HttpPost("{sectionIds}/close")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.CloseTradePolicy)]
        public async Task<IActionResult> CloseSection(string company, string sectionIds, CloseSectionStatusCommand request)
        {
            request.SectionIds = sectionIds.Split(',').Select(long.Parse).ToArray();
            request.Company = company;

            await _mediator.Send(request);

            return NoContent();
        }

        /// <summary>
        /// Open a section.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="sectionIds">The identifier of the sections to open.</param>
        /// <param name="request">The request containing the data version Id.</param>
        [HttpPost("{sectionIds}/open")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> OpenSection(string company, string sectionIds, OpenSectionStatusCommand request)
        {

            request.SectionIds = sectionIds.Split(',').Select(long.Parse).ToArray();
            request.Company = company;

            await _mediator.Send(request);

            return NoContent();
        }

        /// <summary>
        /// Cancel a section.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="command">The details of the sections to cancel.</param>
        [HttpPost("cancel")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> CancelSection(string company, CancelSectionStatusCommand command)
        {
            command.Company = company;

            await _mediator.Send(command);

            return NoContent();
        }

        /// <summary>
        /// Reverse cancellation for a section.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="sectionIds">The identifier of the sections to reverse cancel.</param>
        [HttpPost("{sectionIds}/reversecancel")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> ReverseCancelSection(string company, string sectionIds)
        {
            var command = new ReverseCancelSectionStatusCommand
            {
                SectionIds = sectionIds.Split(',').Select(long.Parse).ToArray(),
                Company = company
            };

            await _mediator.Send(command);

            return NoContent();
        }

        /// <summary>
        /// Returns the list of costs for a section.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="sectionId">The section identifier</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        /// <param name="dataVersionId">The data version id. Null for current one.</param>
        [HttpGet("{sectionId:long}/costs")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<CostDto>), StatusCodes.Status200OK)]
        [Authorize(Policies.ReadTradePhysicalPolicy)]
        public async Task<ActionResult<PaginatedCollectionViewModel<CostDto>>> GetAllCosts(
            string company, [Range(1, long.MaxValue)] long sectionId, [FromQuery] PagingOptions pagingOptions, [FromQuery] int? dataVersionId = null)
        {
            IEnumerable<CostDto> costs = await _sectionQueries.GetAllCosts(sectionId, company, dataVersionId);

            var response = new PaginatedCollectionViewModel<CostDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, costs.ToList(), null);

            return Ok(response);
        }

        /// <summary>
        /// Deletes a cost of a section.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="sectionId">The section identifier</param>
        /// <param name="costId">The identifier of the cost to delete.</param>
        /// <param name="dataVersionId">The data version id. Null for current one.</param>
        [HttpDelete("{sectionId:long}/costs/{costId:long}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.WriteTradePhysicalPolicy)]
        public async Task<IActionResult> DeleteCost(string company, [Range(1, long.MaxValue)] long sectionId, [Range(1, long.MaxValue)] long costId, [FromQuery] int? dataVersionId = null)
        {
            var command = new DeleteCostsCommand
            {
                Company = company,
                SectionId = sectionId,
                CostIds = new List<long> { costId },
                DataVersionId = dataVersionId
            };

            await _mediator.Send(command);

            return NoContent();
        }

        [HttpPost("{sectionId:long}/documents/assigncontractadvice")]
        [ProducesResponseType(typeof(PhysicalDocumentReferenceDto), StatusCodes.Status200OK)]
        [Authorize(Policies.WriteTradePhysicalPolicy)]
        public async Task<ActionResult<PhysicalDocumentReferenceDto>> AssignContractAdviceToContract(string company, [Range(1, long.MaxValue)] long sectionId, [FromBody, Required] AssignContractAdviceCommand document)
        {
            document.Company = company;
            document.SectionId = sectionId;

            var documentId = await _mediator.Send(document);

            return Ok(documentId);
        }

        [HttpPost("{sectionId:long}/documents/generatecontractadvice")]
        [ProducesResponseType(typeof(PhysicalDocumentReferenceDto), StatusCodes.Status200OK)]
        [Authorize(Policies.GenerateContractAdvicePolicy)]
        public async Task<ActionResult<PhysicalDocumentReferenceDto>> CreateContractAdvice(string company, [Range(1, long.MaxValue)] long sectionId, [FromBody, Required] GenerateContractAdviceCommand contractAdviceParameters)
        {
            contractAdviceParameters.Company = company;
            contractAdviceParameters.SectionId = sectionId;

            var documentId = await _mediator.Send(contractAdviceParameters);

            return Ok(documentId);
        }

        [HttpPost("{sectionId:long}/documents/update")]
        [ProducesResponseType(typeof(PhysicalDocumentReferenceDto), StatusCodes.Status200OK)]
        [Authorize(Policies.GenerateContractAdvicePolicy)]
        public async Task<ActionResult<PhysicalDocumentReferenceDto>> UpdateContractAdvice(string company, [Range(1, long.MaxValue)] long sectionId, [FromBody, Required] UpdateContractAdviceCommand request)
        {
            request.Company = company;
            request.SectionId = sectionId;

            var documentId = await _mediator.Send(request);

            return Ok(documentId);
        }

        /// <summary>
        /// Returns Trade Image Field details
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <returns>Return Trade Image Fields</returns>
        [HttpGet("imageField")]
        [ProducesResponseType(typeof(CollectionViewModel<TradeImageColumnDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<TradeImageColumnDto>>> TradeImageFieldByCompany(string company)
        {
            IEnumerable<TradeImageColumnDto> tradeImageFieldInfo = await _sectionQueries.GetTradeImageFieldDetailsAsync(company);

            var response = new CollectionViewModel<TradeImageColumnDto>(tradeImageFieldInfo.ToList());

            return Ok(response);
        }

        /// <summary>
        /// Trade Configuration for Business Sector
        /// </summary>
        /// <param name="company">The company code</param>
        [HttpGet("tradeConfiguration")]
        [ProducesResponseType(typeof(TradeConfigurationDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<TradeConfigurationDto>> GetTradeConfigurationAsync(string company)
        {
            var tradeConfigurationInfo = await _sectionQueries.GetTradeConfigurationDetails(company);
            return Ok(tradeConfigurationInfo);
        }

        /// <summary>
        /// Deletes multiple costs of a section.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="sectionId">The section identifier.</param>
        /// <param name="request">The costs to delete.</param>
        [HttpPost("{sectionId:long}/costs/delete")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.WriteTradePhysicalPolicy)]
        public async Task<IActionResult> DeleteCosts(string company, [Range(1, long.MaxValue)] long sectionId, DeleteCostsCommand request)
        {
            request.Company = company;
            request.SectionId = sectionId;

            await _mediator.Send(request);

            return NoContent();
        }

        /// <summary>
        /// Bulk approval update.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="request">The trades to approve.</param>
        [HttpPost("bulkapprovaloftrades")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.WriteTradePhysicalPolicy)]
        public async Task<IActionResult> BulkApprovalOfTrades(string company, [FromBody, Required] UpdateBulkApprovalCommand request)
        {
            request.CompanyId = company;

            await _mediator.Send(request);

            return NoContent();
        }

        /// <summary>
        /// Trade Bulk Edit.
        /// </summary>
        /// <param name="company">The company code</param>
        /// <param name="selectedSectionIds">The section id for the selected contracts</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        [HttpGet("tradeBulkEdit")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<SectionBulkEditDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<SectionBulkEditDto>>> GetPhysicalTradesForBulkEdit(string company, [FromQuery] string selectedSectionIds, [FromQuery] PagingOptions pagingOptions)
        {
            var result = await _sectionQueries.GetPhysicalTradesForBulkEdit(company, selectedSectionIds.Split(',').Select(int.Parse).ToArray(), pagingOptions.Offset, pagingOptions.Limit);
            var response = new PaginatedCollectionViewModel<SectionBulkEditDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, result.ToList(), null);
            return Ok(response);
        }

        /// <summary>
        /// Trade Bulk Closure.
        /// </summary>
        /// <param name="company">The company code</param>
        /// <param name="selectedSectionIds">The section id for the selected contracts</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        [HttpGet("tradebulkclosure")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<SectionBulkClosureDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<SectionBulkClosureDto>>> GetPhysicalTradesForBulkClosure(string company, [FromQuery] string selectedSectionIds, [FromQuery] PagingOptions pagingOptions)
        {
            var result = await _sectionQueries.GetPhysicalTradesForBulkClosure(company, selectedSectionIds.Split(',').Select(int.Parse).ToArray(), pagingOptions.Offset, pagingOptions.Limit);
            var response = new PaginatedCollectionViewModel<SectionBulkClosureDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, result.ToList(), null);
            return Ok(response);
        }

        [HttpGet("{sectionId}/getChildTradesForSection")]
        [ProducesResponseType(typeof(CollectionViewModel<ChildTradesDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<ChildTradesDto>>> GetChildTradesForSection(string company, long sectionId)
        {
            var sections = await _sectionQueries.GetChildTradesForSection(company, sectionId);

            var response = new CollectionViewModel<ChildTradesDto>(sections.ToList());

            return Ok(response);
        }

        /// <summary>
        /// Returns the list of costs for given contracts.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="sectionIds">The list of section identifiers.</param>
        [HttpGet("getcostsforcontracts")]
        [ProducesResponseType(typeof(CollectionViewModel<CostBulkEditDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<CostBulkEditDto>>> GetCostsForContracts(string company, [FromQuery] string sectionIds)
        {
            var result = await _sectionQueries.GetCostsForContractsAsync(company, sectionIds.Split(',').Select(int.Parse).ToArray());

            var response = new CollectionViewModel<CostBulkEditDto>(result.ToList());

            return Ok(response);
        }

        /// <summary>
        /// save costs after bulk edit
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="request">The costs to save/update.</param>
        [HttpPost("addupdateordeletecostsinbulk")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(CollectionViewModel<CostBulkEdit>), StatusCodes.Status200OK)]
        [Authorize(Policies.WriteTradePhysicalPolicy)]
        public async Task<ActionResult<CollectionViewModel<CostBulkEdit>>> SaveBulkCosts(string company, [FromBody, Required] SaveBulkCostsCommand request)
        {
            request.Company = company;

            IEnumerable<CostBulkEdit> newCosts = await _mediator.Send(request);
            var response = new CollectionViewModel<CostBulkEdit>(newCosts.ToList());

            return Ok(response);
        }

        /// <summary>
        /// Returns the list of costs for given section id.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="sectionId">section id.</param>
        /// <param name="dataVersionId">The data version id. Null for current one.</param>
        [HttpGet("{sectionId}/parentcoststoadjust")]
        [ProducesResponseType(typeof(CollectionViewModel<ParentCostsToAdjustDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<ParentCostsToAdjustDto>>> GetParentCostsToAdjustForSection(string company, long sectionId, [FromQuery] int? dataVersionId = null)
        {
            var sections = await _sectionQueries.GetParentCostsForSectionAsync(sectionId, company, dataVersionId);

            var response = new CollectionViewModel<ParentCostsToAdjustDto>(sections.ToList());

            return Ok(response);
        }

        /// <summary>
        /// Returns the list of trade field for bulk edit by company id.
        /// </summary>
        /// <param name="company">The company code.</param>
        [HttpGet("tradefieldsforbulkedit")]
        [ProducesResponseType(typeof(CollectionViewModel<TradeFieldsForBulkEditDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<TradeFieldsForBulkEditDto>>> GetTradeFieldsForBulkEdit(string company)
        {
            var result = await _sectionQueries.GetTradeFieldsForBulkEditAsync(company);

            var response = new CollectionViewModel<TradeFieldsForBulkEditDto>(result.ToList());

            return Ok(response);
        }

        /// <summary>
        /// Returns the list of costs  in splits/tranches for given section id.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="sectionId">section id.</param>
        /// <param name="dataVersionId">The data version id. Null for current one.</param>
        [HttpGet("{sectionId}/childsectioncoststoadjust")]
        [ProducesResponseType(typeof(CollectionViewModel<ChildSectionCostsToAdjust>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<ChildSectionCostsToAdjust>>> GetChildSectionCostsToAdjustForSection(string company, long sectionId, [FromQuery] int? dataVersionId = null)
        {
            var sections = await _sectionQueries.GetChildSectionCostsForSectionAsync(sectionId, company, dataVersionId);

            var response = new CollectionViewModel<ChildSectionCostsToAdjust>(sections.ToList());

            return Ok(response);
        }

        /// <summary>
        /// Returns the Overview as well as Details list of Generate End of Month for a Fx Deal.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="dataVersionId">The data version id. Null for current one.</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        [HttpGet("fxEndOfMonthData")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<FxDealDetailsGenerateMonthEndDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<FxDealDetailsGenerateMonthEndDto>>> GetFxDealDetailsGenerateMonthEnd(string company, [FromQuery] int? dataVersionId, [FromQuery] PagingOptions pagingOptions)
        {
            IEnumerable<FxDealDetailsGenerateMonthEndDto> sections = await _sectionQueries.GetFxDealDetailsGenerateMonthEndAsync(company, dataVersionId, pagingOptions.Offset, pagingOptions.Limit);

            var response = new PaginatedCollectionViewModel<FxDealDetailsGenerateMonthEndDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, sections.ToList(), null);

            return Ok(response);
        }

        ///// <summary>
        ///// Deletes uninvoiced costs.
        ///// </summary>
        ///// <param name="company">The company code.</param>
        ///// <param name="sectionId">The section identifier</param>
        ///// <param name="costId">The identifier of the cost to delete.</param>
        ///// <param name="dataVersionId">The data version id if it's not current</param>
        //[HttpDelete("{sectionId:long}/uninvoicedcosts/{costId}")]
        //[ProducesResponseType(StatusCodes.Status204NoContent)]
        //[Authorize(Policies.WriteTradePhysicalPolicy)]
        //public async Task<IActionResult> DeleteCosts(string company, [Range(1, long.MaxValue)] long sectionId, string costId, [FromQuery] int? dataVersionId = null)
        //{
        //    var command = new DeleteCostsCommand
        //    {
        //        Company = company,
        //        SectionId = sectionId,
        //        CostIds = costId.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(long.Parse).ToList(),
        //        DataVersionId = dataVersionId
        //    };

        //    await _mediator.Send(command);

        //    return NoContent();
        //}

        ///// <summary>
        ///// Creates a new tranche of the section.
        ///// </summary>
        ///// <param name="company">The company code.</param>
        ///// <param name="sectionId">The section identifier</param>
        ///// <param name="sectionToTranche">The section tranches to add.</param>
        //[HttpPost("{sectionId:long}/slice")]
        //[Consumes(MediaTypeNames.Application.Json)]
        //[ProducesResponseType(StatusCodes.Status200OK)]
        //[Authorize(Policies.CreateTrancheSplitPolicy)]
        //public async Task<IActionResult> CreateSectionTranche(string company, long sectionId, [FromBody, Required] CreateTrancheCommand sectionToTranche)
        //{
        //    if (sectionToTranche == null)
        //    {
        //        return BadRequest();
        //    }

        //    sectionToTranche.Company = company;
        //    sectionToTranche.SectionId = sectionId;

        //    var sectionReferences = await _mediator.Send(sectionToTranche);

        //    return Ok(sectionReferences);
        //}

        ///// <summary>
        ///// Creates a new split of the section.
        ///// </summary>
        ///// <param name="company">The company code.</param>
        ///// <param name="sectionId">The section identifier</param>
        ///// <param name="sectionToSplit">The section splits to add.</param>
        //[HttpPost("{sectionId:long}/split")]
        //[Consumes(MediaTypeNames.Application.Json)]
        //[ProducesResponseType(StatusCodes.Status200OK)]
        //[Authorize(Policies.CreateTrancheSplitPolicy)]
        //public async Task<IActionResult> CreateSectionSplit(string company, long sectionId, [FromBody, Required] CreateSplitCommand sectionToSplit)
        //{
        //    if (sectionToSplit == null)
        //    {
        //        return BadRequest();
        //    }

        //    sectionToSplit.Company = company;
        //    sectionToSplit.SectionId = sectionId;

        //    var sectionReferences = await _mediator.Send(sectionToSplit);

        //    return Ok(sectionReferences);
        //}
    }
}