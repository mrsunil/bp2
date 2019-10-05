using LDC.Atlas.Services.Trading.Application.Commands.CreateFxDeal;
using LDC.Atlas.Services.Trading.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Repositories
{
    public interface IFxDealRepository
    {
        Task<FxDealReference> CreateFxDealAsync(FxDeal fxDeal, string company);

        Task UpdateFxDealAsync(FxDeal fxDeal, string company);

        Task DeleteFxDealAsync(long fxDealId, string company);

        Task DeleteFxDealSectionsAsync(IEnumerable<long> sectionIds, long fxDealId, string company);

        Task UpdateFxDealSectionsAsync(long fxDealId, IEnumerable<FxDealSection> sections, string company);

        Task<IEnumerable<SectionInformationFxDeal>> GetSectionInformationForFxDealAsync(IEnumerable<long> sectionIds, string company);

        Task UpdateFxDealStatus(string company);

        Task UpdateSettleFxDeals(List<long> fxDealIds, string company);
    }
}
