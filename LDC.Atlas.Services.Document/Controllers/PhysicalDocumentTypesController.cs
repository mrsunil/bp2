using LDC.Atlas.Document.Common.Entities;
using LDC.Atlas.Document.Common.Services;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Document.Entities;
using LDC.Atlas.Services.Document.Infrastructure.Policies;
using LDC.Atlas.Services.Document.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
    public class PhysicalDocumentTypesController : ControllerBase
    {
        private readonly IDocumentTypeRepository _documentTypeRepository;
        private readonly IAuthorizationService _authorizationService;
        private readonly IPhysicalDocumentGenerationService _physicalDocumentGenerationService;

        public PhysicalDocumentTypesController(IAuthorizationService authorizationService, IDocumentTypeRepository documentTypeRepository, IPhysicalDocumentGenerationService physicalDocumentGenerationService)
        {
            _authorizationService = authorizationService;
            _documentTypeRepository = documentTypeRepository;
            _physicalDocumentGenerationService = physicalDocumentGenerationService;
        }

        /// <summary>
        /// Returns the list of document types.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(CollectionViewModel<PhysicalDocumentTypeDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<PhysicalDocumentTypeDto>>> GetDocumentTypes()
        {
            var documentTypes = (await _documentTypeRepository.GetGeneratedDocumentTypesAsync()).ToList();

            var contractAdviceType = documentTypes.FirstOrDefault(t => t.PhysicalDocumentTypeId == (int)PhysicalDocumentType.ContractAdvice);
            var authorizationResult = await _authorizationService.AuthorizeAsync(User, Policies.GenerateContractAdvicePolicy);
            if (!authorizationResult.Succeeded)
            {
                documentTypes.Remove(contractAdviceType);
            }

            var response = new CollectionViewModel<PhysicalDocumentTypeDto>(documentTypes);

            return Ok(response);
        }

        /// <summary>
        /// Returns the list of templates for a document type.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="documentTypeId">The identifier of the document type.</param>
        /// <param name="module">To find specific to module</param>
        [HttpGet("{documentTypeId:long}/{module}/templates")]
        [ProducesResponseType(typeof(CollectionViewModel<PhysicalDocumentTemplateDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<CollectionViewModel<PhysicalDocumentTemplateDto>>> GetTemplates(
            string company,
            [Range(1, long.MaxValue)] long documentTypeId,
            string module)
        {
            var documentTemplates = await _physicalDocumentGenerationService.GetTemplates((PhysicalDocumentType)documentTypeId, company, true, module);

            var templates = documentTemplates
                .Select(i => new PhysicalDocumentTemplateDto
                 {
                     DocumentTemplateId = i.Id,
                     Name = i.Name,
                     Path = i.Path,
                     Description = i.Description,
                     CreatedDateTime = i.CreatedDateTime,
                     CreatedBy = i.CreatedBy,
                     ModifiedDateTime = i.ModifiedDateTime,
                     ModifiedBy = i.ModifiedBy
                 }).ToList();

            var response = new CollectionViewModel<PhysicalDocumentTemplateDto>(templates);

            return Ok(response);
        }
    }
}
