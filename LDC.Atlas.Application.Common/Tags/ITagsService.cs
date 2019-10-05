using LDC.Atlas.Application.Common.Tags.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Application.Common.Tags
{
    public interface ITagsService
    {
        Task CreateTagsAsync(EntityTagListDto tags, string company);

        Task UpdateTagsAsync(EntityTagListDto tags, string company);

        Task<bool> DeleteEntityAsync(string companyId, long entityId);

        Task<List<EntityTagListDto>> ListTagsByEntitiesAsync(string company, string entityTypeName, string entityExternalIds);

        Task<List<EntitiesBestMatchDto>> ListEntitiesByTagsAsync(EntityTagListDto tags);

        Task<EntityTagListDto> GetEntityByIdAsync(EntityTagListDto entityId);
    }
}
