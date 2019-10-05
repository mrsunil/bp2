using LDC.Atlas.Application.Common.Tags.Dto;
using LDC.Atlas.Document.Common.Entities;
using LDC.Atlas.Document.Common.Services;
using LDC.Atlas.Services.Document.Application.Queries;
using LDC.Atlas.Services.Document.Application.Queries.Dto;
using LDC.Atlas.Services.Document.Infrastructure.Policies;
using LDC.Atlas.Services.Document.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Document.Controllers
{
    [Route("api/v1/document/{company}/[controller]")]
    [ApiController]
    [Produces(MediaTypeNames.Application.Json)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ResponseCache(CacheProfileName = "Never")]
    [Authorize]
    public class TemplateManagementController : ControllerBase
    {
        private readonly ITagServiceForContractAdvice tagServiceForContractAdvice;
        private readonly IPhysicalDocumentGenerationService physicalDocumentGenerationService;
        private readonly ITemplateParametersQueries templateParametersQueries;

        public TemplateManagementController(
            ITagServiceForContractAdvice tagService,
            IPhysicalDocumentGenerationService physicalDocumentGenerationService,
            ITemplateParametersQueries templateParametersQueries)
        {
            this.tagServiceForContractAdvice = tagService;
            this.physicalDocumentGenerationService = physicalDocumentGenerationService;
            this.templateParametersQueries = templateParametersQueries;
        }

        /// <summary>
        /// Returns all template parameters.
        /// </summary>
        /// <param name="company">Company</param>
        /// <returns>All template parameters.</returns>
        [HttpGet("templateparameters")]
        //[Authorize(Policies.CanReadTemplatesPolicy)]
        [ProducesResponseType(typeof(IEnumerable<TemplateParameterDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<TemplateParameterDto>>> GetAllTemplateParametersAsync(string company)
        {
            var result = await templateParametersQueries.GetAllTemplateParametersAsync(company);

            return Ok(result);
        }

        /// <summary>
        /// Create tags for one or several documents
        /// </summary>
        /// <param name="company">Company code.</param>
        /// <param name="request">Dto to create tags for a template.</param>
        /// <returns>A <see cref="Task"/> representing the asynchronous operation.</returns>
        [HttpPost]
        [Consumes(MediaTypeNames.Application.Json)]
        [Authorize(Policies.CanManageTemplatesPolicy)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> CreateOrUpdateTagsForContractAdviceTemplatesAsync(string company, [FromBody, Required] IEnumerable<CreateOrUpdateTagsForTemplatesDto> request)
        {
            await tagServiceForContractAdvice.CreateOrUpdateTagsForContractAdviceTemplatesAsync(company, request);

            return Ok();
        }

        /// <summary>
        /// Deletes the entity and the tags associated to it.
        /// </summary>
        /// <param name="company">Company code.</param>
        /// <param name="entityId">Entity key of the deleted item.</param>
        /// <returns>A <see cref="Task"/> representing the asynchronous operation.</returns>
        [HttpDelete("{entityId:int}")]
        [Consumes(MediaTypeNames.Application.Json)]
        [Authorize(Policies.CanManageTemplatesPolicy)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult> DeleteTagsForContractAdviceTemplateAsync(string company, [Range(1, int.MaxValue)] int entityId)
        {
            await tagServiceForContractAdvice.DeleteContractAdviceTemplateAsync(company, entityId);

            return NoContent();
        }

        /// <summary>
        /// Returns templates with tags by company.
        /// </summary>
        /// <param name="company">Company id.</param>
        /// <returns>A <see cref="Task"/> representing the asynchronous operation.</returns>
        [HttpGet]
        [Authorize(Policies.CanReadTemplatesPolicy)]
        [ProducesResponseType(typeof(IEnumerable<TemplateWithTagsDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<TemplateWithTagsDto>>> GetContractAdviceTemplatesWithTagsByCompanyAsync(string company)
        {
            var templatesResult = new List<TemplateWithTagsDto>();

            var templates = await physicalDocumentGenerationService.GetTemplates(PhysicalDocumentType.ContractAdvice, company);

            if (templates.Any())
            {
                var templatesIds = templates.Select(t => t.Id).ToList();
                var entityTags = await tagServiceForContractAdvice.GetContractAdviceTemplateWithTagsByIdsAsync(company, templatesIds);

                foreach (var templateId in templatesIds)
                {
                    var entities = entityTags.Where(e => e.EntityExternalId == templateId).Distinct();

                    foreach (var entity in entities)
                    {
                        templatesResult.Add(
                            new TemplateWithTagsDto
                            {
                                EntityId = entity.EntityId,
                                EntityExternalId = entity.EntityExternalId,
                                Name = templates.FirstOrDefault(t => t.Id == templateId).Name,
                                Tags = entity.Tags,
                                IsDeactivated = entity.IsDeactivated
                            });
                    }
                }
            }

            return Ok(templatesResult);
        }
    }
}
