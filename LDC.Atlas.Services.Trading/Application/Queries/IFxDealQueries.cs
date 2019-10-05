using LDC.Atlas.Application.Common.Configuration.Dto;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Trading.Application.Queries.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Queries
{
    public interface IFxDealQueries
    {
        Task<IEnumerable<FxDealSearchResultDto>> SearchFxDealsAsync(string company, EntitySearchRequest searchRequest);

        Task<IEnumerable<FxDealSearchResultDto>> GetFxDealsAsync(string company, int? offset, int? limit);

        Task<IEnumerable<CounterpartyDto>> GetBankBrokerAsync(string company, EntitySearchRequest searchRequest, GridDto grid);

        Task<FxDealDto> GetFxDealByIdAsync(long fxDealId, string company, int? dataVersionId = null);

        Task<IEnumerable<FxDealSectionDto>> GetFxDealSectionsAsync(long fxDealId, string company, int? dataVersionId = null);

        Task<IEnumerable<FxDealDto>> GetFxDealsDueForSettlementAsync(string company);
    }
}
