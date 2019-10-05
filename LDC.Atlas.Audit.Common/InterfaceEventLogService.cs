namespace LDC.Atlas.Audit.Common
{
    using System.Threading.Tasks;
    using LDC.Atlas.Audit.Common.Entities;
    using LDC.Atlas.Audit.Common.Queries;
    using LDC.Atlas.Audit.Common.Queries.Dto;
    using LDC.Atlas.Audit.Common.Repositories;

    /// <summary>
    /// For Insert/Update Events thru Audit.Common.
    /// </summary>
    public class InterfaceEventLogService : IInterfaceEventLogService
    {
        private readonly IEventQueries _eventQueries;
        private readonly IEventRepository _eventRepository;

        /// <summary>
        /// Initializes a new instance of the <see cref="InterfaceEventLogService"/> class.
        /// </summary>
        /// <param name="eventQueries">instance of IEventQueries</param>
        /// <param name="eventRepository">instance of IEventRepository</param>
        public InterfaceEventLogService(IEventQueries eventQueries, IEventRepository eventRepository)
        {
            this._eventQueries = eventQueries;
            this._eventRepository = eventRepository;
        }

        /// <summary>
        /// Creates new Event.
        /// </summary>
        /// <param name="newEvent">Data for new event.</param>
        /// <returns>Returns Id for newly created event.</returns>
        public async Task<long> CreateEventAsync(Event newEvent)
        {
            var result = await _eventRepository.CreateEventAsync(newEvent);
            return result;
        }

        /// <summary>
        /// For creating event history.
        /// </summary>
        /// <param name="newEvent">Data for creating event history.</param>
        /// <param name="companyId">Company Identifier.</param>
        /// <returns>Creates event history.</returns>
        public async Task CreateEventHistoryAsync(EventHistory newEvent, string companyId)
        {
            await _eventRepository.CreateEventHistoryAsync(newEvent,companyId);
        }

        /// <summary>
        /// Find the event.
        /// </summary>
        /// <param name="eventCriteria">event data to search.</param>
        /// <param name="fromDate">From Date.</param>
        /// <param name="toDate">To Date.</param>
        /// <param name="companyId">Company Identifier.</param>
        /// <returns>list of event Ids matching criteria.</returns>
        public async Task<EventDto> FindEventAsync(EventDto eventCriteria)
        {
           return await _eventQueries.FindEventAsync(eventCriteria);
        }

        /// <summary>
        /// Updates an event.
        /// </summary>
        /// <param name="updatedEvent">Data for new event.</param>
        /// <param name="companyId">Company Identifier.</param>
        /// <returns>updates event Status</returns>
        public async Task UpdateEventStatusAsync(Event updatedEvent, string companyId)
        {
             await _eventRepository.UpdateEventStatusAsync(updatedEvent,companyId);
        }

        /// <summary>
        /// Gets Accounting Id or Cash Id based on Document Reference
        /// </summary>
        /// <param name="company">company Id.</param>
        /// <param name="documentReference">Reference of the Document</param>
        /// <param name="interfaceTypeId">TypeId of the Interface</param>
        /// <param name="objectTypeId">Interface Object TypeId</param>
        /// <returns>Accounting Id or Cash Id based on Document Reference</returns>
        public async Task<long> GetAccountingIdandCashIdbyDocumentReference(string company, string documentReference, int interfaceTypeId, int objectTypeId)
        {
            return await _eventQueries.GetAccountingIdandCashIdbyDocumentReference(company, documentReference, interfaceTypeId, objectTypeId);
        }

    }
}
