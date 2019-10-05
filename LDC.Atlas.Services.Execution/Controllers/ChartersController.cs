using LDC.Atlas.Application.Common.Configuration;
using LDC.Atlas.Infrastructure.Swagger;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Execution.Application.Commands;
using LDC.Atlas.Services.Execution.Application.Queries;
using LDC.Atlas.Services.Execution.Application.Queries.Dto;
using LDC.Atlas.Services.Execution.Infrastructure.Policies;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using System;
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

    public class ChartersController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ICharterQueries _charterQueries;
        private readonly IGridService _gridQueries;

        public ChartersController(IMediator mediator, ICharterQueries charterQueries, IGridService gridQueries)
        {
            _mediator = mediator;
            _charterQueries = charterQueries;
            _gridQueries = gridQueries;
        }

        /// <summary>
        /// Returns the list of charters.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        /// <param name="selectedCompanies">The selected company code.</param>
        /// <param name="charterRef">The charter reference.</param>
        [HttpGet]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<CharterSummaryDto>), StatusCodes.Status200OK)]
        [Authorize(Policies.CharterPolicy)]
        public async Task<ActionResult<PaginatedCollectionViewModel<CharterSummaryDto>>> GetCharters(
            string company,
            [FromQuery] PagingOptions pagingOptions,
            [FromQuery] string selectedCompanies,
            [FromQuery] string charterRef)
        {
            if (!string.IsNullOrEmpty(company) && !string.IsNullOrEmpty(selectedCompanies))
            {
                company = selectedCompanies + ',' + company;
            }

            var charters = await _charterQueries.GetChartersAsync(company.Split(',').ToArray(), charterRef, pagingOptions.Offset, pagingOptions.Limit);

            var response = new PaginatedCollectionViewModel<CharterSummaryDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, charters.ToList(), null);

            return Ok(response);
        }

        /// <summary>
        /// Search in the list of charters.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="searchRequest">The search request.</param>
        [HttpPost("search")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<CharterSummaryDto>), StatusCodes.Status200OK)]
        [Authorize(Policies.CharterPolicy)]
        public async Task<ActionResult<PaginatedCollectionViewModel<CharterSummaryDto>>> SearchCharters(
            string company,
            EntitySearchRequest searchRequest)
        {
            var searchResult = await _charterQueries.SearchChartersAsync(company, searchRequest);

            var response = searchResult.ToPaginatedCollectionViewModel(searchRequest);

            return Ok(response);
        }

        /// <summary>
        /// Returns a charter by its identifier.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="charterId">The charter identifier.</param>
        [HttpGet("{charterId:int}")]
        [ProducesResponseType(typeof(CharterDto), StatusCodes.Status200OK)]
        [Authorize(Policies.CharterPolicy)]
        public async Task<ActionResult<CharterDto>> GetCharterById(string company, [Range(1, long.MaxValue)] long charterId)
        {
            var charter = await _charterQueries.GetCharterByIdAsync(charterId, company);

            return Ok(charter);
        }

        /// <summary>
        /// Checks if a charter reference exists.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="charterRef">The charter reference.</param>
        [HttpHead("{charterRef}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.CharterPolicy)]
        public async Task<IActionResult> CheckCharterReferenceExists(string company, string charterRef)
        {
            var charterExists = await _charterQueries.CheckCharterReferenceExistsAsync(charterRef, company);

            if (!charterExists)
            {
                return NoContent();
            }

            return Ok();
        }

        /// <summary>
        /// Returns the sections assigned to a charter.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="charterId">The charter identifier.</param>
        [HttpGet("{charterId}/sections")]
        [ProducesResponseType(typeof(CollectionViewModel<SectionAssignedToCharterDto>), StatusCodes.Status200OK)]
        [Authorize(Policies.CharterPolicy)]
        public async Task<ActionResult<CollectionViewModel<SectionAssignedToCharterDto>>> GetSectionsAssignedToCharter(string company, int charterId)
        {
            var sections = await _charterQueries.GetSectionsAssignedToCharterAsync(charterId, company);

            var response = new CollectionViewModel<SectionAssignedToCharterDto>(sections.ToList());

            return Ok(response);
        }

        /// <summary>
        /// Returns the sections which can be assigned to charter.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="contractLabel">The contract label.</param>
        [HttpGet("sectionstoassign")]
        [ProducesResponseType(typeof(CollectionViewModel<SectionAssignedToCharterDto>), StatusCodes.Status200OK)]
        [Authorize(Policies.CharterPolicy)]
        public async Task<ActionResult<CollectionViewModel<SectionAssignedToCharterDto>>> GetContractsToBeAssignedToCharterAsync(string company, [FromQuery] string contractLabel)
        {
            var sections = await _charterQueries.GetContractsToBeAssignedToCharterAsync(contractLabel, company);

            var response = new CollectionViewModel<SectionAssignedToCharterDto>(sections.ToList());

            return Ok(response);
        }

        /// <summary>
        /// Creates a new charter.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="charter">The charter to create.</param>
        [HttpPost]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(CharterReference), StatusCodes.Status201Created)]
        [SwaggerResponseHeader(StatusCodes.Status201Created, HeaderNames.Location, "string", "Location of the newly created resource")]
        [Authorize(Policies.ManageCharterPolicy)]
        public async Task<ActionResult<CharterReference>> CreateCharter(string company, [FromBody, Required] CreateCharterCommand charter)
        {
            charter.Company = company;
            var commandResult = await _mediator.Send(charter);

            return CreatedAtAction(nameof(GetCharterById), new { company, charterId = commandResult.CharterId }, commandResult);
        }

        /// <summary>
        /// Update a charter.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="charterId">The charter identifier.</param>
        /// <param name="charter">The charter to update.</param>
        [HttpPatch("{charterId:int}")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.ManageCharterPolicy)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateCharter(string company, int charterId, [FromBody, Required] UpdateCharterCommand charter)
        {
            if (charterId <= 0)
            {
                return BadRequest();
            }

            charter.CharterId = charterId;
            charter.Company = company;

            await _mediator.Send(charter);

            return NoContent();
        }

        /// <summary>
        /// Assigns sections to a charter.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="charterId">The charter identifier.</param>
        /// <param name="request">The sections to assign.</param>
        [HttpPost("{charterId}/sections")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.ManageCharterPolicy)]
        public async Task<IActionResult> AssignSectionsToCharter(string company, int charterId, [FromBody, Required] AssignSectionsToCharterCommand request)
        {
            request.Company = company;
            request.CharterId = charterId;

            await _mediator.Send(request);

            return NoContent();
        }

        /// <summary>
        /// Remove selected section list assigned to a charter.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="charterId">The charter identifier.</param>
        /// <param name="request">The sections to remove.</param>
        [HttpPost("{charterId}/sections/deassignsection")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.ManageCharterPolicy)]
        public async Task<IActionResult> RemoveSectionsFromCharter(string company, int charterId, [FromBody] RemoveSectionsFromCharterCommand request)
        {
            request.Company = company;
            request.CharterId = charterId;

            await _mediator.Send(request);

            return NoContent();
        }

        /// <summary>
        /// Reassign selected section list to another charter.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="charterId">The charter identifier.</param>
        /// <param name="request">The sections to reassign.</param>
        [HttpPost("{charterId}/sections/reassignsection")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.AssignOrDeassignContractPolicy)]
        public async Task<IActionResult> ReassignSectionsForCharter(string company, int charterId, [FromBody] ReassignSectionsForCharterCommand request)
        {
            request.Company = company;
            request.CharterId = charterId;
            await _mediator.Send(request);
            return NoContent();
        }

        /// <summary>
        /// Remove a charter.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="charterId">The charter identifier.</param>
        [HttpDelete("{charterId}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.ManageCharterPolicy)]
        public async Task<IActionResult> DeleteCharter(string company, long charterId)
        {
            var command = new DeleteCharterCommand
            {
                Company = company,
                CharterId = charterId,
            };

            await _mediator.Send(command);

            return NoContent();
        }

        /// <summary>
        /// Returns the charters associated to a section.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="sectionId">The section identifier.</param>
        [HttpGet("chartersbysection/{sectionId}")]
        [ProducesResponseType(typeof(CharterDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCharterBySectionId(string company, [Range(1, long.MaxValue)] long sectionId)
        {
            var charter = await _charterQueries.GetCharterBySectionIdAsync(sectionId, company);

            return Ok(charter);
        }

        /// <summary>
        /// Update a Section traffic details.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="sectionTraffic">Section traffic to update</param>
        [HttpPatch]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        // [Authorize(Policies.CreationUpdationCharterPolicy)]
        public async Task<IActionResult> UpdateSectionTraffic(string company, [FromBody, Required] UpdateSectionTrafficCommand sectionTraffic)
        {
            sectionTraffic.CompanyId = company;

            await _mediator.Send(sectionTraffic);

            return NoContent();
        }

        /// <summary>
        /// Close a charter.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="charterIds">The identifier of the charters to close.</param>
        [HttpPost("{charterIds}/close")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(IEnumerable<CharterBulkClosureDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> CloseCharter(string company, string charterIds)
        {
            var charter = await _charterQueries.GetAssignedSectionDetailsForBulkClosure(company, charterIds.Split(',').Select(long.Parse).ToArray());

            List<CharterBulkClosureDto> charterEligibleToClose = new List<CharterBulkClosureDto>();
            foreach (var item in charter)
            {
                if (!item.SectionsAssigned.Any((s) => !s.IsClosed))
                {
                    charterEligibleToClose.Add(item);
                }
            }
            var command = new CloseCharterCommand
            {
                CharterIds = charter.Select((c) => (long)c.CharterId).ToArray(),
                Company = company,
                DataVersionid = null
            };

            await _mediator.Send(command);

            return Ok(charter);
        }

        /// <summary>
        /// ReOpens a charter.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="charterIds">The identifier of the charters to reopen.</param>
        [HttpPost("{charterIds}/open")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> OpenCharter(string company, string charterIds)
        {
            var command = new ReopenCharterCommand
            {
                CharterIds = charterIds.Split(',').Select(long.Parse).ToArray(),
                Company = company,
                DataVersionid = null
            };

            await _mediator.Send(command);

            return NoContent();
        }

        /// <summary>
        /// Returns the charters Details and its assigned Section For Bulk Closure.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="charterIds">The Charter identifier.</param>
        [HttpGet("{charterIds}/charterAssignedSections")]
        [ProducesResponseType(typeof(IEnumerable<CharterBulkClosureDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAssignedSectionDetailsForBulkClosure(string company, string charterIds)
        {
            var charter = await _charterQueries.GetAssignedSectionDetailsForBulkClosure(company, charterIds.Split(',').Select(long.Parse).ToArray());

            return Ok(charter);
        }

        /// <summary>
        /// Search in the list of charter Assignments.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="searchRequest">The search request.</param>
        [HttpPost("searchCharterAssignmentSections")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<SectionAssignedToCharterDto>), StatusCodes.Status200OK)]
        [Authorize(Policies.CharterPolicy)]
        public async Task<ActionResult<PaginatedCollectionViewModel<SectionAssignedToCharterDto>>> SearchCharterAssignments(
            string company,
            EntitySearchRequest searchRequest)
        {
            var grid = await _gridQueries.GetGrid("charterSectionToAssign", company);

            if (grid == null)
            {
                throw new Exception("No grid configuration found for charterSectionToAssign.");
            }

            IEnumerable<SectionAssignedToCharterDto> charterAssignmentSections = await _charterQueries.SearchCharterAssignmentsAsync(company, searchRequest, grid);

            var response = new PaginatedCollectionViewModel<SectionAssignedToCharterDto>(searchRequest.Offset.Value, searchRequest.Limit.Value, charterAssignmentSections.ToList(), null);

            return Ok(response);
        }
    }
}