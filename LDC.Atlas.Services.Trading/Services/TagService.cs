using LDC.Atlas.Application.Common.Entities;
using LDC.Atlas.Application.Common.Tags;
using LDC.Atlas.Application.Common.Tags.Dto;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Services
{
    public class TagService : ITagService
    {

        private readonly ITagsService _tagsService;

        public TagService(ITagsService tagsService)
        {
            this._tagsService = tagsService;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="companyId"></param>
        /// <param name="listCostMatricesByTags"></param>
        /// <returns></returns>
        public async Task<List<EntitiesBestMatchDto>> ListCostMatricesOrderedByTagsAsync(string companyId, List<TagDto> listCostMatricesByTags)
        {
            EntityTagListDto request = new EntityTagListDto()
            {
                EntityTypeName = TagsEntityTypes.COSTMATRIX,
                Tags = listCostMatricesByTags
            };

            return await this._tagsService.ListEntitiesByTagsAsync(request);
        }

        public async Task<List<EntityTagListDto>> GetTagsListAsync(string company, string costMatricesIds)
        {
            
            return await this._tagsService.ListTagsByEntitiesAsync(company, TagsEntityTypes.COSTMATRIX, costMatricesIds);
        }
    }
}
