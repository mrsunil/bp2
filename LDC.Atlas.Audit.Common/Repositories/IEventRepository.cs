namespace LDC.Atlas.Audit.Common.Repositories
{
    using System.Threading.Tasks;
    using LDC.Atlas.Audit.Common.Entities;

    /// <summary>
    /// For Creating events
    /// </summary>
    public interface IEventRepository
    {
        /// <summary>
        /// Creates Event History.
        /// </summary>
        /// <param name="newEvent">Data for event history.</param>
        /// <param name="companyId">Company Identifier.</param>
        /// <returns>creates event history.</returns>
        Task CreateEventHistoryAsync(EventHistory newEvent, string companyId);

        /// <summary>
        /// Creates new Event.
        /// </summary>
        /// <param name="newEvent">Data for new event.</param>
        /// <returns>Returns Id for newly created event.</returns>
        Task<long> CreateEventAsync(Event newEvent);

        /// <summary>
        /// Update an event.
        /// </summary>
        /// <param name="updatedEvent">Data for new event.</param>
        /// <param name="companyId">Company Identifier.</param>
        /// <returns>updates event status.</returns>
        Task UpdateEventStatusAsync(Event updatedEvent, string companyId);
    }
}
