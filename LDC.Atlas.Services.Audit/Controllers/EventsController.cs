using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Audit.Application.Queries;
using LDC.Atlas.Services.Audit.Application.Queries.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Audit.Controllers
{
    [Route("api/v1/audit/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class EventsController : ControllerBase
    {
        private readonly IEventQueries _eventQueries;

        public EventsController(IEventQueries eventQueries)
        {
            _eventQueries = eventQueries;
        }

        /// <summary>
        /// Returns list of events
        /// </summary>
        /// <param name="pagingOptions">The options for pagination.</param>
        /// <returns>List of events.</returns>
        [HttpGet]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<EventDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<EventDto>>> GetEvents([FromQuery] PagingOptions pagingOptions)
        {
            IEnumerable<EventDto> events = await _eventQueries.GetEventsAsync();
            events = events.Skip(pagingOptions.Offset.Value).Take(pagingOptions.Limit.Value);
            var response = new PaginatedCollectionViewModel<EventDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, events.ToList(), null);

            return Ok(response);
        }

        /// <summary>
        /// Returns the list of events based on search criteria.
        /// </summary>
        /// <param name="interfaceType">The interface type.</param>
        /// <param name="interfaceStatus">The interface status.</param>
        /// <param name="fromDate">From Date</param>
        /// <param name="toDate">To Date</param>
        /// <param name="documentReference">Document Reference</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        [HttpGet("search")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<EventDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<EventDto>>> GetSearchEvents([FromQuery] int? interfaceType, [FromQuery] int? interfaceStatus, [FromQuery] System.DateTime? fromDate, [FromQuery] System.DateTime? toDate, [FromQuery] string documentReference, [FromQuery] PagingOptions pagingOptions)
        {
            IEnumerable<EventDto> sections = await _eventQueries.GetEventsBySearch(interfaceType, interfaceStatus, fromDate, toDate, documentReference, pagingOptions.Offset, pagingOptions.Limit);

            var response = new PaginatedCollectionViewModel<EventDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, sections.ToList(), null);

            return Ok(response);
        }

        /// <summary>
        /// Returns the list of event history by event id
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="eventId">Event Id.</param>
        /// <param name="pagingOptions">The options for pagination.</param>
        /// <returns>List of event history.</returns>
        [HttpGet("{company}/eventhistorybyid/{eventid:long}")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<EventHistoryDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<EventHistoryDto>>> GetEvents(string company, long eventId, [FromQuery] PagingOptions pagingOptions)
        {
            IEnumerable<EventHistoryDto> events = await _eventQueries.GetEventHistoryAsync(eventId, company);
            events = events.Skip(pagingOptions.Offset.Value).Take(pagingOptions.Limit.Value);
            var response = new PaginatedCollectionViewModel<EventHistoryDto>(pagingOptions.Offset.Value, pagingOptions.Limit.Value, events.ToList(), null);

            return Ok(response);
        }

        /// <summary>
        /// Returns the transaction document details by accounting Id.
        /// </summary>
        /// <param name="company">Company Identifier.</param>
        /// <param name="accountingId">Account Id.</param>
        /// <returns>Return the transaction detail.</returns>
        [HttpGet("{company}/transactiondetail/{accountingId:long}")]
        [ProducesResponseType(typeof(TransactionDetailDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<TransactionDetailDto>> GetTransactionDetailsByAccountingId(string company, long accountingId)
        {
            var transactionDetail = await _eventQueries.GetTransactionDetailsByIdAsync(accountingId, company);

            return Ok(transactionDetail);
        }

        /// <summary>
        /// Returns the cash document details by cash Id.
        /// </summary>
        /// <param name="company">Company Identifier.</param>
        /// <param name="cashId">Account Id.</param>
        /// <returns>Return the cash detail.</returns>
        [HttpGet("{company}/cashdetail/{cashId:long}")]
        [ProducesResponseType(typeof(TransactionDetailDto), StatusCodes.Status200OK)]
        public async Task<ActionResult<TransactionDetailDto>> GetCashDetailsByCashId(string company, long cashId)
        {
            var transactionDetail = await _eventQueries.GetCashDetailsByIdAsync(cashId, company);

            return Ok(transactionDetail);
        }
    }
}