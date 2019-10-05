using LDC.Atlas.Application.Common.Entities;
using LDC.Atlas.Application.Common.Tags;
using LDC.Atlas.Application.Common.Tags.Dto;
using LDC.Atlas.Services.Document.Application.Queries.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Document.Services
{
    public class TagServiceForContractAdvice : ITagServiceForContractAdvice
    {
        private readonly ITagsService _tagsService;

        public TagServiceForContractAdvice(ITagsService tagsService)
        {
            this._tagsService = tagsService;
        }

        /// <inheritdoc/>
        public async Task<bool> CreateOrUpdateTagsForContractAdviceTemplatesAsync(string company, IEnumerable<CreateOrUpdateTagsForTemplatesDto> tagsForTemplates)
        {
            foreach (var item in tagsForTemplates)
            {
                EntityTagListDto currentItem = new EntityTagListDto()
                {
                    EntityId = item.EntityId,
                    EntityExternalId = item.EntityExternalId,
                    EntityTypeName = TagsEntityTypes.CONTRACTADVICETEMPLATE,
                    IsDeactivated = item.IsDeactivated,
                    Tags = (List<TagDto>)item.Tags
                };

                // New entity
                if (currentItem.EntityId < 0)
                {
                    await this._tagsService.CreateTagsAsync(currentItem, company);
                }
                else
                {
                    var oldExternalId = (await _tagsService.GetEntityByIdAsync(new EntityTagListDto { EntityId = currentItem.EntityId })).EntityExternalId;

                    // Template column hasn't changed
                    if (currentItem.EntityExternalId == oldExternalId)
                    {
                        await _tagsService.UpdateTagsAsync(currentItem, company);
                    } // Template column has changed
                    else
                    {
                        await _tagsService.DeleteEntityAsync(company, currentItem.EntityId);
                        await _tagsService.CreateTagsAsync(currentItem, company);
                    }
                }
            }

            return await Task.FromResult(true);
        }

        /// <inheritdoc/>
        public async Task<bool> DeleteContractAdviceTemplateAsync(string company, int entityId)
        {
            await _tagsService.DeleteEntityAsync(company, entityId);

            return await Task.FromResult(true);
        }

        /// <inheritdoc/>
        public async Task<IEnumerable<EntityTagListDto>> GetContractAdviceTemplateWithTagsByIdsAsync(string company, IEnumerable<string> templatesIds)
        {
            return await _tagsService.ListTagsByEntitiesAsync(company, TagsEntityTypes.CONTRACTADVICETEMPLATE, string.Join(',', templatesIds));
        }

        /// <inheritdoc/>
        public async Task<IEnumerable<EntitiesBestMatchDto>> ListContractAdviceTemplatesByTagsAsync(string company, IEnumerable<TagDto> documentTemplateListByTags)
        {
            EntityTagListDto request = new EntityTagListDto()
            {
                EntityTypeName = TagsEntityTypes.CONTRACTADVICETEMPLATE,
                Tags = (List<TagDto>)documentTemplateListByTags
            };

            return await this._tagsService.ListEntitiesByTagsAsync(request);
        }
    }
}
