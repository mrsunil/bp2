namespace LDC.Atlas.Audit.Common
{
    using System.Threading.Tasks;
    using LDC.Atlas.Audit.Common.Entities;
    using LDC.Atlas.Audit.Common.Queries.Dto;

    public interface IInterfaceEventLogService
    {
        /// <summary>
        /// Find the event.
        /// </summary>
        /// <param name="eventCriteria">event data to search.</param>
        /// <returns>event Id according to the criteria.</returns>
        Task<EventDto> FindEventAsync(EventDto eventCriteria);

        /// <summary>
        /// For creating event history.
        /// </summary>
        /// <param name="newEvent">Data for creating event history.</param>
        /// /// <param name="companyId">company Id.</param>
        /// <returns>Creates event history.</returns>
        Task CreateEventHistoryAsync(EventHistory newEvent, string companyId);

        /// <summary>
        /// Creates new Event.
        /// </summary>
        /// <param name="newEvent">Data for new event.</param>
        /// <returns>Returns Id for newly created event.</returns>
        Task<long> CreateEventAsync(Event newEvent);

        /// <summary>
        /// Updates an event.
        /// </summary>
        /// <param name="updatedEvent">Data for new event.</param>
        /// /// <param name="companyId">company Id.</param>
        /// <returns> updates event status.</returns>
        Task UpdateEventStatusAsync(Event updatedEvent, string companyId);

        /// <summary>
        /// Gets Accounting Id or Cash Id based on Document Reference
        /// </summary>
        /// <param name="company">company Id.</param>
        /// <param name="documentReference">Reference of the Document</param>
        /// <param name="interfaceTypeId">TypeId of the Interface</param>
        /// <param name="objectTypeId">Interface Object TypeId</param>
        /// <returns>Accounting Id or Cash Id based on Document Reference</returns>
        Task<long> GetAccountingIdandCashIdbyDocumentReference(string company, string documentReference, int interfaceTypeId, int objectTypeId);
    }
}
