using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Reporting.Application.Queries.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Reporting.Application.Queries
{
    public interface IClientDetailsQueries
    {
        Task<IEnumerable<ReferentialCounterPartySearchResultDto>> SearchReferentialCounterPartyListAsync(string company, EntitySearchRequest searchRequest, bool showDuplicateCounterpartyData = false);

        Task<IEnumerable<ReferentialBulkEditDto>> SearchBulkEditReferentialCounterPartyListAsync(string company, EntitySearchRequest searchRequest);
    }
}
