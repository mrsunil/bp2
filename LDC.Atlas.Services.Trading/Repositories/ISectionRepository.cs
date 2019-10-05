using LDC.Atlas.Services.Trading.Application.Queries.Dto;
using LDC.Atlas.Services.Trading.Entities;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Repositories
{
    public interface ISectionRepository
    {
        Task<Section> GetSectionById(long sectionId, string company, long? dataVersionId);

        Task ApproveSectionAsync(long sectionId, string company);

        Task UnapproveSectionAsync(long sectionId, string company);

        Task UpdateBulkApproval(string companyId, long[] sectionIds);

        Task DeleteTradeFavoriteAsync(long tradeFavoriteId);

        Task<long> CreateTradeFavouriteAsync(TradeFavoriteDetail tradeFavorite, string companyId);

        Task<SectionTrafficDto> LoadSectionTraffic(long sectionId, string companyId, long? dataVersionId);

        Task UpdateSectionTraffic(IEnumerable<SectionTrafficDto> listSectionsTraffic, string company);

        Task AssignSectionsToCharterAsync(long? charterId, IEnumerable<long> sectionId, string company);

        Task DeleteSectionAsync(long[] sectionIds, string company);

        Task CloseSectionAsync(long[] sectionIds, string company, long? dataVersionId);

        Task OpenSectionAsync(long[] sectionIds, string company, long? dataVersionId);

        Task CancelSectionAsync(long[] sectionIds, string company, DateTime blDate);

        Task UnCancelSectionAsync(long[] sectionIds, string company);

        Task<SectionReference> CreateSplitForContract(string company, Section section, bool reduceContractedValue = false);
    }
}
