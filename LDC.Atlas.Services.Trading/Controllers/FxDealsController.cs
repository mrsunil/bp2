using LDC.Atlas.Application.Common.Configuration;
using LDC.Atlas.Execution.Common.Entities;
using LDC.Atlas.Infrastructure.Swagger;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Trading.Application.Commands.CreateFxDeal;
using LDC.Atlas.Services.Trading.Application.Commands.DeleteFxDeal;
using LDC.Atlas.Services.Trading.Application.Commands.DeleteFxDealSections;
using LDC.Atlas.Services.Trading.Application.Commands.SettleFxDeal;
using LDC.Atlas.Services.Trading.Application.Commands.UpdateFxDeal;
using LDC.Atlas.Services.Trading.Application.Commands.UpdateFxDealStatus;
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
    public class FxDealsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IFxDealQueries _fxDealQueries;
        private readonly IGridService _gridQueries;

        public FxDealsController(IMediator mediator, IFxDealQueries sectionQueries, IGridService gridQueries)
        {
            _mediator = mediator;
            _fxDealQueries = sectionQueries;
            _gridQueries = gridQueries;
        }

        /// <summary>
        /// Returns the list of fx deals.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        [HttpGet]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<SectionSearchResultDto>), StatusCodes.Status200OK)]
        [Authorize(Policies.ReadFxDealPolicy)]
        public async Task<ActionResult<PaginatedCollectionViewModel<FxDealSearchResultDto>>> GetFxDeals(
            string company,
            [FromQuery] PagingOptions pagingOptions)
        {
            IEnumerable<FxDealSearchResultDto> sections = await _fxDealQueries.GetFxDealsAsync(company, pagingOptions.Offset, pagingOptions.Limit);

            var response = new PaginatedCollectionViewModel<FxDealSearchResultDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, sections.ToList(), null);

            return Ok(response);
        }

        /// <summary>
        /// Search in the list of fx deals.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="searchRequest">The search request.</param>
        [HttpPost("search")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<FxDealSearchResultDto>), StatusCodes.Status200OK)]
        [Authorize(Policies.ReadFxDealPolicy)]
        public async Task<ActionResult<PaginatedCollectionViewModel<FxDealSearchResultDto>>> SearchFxDeals(
            string company,
            EntitySearchRequest searchRequest)
        {
            var searchResult = await _fxDealQueries.SearchFxDealsAsync(company, searchRequest);

            var response = searchResult.ToPaginatedCollectionViewModel(searchRequest);

            return Ok(response);
        }

        /// <summary>
        /// Returns a fx deal by its identifier.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="fxDealId">The fx deal identifier</param>
        /// <param name="dataVersionId">The data version id. Null for current one.</param>
        [HttpGet("{fxDealId:long}")]
        [ProducesResponseType(typeof(FxDealDto), StatusCodes.Status200OK)]
        [Authorize(Policies.ReadFxDealPolicy)]
        public async Task<ActionResult<FxDealDto>> GetFxDealById(string company, [Range(1, long.MaxValue)] long fxDealId, [FromQuery] int? dataVersionId = null)
        {
            var fxDeal = await _fxDealQueries.GetFxDealByIdAsync(fxDealId, company, dataVersionId);

            if (fxDeal != null)
            {
                HttpContext.Response.Headers.Add(HeaderNames.LastModified, (fxDeal.ModifiedDateTime ?? fxDeal.CreatedDateTime)?.ToString("R", CultureInfo.InvariantCulture));
            }

            return Ok(fxDeal);
        }

        /// <summary>
        /// Creates a fx deal.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="fxDeal">The fx deal to create.</param>
        [HttpPost]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(FxDealReference), StatusCodes.Status201Created)]
        [SwaggerResponseHeader(StatusCodes.Status201Created, HeaderNames.Location, "string", "Location of the newly created resource")]
        [Authorize(Policies.CreateEditFxDealPolicy)]
        public async Task<ActionResult<FxDealReference>> CreateFxDeal(string company, [FromBody, Required] CreateFxDealCommand fxDeal)
        {
            fxDeal.CompanyId = company;

            var fxDealReference = await _mediator.Send(fxDeal);

            return CreatedAtAction(nameof(GetFxDealById), new { company = company, fxDealId = fxDealReference.FxDealId }, fxDealReference);
        }

        /// <summary>
        /// Updates a fx deal.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="fxDealId">The identifier of the fx deal to update.</param>
        /// <param name="fxDeal">The fx deal to update.</param>
        /// <response code="204">Fx deal updated.</response>
        [HttpPatch("{fxDealId:long}")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.CreateEditFxDealPolicy)]
        public async Task<IActionResult> UpdateFxdeal(string company, long fxDealId, [FromBody, Required] UpdateFxDealCommand fxDeal)
        {
            fxDeal.FxDealId = fxDealId;
            fxDeal.CompanyId = company;

            await _mediator.Send(fxDeal);

            return NoContent();
        }

        /// <summary>
        /// Delete a fx deal.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="fxDealId">The identifier of the fx deal to delete.</param>
        [HttpDelete("{fxDealId:long}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.DeleteFxDealPolicy)]
        public async Task<IActionResult> DeleteFxDeal(string company, [Range(1, long.MaxValue)] long fxDealId)
        {
            var fxDealInfo = await _fxDealQueries.GetFxDealByIdAsync(fxDealId, company);

            if (fxDealInfo != null)
            {
                var command = new DeleteFxDealCommand
                {
                    FxDealId = fxDealId,
                    Company = company
                };

                await _mediator.Send(command);
            }
            else
            {
                throw new Exception("Error occured");
            }

            return NoContent();
        }

        /// <summary>
        /// Returns the list of sections associated to a fx deal.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="fxDealId">The identifier of the fx deal.</param>
        [HttpGet("{fxDealId:long}/sections")]
        [ProducesResponseType(typeof(CollectionViewModel<FxDealSectionDto>), StatusCodes.Status200OK)]
        [Authorize(Policies.ReadFxDealPolicy)]
        public async Task<ActionResult<CollectionViewModel<FxDealSectionDto>>> GetFxDealSections(
            string company, [Range(1, long.MaxValue)] long fxDealId)
        {
            IEnumerable<FxDealSectionDto> sections = await _fxDealQueries.GetFxDealSectionsAsync(fxDealId, company);

            var response = new CollectionViewModel<FxDealSectionDto>(sections.ToList());

            return Ok(response);
        }

        ///// <summary>
        ///// Update the sections associated to a fx deal.
        ///// </summary>
        ///// <param name="company">The company code.</param>
        ///// <param name="fxDealId">The identifier of the fx deal.</param>
        ///// <param name="sections">The sections to update.</param>
        //[HttpPatch("{fxDealId:long}/sections")]
        //[ProducesResponseType(StatusCodes.Status204NoContent)]
        //[Authorize(Policies.CreateUpdateFxDealPolicy)]
        //public async Task<ActionResult<CollectionViewModel<FxDealSectionDto>>> UpdateFxDealSections(
        //    string company, [Range(1, long.MaxValue)] long fxDealId, [FromBody, Required] UpdateFxDealSectionsCommand sections)
        //{
        //    sections.FxDealId = fxDealId;
        //    sections.CompanyId = company;

        //    await _mediator.Send(sections);

        //    return NoContent();
        //}

        /// <summary>
        /// Remove sections associated to a fx deal.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="fxDealId">The identifier of the fx deal.</param>
        /// <param name="sectionId">The identifiers of the sections to remove.</param>
        [HttpDelete("{fxDealId:long}/sections")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.CreateEditFxDealPolicy)]
        public async Task<ActionResult<CollectionViewModel<FxDealSectionDto>>> DeleteFxDealSections(
            string company, [Range(1, long.MaxValue)] long fxDealId, [FromQuery] long[] sectionId)
        {
            var command = new DeleteFxDealSectionsCommand
            {
                FxDealId = fxDealId,
                SectionIds = sectionId.ToList(),
                CompanyId = company
            };

            await _mediator.Send(command);

            return NoContent();
        }

        /// <summary>
        /// Update the status of the fx deal for whom the maturity date is reached.
        /// </summary>
        /// <param name="company">The company code.</param>
        [HttpPost("status")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.CreateEditFxDealPolicy)]
        public async Task<IActionResult> UpdateFxDealsStatus(string company)
        {
            await _mediator.Send(new UpdateFxDealStatusCommand { CompanyId = company });

            return NoContent();
        }

        [HttpPost("bankBrokerContextualSearch")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<CounterpartyDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<CounterpartyDto>>> SearchBank(
          string company,
          EntitySearchRequest searchRequest)
        {
            var grid = await _gridQueries.GetGrid("counterpartiesGrid", company);
            IEnumerable<CounterpartyDto> traders = await _fxDealQueries.GetBankBrokerAsync(company, searchRequest, grid);

            var response = new PaginatedCollectionViewModel<CounterpartyDto>(searchRequest.Offset.Value, searchRequest.Limit.Value, traders.ToList(), null);

            return Ok(response);
        }

        /// <summary>
        /// Settle all fx deals which has reached machurity date through overnight process.
        /// </summary>
        /// <param name="company">The company code.</param>
        [HttpPost("fxDealSettlement")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Policies.CreateEditFxDealPolicy)]
        public async Task<ActionResult<CollectionViewModel<FxDealSectionDto>>> SettleFxDealsDueForSettlement(string company)
        {
            IEnumerable<FxDealDto> fxDealsDueForSettlement = await _fxDealQueries.GetFxDealsDueForSettlementAsync(company);

            if (fxDealsDueForSettlement.Count() > 0)
            {
                var command = new FxDealDocumentCreationCommand
                {
                    FxDealIds = fxDealsDueForSettlement,
                    IsReversal = false,
                    Company = company
                };

                await _mediator.Send(command);
            }

            return NoContent();
        }

        /// <summary>
        /// Settle Fx Deal and return document reference with transaction document id
        /// </summary>
        /// <param name="company">The company code</param>
        /// <param name="fxDealId">FxDeal Identifier</param>
        [HttpPost("{fxDealId:long}/settle")]
        [ProducesResponseType(typeof(TransactionCreationResponse), StatusCodes.Status200OK)]
        public async Task<IActionResult> SettleFxDeal(string company, [Range(1, long.MaxValue)] long fxDealId)
        {
            var fxDealInfo = await _fxDealQueries.GetFxDealByIdAsync(fxDealId, company);

            if (fxDealInfo != null
                && fxDealInfo.MaturityDate <= DateTime.UtcNow
                && fxDealInfo.FxDealStatusId != (int)FxDealStatus.Settled)
            {
                List<FxDealDto> fxDeals = new List<FxDealDto>();
                fxDeals.Add(fxDealInfo);
                var command = new FxDealDocumentCreationCommand
                {
                    FxDealIds = fxDeals,
                    IsReversal = false,
                    Company = company
                };

                var commandResult = await _mediator.Send(command);
                return Ok(commandResult);
            }
            else if (fxDealInfo == null)
            {
                throw new Exception("No such fxdeal to settle.");
            }
            else
            {
                return Ok();
            }
        }

        /// <summary>
        /// Generate reversal document for FxDeal document.
        /// </summary>
        /// <param name="company">The company code</param>
        /// <param name="fxDealId">FxDeal Identifier</param>
        [HttpPost("{fxDealId:long}/reverse")]
        [ProducesResponseType(typeof(TransactionCreationResponse), StatusCodes.Status200OK)]
        public async Task<IActionResult> ReverseFxDeal(string company, [Range(1, long.MaxValue)] long fxDealId)
        {
            var fxDealInfo = await _fxDealQueries.GetFxDealByIdAsync(fxDealId, company);

            if (fxDealInfo != null
                && fxDealInfo.FxDealStatusId == (int)FxDealStatus.Settled)
            {
                if (fxDealInfo.FxSettlementSettlementDocumentPostingStatusId != (int)PostingStatus.Posted
                    || fxDealInfo.FxSettlementDealDocumentPostingStatusId != (int)PostingStatus.Posted)
                {
                    throw new Exception("The FX deal has already matured but the settlement documents have not been posted yet. Please post the documents before deleting the deal.");
                }
                else
                {
                    List<FxDealDto> fxDeals = new List<FxDealDto>();
                    fxDeals.Add(fxDealInfo);
                    var fxdealToReverseSettle = new FxDealDocumentCreationCommand
                    {
                        FxDealIds = fxDeals,
                        IsReversal = true,
                        Company = company
                    };

                    var commandResult = await _mediator.Send(fxdealToReverseSettle);
                    return Ok(commandResult);
                }
            }
            else
            {
                throw new Exception("Invalid FX deal for reversal.");
            }
        }
    }
}