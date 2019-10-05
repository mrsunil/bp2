using LDC.Atlas.Application.Common.Tags.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Services
{
    public interface ITagService
    {
        Task<List<EntitiesBestMatchDto>> ListCostMatricesOrderedByTagsAsync(string companyId, List<TagDto> listCostMatricesByTags);

        Task<List<EntityTagListDto>> GetTagsListAsync(string company, string costMatricesIds);
    }
}
