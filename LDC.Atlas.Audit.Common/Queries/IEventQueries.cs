using System.Threading.Tasks;
using LDC.Atlas.Audit.Common.Queries.Dto;

namespace LDC.Atlas.Audit.Common.Queries
{

    /// <summary>
    /// For Event details.
    /// </summary>
    public interface IEventQueries
    {
        /// <summary>
        /// Find the event.
        /// </summary>
        /// <param name="eventCriteria">event data to search.</param>
        /// <returns>event Id according to the criteria.</returns>
        Task<EventDto> FindEventAsync(EventDto eventCriteria);

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
