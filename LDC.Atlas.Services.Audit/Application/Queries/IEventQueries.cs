using LDC.Atlas.Services.Audit.Application.Queries.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Audit.Application.Queries
{
    public interface IEventQueries
    {
        Task<IEnumerable<EventDto>> GetEventsAsync();

        Task<IEnumerable<EventHistoryDto>> GetEventHistoryAsync(long eventId,string company);

        Task<IEnumerable<EventDto>> GetEventsBySearch(int? interfaceType, int? interfaceStatus, System.DateTime? fromDate, System.DateTime? toDate, string documentReference, int? offset, int? limit);

        Task<TransactionDetailDto> GetTransactionDetailsByIdAsync(long accountingId, string company);

        Task<CashDto> GetCashDetailsByIdAsync(long cashId, string company);

        
    }
}
