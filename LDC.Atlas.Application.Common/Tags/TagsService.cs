using Dapper;
using LDC.Atlas.Application.Common.Tags.Dto;
using LDC.Atlas.DataAccess;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Application.Common.Tags
{
    internal class TagsService : BaseRepository, ITagsService
    {
        public TagsService(IDapperContext dapperContext)
        : base(dapperContext)
        {
        }

        /// <inheritdoc/>
        public async Task CreateTagsAsync(EntityTagListDto tags, string company)
        {
            this.CheckParameter(tags);

            var queryParameters = new DynamicParameters();
            queryParameters.Add("@iEntity", ConvertToEntityTagsToUDTT(tags));
            queryParameters.Add("@iCompanyId", company);

            await this.ExecuteNonQueryAsync(StoredProcedureNames.CreateTags, queryParameters, true);
        }

        /// <inheritdoc/>
        public async Task UpdateTagsAsync(EntityTagListDto tags, string company)
        {
            this.CheckParameter(tags);

            var queryParameters = new DynamicParameters();
            queryParameters.Add("@iEntity", ConvertToEntityTagsToUDTT(tags));
            queryParameters.Add("@iCompanyId", company);

            await this.ExecuteNonQueryAsync(StoredProcedureNames.UpdateTags, queryParameters, true).ConfigureAwait(false);
        }

        /// <summary>
        /// Delete an entity and the tags associated to it.
        /// </summary>
        /// <param name="companyId">Company for audit purposes.</param>
        /// <param name="entityId">Entity to be deleted.</param>
        /// <returns>Boolean value of the status of the operation.</returns>
        public async Task<bool> DeleteEntityAsync(string companyId, long entityId)
        {
            var queryParameters = new DynamicParameters();
            queryParameters.Add("@iEntityId", entityId);
            queryParameters.Add("@iCompanyId", companyId);

            await this.ExecuteNonQueryAsync(StoredProcedureNames.DeleteEntity, queryParameters, true).ConfigureAwait(false);

            return true;
        }

        /// <summary>
        /// Returns the list of tags recorded for several entity ids and type inserted as parameters.
        /// </summary>
        /// <param name="company">Company considered to retrieve tags associated.</param>
        /// <param name="entityTypeName">Entity type Name to be queried.</param>
        /// <param name="entityExternalIds">Entity external ids to be queried.</param>
        /// <returns>A <see cref="Task{TResult}"/> representing the result of the asynchronous operation.</returns>
        public async Task<List<EntityTagListDto>> ListTagsByEntitiesAsync(string company, string entityTypeName, string entityExternalIds)
        {
            this.CheckListTagsByEntitiesInput(entityTypeName, entityExternalIds);

            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@iEntityTypeName", entityTypeName);
            queryParameters.Add("@iEntityExternalIds", entityExternalIds);

            List<EntityTagListDto> entitiesWithTags;

            using (var grid = await this.ExecuteQueryMultipleAsync(StoredProcedureNames.ListTagsByEntities, queryParameters).ConfigureAwait(false))
            {
                entitiesWithTags = this.FillEntityTags(grid, entityTypeName);
            }

            return entitiesWithTags;
        }

        /// <summary>
        /// Returns a list of Entities ordered by BestMatch
        /// </summary>
        /// <param name="tags">Tags filter.</param>
        /// <returns>A <see cref="Task{TResult}"/> representing the result of the asynchronous operation.</returns>
        public async Task<List<EntitiesBestMatchDto>> ListEntitiesByTagsAsync(EntityTagListDto tags)
        {
            this.CheckListEntitiesByTagsInput(tags);

            var queryParameters = new DynamicParameters();
            queryParameters.Add("@iTags", ConvertToEntityTagsToUDTT(tags));

            var result = await this.ExecuteQueryAsync<EntitiesBestMatchDto>(StoredProcedureNames.ListEntitiesByTags, queryParameters).ConfigureAwait(false);

            return result.ToList();
        }

        public async Task<EntityTagListDto> GetEntityByIdAsync(EntityTagListDto entityId)
        {
            this.CheckListEntitiesByTagsInput(entityId);

            var queryParameters = new DynamicParameters();
            queryParameters.Add("@iEntity", ConvertToEntityTagsToUDTT(entityId));

            var result = await this.ExecuteQueryAsync<EntityTagListDto>(StoredProcedureNames.ListEntitiesById, queryParameters).ConfigureAwait(false);

            return result.FirstOrDefault();
        }

        // Help to improve this code
        // https://riptutorial.com/dapper/example/1197/one-to-many-mapping
        private List<EntityTagListDto> FillEntityTags(SqlMapper.GridReader grid, string entityTypeName)
        {
            var tagDictionary = new Dictionary<long, EntityTagListDto>();

            _ = grid.Read<EntityTagListDto, TagDto, EntityTagListDto>(
                (entity, tag) =>
                {
                    if (!tagDictionary.TryGetValue(entity.EntityId, out EntityTagListDto entityTagList))
                    {
                        entityTagList = entity;
                        entity.EntityTypeName = entityTypeName;
                        tagDictionary.Add(entity.EntityId, entityTagList);
                    }

                    if (entityTagList.Tags == null)
                    {
                        entityTagList.Tags = new List<TagDto>();
                    }

                    if (tag != null && !entityTagList.Tags.Any(t => t.TagValueId == tag.TagValueId && t.TypeName == tag.TypeName))
                    {
                        entityTagList.Tags.Add(tag);
                    }

                    return entityTagList;
                },
                "TagValueId");

            return tagDictionary.Select(t => t.Value).ToList();
        }

        private void CheckParameter(EntityTagListDto tags)
        {
            if (tags == null)
            {
                throw new ArgumentNullException(nameof(tags));
            }
        }

        private void CheckListTagsByEntitiesInput(string entityTypeName, string entityExternalIds)
        {
            if (string.IsNullOrEmpty(entityTypeName))
            {
                throw new ArgumentNullException(nameof(entityTypeName));
            }

            if (string.IsNullOrEmpty(entityExternalIds))
            {
                throw new ArgumentNullException(nameof(entityExternalIds));
            }
        }

        private void CheckListEntitiesByTagsInput(EntityTagListDto tags)
        {
            if (tags == null)
            {
                throw new ArgumentNullException(nameof(tags));
            }
        }

        private DataTable ConvertToEntityTagsToUDTT(EntityTagListDto entity)
        {
            DataTable udtt = new DataTable();
            udtt.SetTypeName("[CrossCutting].[UDTT_EntityTag]");

            DataColumn entityId = new DataColumn("EntityId", typeof(int));
            udtt.Columns.Add(entityId);

            DataColumn entityExternalId = new DataColumn("EntityExternalId", typeof(string));
            udtt.Columns.Add(entityExternalId);

            DataColumn entityTypeName = new DataColumn("EntityTypeName", typeof(string));
            udtt.Columns.Add(entityTypeName);

            DataColumn isDeactivated = new DataColumn("IsDeactivated", typeof(bool));
            udtt.Columns.Add(isDeactivated);

            DataColumn tagValueId = new DataColumn("TagValueId", typeof(string));
            udtt.Columns.Add(tagValueId);

            DataColumn tagTypeName = new DataColumn("TagTypeName", typeof(string));
            udtt.Columns.Add(tagTypeName);

            if (entity.Tags != null && entity.Tags.Any())
            {
                List<TagDto> splitTags = SplitTags(entity.Tags);
                entity.Tags = splitTags;

                foreach (var tag in entity.Tags)
                {
                    var row = udtt.NewRow();
                    row[entityId] = entity.EntityId;
                    row[entityExternalId] = entity.EntityExternalId;
                    row[entityTypeName] = entity.EntityTypeName;
                    row[isDeactivated] = entity.IsDeactivated;
                    row[tagValueId] = tag.TagValueId;
                    row[tagTypeName] = tag.TypeName;
                    udtt.Rows.Add(row);
                }
            }
            else
            {
                var row = udtt.NewRow();
                row[entityId] = entity.EntityId;
                row[entityExternalId] = entity.EntityExternalId;
                row[entityTypeName] = entity.EntityTypeName;
                row[isDeactivated] = entity.IsDeactivated;
                udtt.Rows.Add(row);
            }

            return udtt;
        }

        private List<TagDto> SplitTags(List<TagDto> tagsCombined)
        {
            List<TagDto> result = new List<TagDto>();

            foreach (var itemTag in tagsCombined)
            {
                if (itemTag != null)
                {
                    string[] lstValues = itemTag.TagValueId.Split(',');
                    foreach (var itemValue in lstValues)
                    {
                        TagDto itemTagDto = new TagDto();
                        itemTagDto.TypeName = itemTag.TypeName;
                        itemTagDto.TagValueId = itemValue;
                        result.Add(itemTagDto);
                    }
                }
            }

            return result;
        }

        private static class StoredProcedureNames
        {
            internal const string CreateTags = "[Crosscutting].[usp_CreateEntityTag]";
            internal const string UpdateTags = "[Crosscutting].[usp_UpdateEntityTag]";
            internal const string DeleteEntity = "[Crosscutting].[usp_DeleteEntity]";
            internal const string ListTagsByEntities = "[Crosscutting].[usp_ListTagsByEntities]";
            internal const string ListEntitiesByTags = "[Crosscutting].[usp_ListEntitiesByTags]";
            internal const string ListEntitiesById = "[Crosscutting].[usp_ListEntitiesById]";
        }
    }
}
