namespace LDC.Atlas.Audit.Common.Queries
{
    using System.Threading.Tasks;
    using Dapper;
    using LDC.Atlas.Audit.Common.Queries.Dto;
    using LDC.Atlas.DataAccess;

    /// <summary>
    /// For fetching event details.
    /// </summary>
    public class EventQueries : BaseRepository, IEventQueries
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="EventQueries"/> class.
        /// </summary>
        /// <param name="dapperContext">Instance of Dapper.</param>
        public EventQueries(IDapperContext dapperContext)
            : base(dapperContext)
        {
        }

        /// <summary>
        /// Find the event.
        /// </summary>
        /// <param name="eventCriteria">event data to search.</param>
        /// <returns>event Id according to the criteria.</returns>
        public async Task<EventDto> FindEventAsync(EventDto eventCriteria)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@InterfaceObjectTypeId", eventCriteria.InterfaceObjectTypeId);
            queryParameters.Add("@SourceId", eventCriteria.SourceId);
            queryParameters.Add("@SourceBusinessCode", eventCriteria.SourceBusinessCode);
            queryParameters.Add("@CompanyId", eventCriteria.CompanyId);
            return await ExecuteQueryFirstOrDefaultAsync<EventDto>(StoredProcedureNames.GetEventId, queryParameters);
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
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@DocumentReference", documentReference);
            queryParameters.Add("@CompanyId", company);
            queryParameters.Add("@DataVersionId", null);
            queryParameters.Add("@InterFaceTypeId", interfaceTypeId);
            queryParameters.Add("@ObjectTypeId", objectTypeId);
            var id = await ExecuteQueryFirstOrDefaultAsync<long>(StoredProcedureNames.GetAccountingIdandCashIdbyDocumentReference, queryParameters);
            return id;
        }

        private static class StoredProcedureNames
        {
            internal const string GetEventId = "[Audit].[usp_GetEventId]";
            internal const string GetAccountingIdandCashIdbyDocumentReference = "[Interface].[usp_GetAccountingDocumentIdandCashIdbyDocumentReference]";

        }
    }
}
