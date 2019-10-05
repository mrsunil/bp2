namespace LDC.Atlas.Audit.Common.Repositories
{
    using System.Threading.Tasks;
    using Dapper;
    using LDC.Atlas.Audit.Common.Entities;
    using LDC.Atlas.DataAccess;

    /// <summary>
    /// Repository for creating event/event history.
    /// </summary>
    public class EventRepository : BaseRepository, IEventRepository
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="EventRepository"/> class.
        /// </summary>
        /// <param name="dapperContext">Dapper Context.</param>
        public EventRepository(IDapperContext dapperContext)
           : base(dapperContext)
        {
        }

        /// <summary>
        /// For creating event history.
        /// </summary>
        /// <param name="newEvent">Data for creating event history.</param>
        /// <param name="companyId">Company Identifier.</param>
        /// <returns>Creates event history.</returns>
        public async Task CreateEventHistoryAsync(EventHistory newEvent, string companyId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@EventId", newEvent.EventId);
            queryParameters.Add("@Action", newEvent.Action);
            queryParameters.Add("@Message", newEvent.Message);
            queryParameters.Add("@ResultCode", newEvent.ResultCode);
            queryParameters.Add("@ResultMessage", newEvent.ResultMessage);
            queryParameters.Add("@CompanyId", companyId);

            await ExecuteNonQueryAsync(StoredProcedureNames.CreateEventHistory, queryParameters, true);
        }

        /// <summary>
        /// Creates new Event.
        /// </summary>
        /// <param name="newEvent">Data for new event.</param>
        /// <returns>Returns Id for newly created event.</returns>
        public async Task<long> CreateEventAsync(Event newEvent)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@EventSubTypeId", newEvent.EventSubTypeId);
            queryParameters.Add("@CompanyId", newEvent.CompanyId);
            queryParameters.Add("@SourceId", newEvent.SourceId);
            queryParameters.Add("@SourceBusinessCode", newEvent.SourceBusinessCode);
            queryParameters.Add("@LastMessage", newEvent.Message);
            queryParameters.Add("@StatusId", newEvent.StatusId);
            var eventId = await ExecuteQueryFirstOrDefaultAsync<long>(StoredProcedureNames.CreateEvent, queryParameters, true);
            return eventId;
        }

        /// <summary>
        /// Update an event.
        /// </summary>
        /// <param name="updatedEvent">Data for new event.</param>
        /// <param name="companyId">Company Identifier.</param>
        /// <returns>update event status.</returns>
        public async Task UpdateEventStatusAsync(Event updatedEvent, string companyId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@EventId", updatedEvent.EventId);
            queryParameters.Add("@LastMessage", updatedEvent.Message);
            queryParameters.Add("@StatusId", updatedEvent.StatusId);
            queryParameters.Add("@CompanyId", companyId);

            await ExecuteNonQueryAsync(StoredProcedureNames.UpdateEventStatus, queryParameters, true);
        }

        private static class StoredProcedureNames
        {
            internal const string CreateEventHistory = "[Audit].[usp_CreateEventHistory]";
            internal const string CreateEvent = "[Audit].[usp_CreateEvent]";
            internal const string UpdateEventStatus = "[Audit].[usp_UpdateEventStatus]";
        }
    }
}
