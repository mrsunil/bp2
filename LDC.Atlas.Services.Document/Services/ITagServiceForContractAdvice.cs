using LDC.Atlas.Application.Common.Tags.Dto;
using LDC.Atlas.Services.Document.Application.Queries.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Document.Services
{
    public interface ITagServiceForContractAdvice
    {
        Task<IEnumerable<EntitiesBestMatchDto>> ListContractAdviceTemplatesByTagsAsync(string company, IEnumerable<TagDto> documentTemplateListByTags);

        Task<bool> CreateOrUpdateTagsForContractAdviceTemplatesAsync(string company, IEnumerable<CreateOrUpdateTagsForTemplatesDto> tagsForTemplates);

        Task<bool> DeleteContractAdviceTemplateAsync(string company, int entityId);

        Task<IEnumerable<EntityTagListDto>> GetContractAdviceTemplateWithTagsByIdsAsync(string company, IEnumerable<string> templatesIds);
    }
}
