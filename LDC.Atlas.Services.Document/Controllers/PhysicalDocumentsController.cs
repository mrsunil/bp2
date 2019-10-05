using AutoMapper;
using LDC.Atlas.Application.Common.Configuration;
using LDC.Atlas.Application.Common.Tags.Dto;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.Document.Common.Dtos;
using LDC.Atlas.Document.Common.Entities;
using LDC.Atlas.Document.Common.Services;
using LDC.Atlas.Document.Common.Utils;
using LDC.Atlas.Infrastructure.Swagger;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Document.Application.Commands;
using LDC.Atlas.Services.Document.Application.Queries;
using LDC.Atlas.Services.Document.Infrastructure.Policies;
using LDC.Atlas.Services.Document.Repositories;
using LDC.Atlas.Services.Document.Services;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Net.Http.Headers;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.IO;
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
    public class PhysicalDocumentsController : ControllerBase
    {
        private readonly ILogger<PhysicalDocumentsController> _logger;
        private readonly IPhysicalDocumentGenerationService _physicalDocumentGenerationService;
        private readonly IDocumentRepository _documentRepository;
        private readonly IIdentityService _identityService;
        private readonly IPhysicalDocumentStorageService _physicalDocumentStorageService;
        private readonly IMapper _mapper;
        private readonly ISystemDateTimeService _systemDateTimeService;
        private readonly IDocumentQueries _documentQueries;
        private readonly IApplicationTableService _applicationTableQueries;
        private readonly IMediator _mediator;
        private readonly ITagServiceForContractAdvice _tagService;

        public PhysicalDocumentsController(
            ILogger<PhysicalDocumentsController> logger,
            IPhysicalDocumentGenerationService physicalDocumentGenerationService,
            IDocumentRepository documentRepository,
            IIdentityService identityService,
            IPhysicalDocumentStorageService physicalDocumentStorageService,
            IMapper mapper,
            ISystemDateTimeService systemDateTimeService,
            IDocumentQueries documentQueries,
            IApplicationTableService applicationTableQueries,
            IMediator mediator,
            ITagServiceForContractAdvice tagService)
        {
            _logger = logger;
            _physicalDocumentGenerationService = physicalDocumentGenerationService;
            _documentRepository = documentRepository;
            _identityService = identityService;
            _physicalDocumentStorageService = physicalDocumentStorageService;
            _mapper = mapper;
            _systemDateTimeService = systemDateTimeService;
            _documentQueries = documentQueries;
            _applicationTableQueries = applicationTableQueries;
            _mediator = mediator;
            _tagService = tagService;
        }

        /// <summary>
        /// Returns the list of generated documents.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="searchRequest">Request to search.</param>

        [HttpPost("documentGenerated")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<PhysicalDocumentSearchResultDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<PhysicalDocumentSearchResultDto>>> GetGeneratedDocuments(
           string company,
           EntitySearchRequest searchRequest)
        {
            var searchResult = await _documentQueries.GetPhysicalDocumentsAsync(company, searchRequest);

            var response = searchResult.ToPaginatedCollectionViewModel(searchRequest);

            return Ok(response);
        }

        /// <summary>
        /// Searches in the list of sections.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="searchRequest">The search request.</param>
        [HttpPost("search")]
        [ProducesResponseType(typeof(PaginatedCollectionViewModel<PhysicalDocumentSearchResultDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedCollectionViewModel<PhysicalDocumentSearchResultDto>>> SearchPhysicalContracts(
            string company,
            EntitySearchRequest searchRequest)
        {
            var searchResult = await _documentQueries.SearchPhysicalDocumentsAsync(company, searchRequest);

            var response = searchResult.ToPaginatedCollectionViewModel(searchRequest);

            return Ok(response);
        }

        /// <summary>
        /// Returns a generated document by its identifier.
        /// </summary>
        /// <param name="physicalDocumentId">The generated document identifier.</param>
        /// <param name="company">The company code.</param>
        [HttpGet("{physicalDocumentId:long}")]
        [ProducesResponseType(typeof(PhysicalDocumentDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult<PhysicalDocumentDto>> GetGeneratedDocumentById([Range(1, long.MaxValue)] long physicalDocumentId, string company)
        {
            var document = await _physicalDocumentStorageService.DownloadDocumentByIdAsync(physicalDocumentId, company);

            if (document != null)
            {
                HttpContext.Response.Headers.Add(HeaderNames.LastModified, document.CreatedDateTime.ToString("R", CultureInfo.InvariantCulture));

                return Ok(document);
            }

            return NoContent();
        }

        /// <summary>
        /// Download the contents of the primary stream (file) of a generated document.
        /// </summary>
        /// <param name="physicalDocumentId">The generated document identifier.</param>
        /// <param name="company">The company code.</param>
        [HttpGet("{physicalDocumentId:long}/content")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> GetGeneratedDocumentContent([Range(1, long.MaxValue)]long physicalDocumentId, string company)
        {
            var document = await _physicalDocumentStorageService.DownloadDocumentByIdAsync(physicalDocumentId, company);

            if (document?.FileContent != null)
            {
                return File(document.FileContent, document.MimeType, document.DocumentName);
            }

            return NoContent();
        }

        /// <summary>
        /// Download the contents of the primary stream (file) of a generated document.
        /// </summary>
        /// <param name="physicalDocumentId">The generated document identifier.</param>
        [HttpGet("drafts/{physicalDocumentId:long}/content")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> GetDraftDocumentContent([Range(1, long.MaxValue)]long physicalDocumentId)
        {
            var document = await _physicalDocumentStorageService.DownloadDraftDocumentByIdAsync(physicalDocumentId);

            if (document?.FileContent != null)
            {
                return File(document.FileContent, document.MimeType, document.DocumentName);
            }

            return NoContent();
        }

        /// <summary>
        /// Generate a new contract advice document.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="contractAdviceParameters">Parameters to generate contract advice document.</param>
        /// <response code="201">Document created.</response>
        [HttpPost("contractadvice/generate")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(PhysicalDocumentReferenceDto), StatusCodes.Status201Created)]
        [SwaggerResponseHeader(StatusCodes.Status201Created, HeaderNames.Location, "string", "Location of the newly created resource")]
        [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
        [Authorize(Policies.GenerateContractAdvicePolicy)]
        public async Task<ActionResult<PhysicalDocumentReferenceDto>> GenerateContractAdvice(
            string company,
            [FromBody, Required] GenerateContractAdviceCommand contractAdviceParameters)
        {
            var tables = await _applicationTableQueries.GetApplicationTablesAsync();
            contractAdviceParameters.CompanyId = company;
            contractAdviceParameters.TableId = tables.First(table => table.TableName == "Section").TableId;

            var documentId = await _mediator.Send(contractAdviceParameters);

            return CreatedAtAction(nameof(GetGeneratedDocumentById), new { physicalDocumentId = documentId }, new PhysicalDocumentReferenceDto { PhysicalDocumentId = documentId });
        }

        /// <summary>
        /// Upload a document.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="request">Parameters to identify resource associated with document.</param>
        /// <param name="file">The file object.</param>
        /// <response code="201">Document uploaded.</response>
        [HttpPost("upload")]
        [DisableRequestSizeLimit]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [SwaggerResponseHeader(StatusCodes.Status201Created, HeaderNames.Location, "string", "Location of the newly created resource")]
        public async Task<ActionResult<PhysicalDocumentReferenceDto>> UploadDocument(string company, [FromForm, Required] UploadDocumentCommand request, [FromForm, Required] IFormFile file)
        {
            long documentId;
            var tables = await _applicationTableQueries.GetApplicationTablesAsync(request.PhysicalDocumentTypeId.GetApplicationTableName());
            request.TableId = tables.First().TableId;

            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);
                request.CompanyId = company;
                request.DocumentName = request.DocumentName ?? file.FileName;
                request.File = stream.ToArray();

                documentId = await _mediator.Send(request);
            }

            return CreatedAtAction(nameof(GetGeneratedDocumentById), new { physicalDocumentId = documentId }, new PhysicalDocumentReferenceDto { PhysicalDocumentId = documentId });
        }

        /// <summary>
        /// Upload a draft document.
        /// </summary>
        /// <param name="company">The company code.</param>
        /// <param name="request">Parameters to identify resource associated with document.</param>
        /// <param name="file">The file object.</param>
        /// <response code="201">Document uploaded.</response>
        [HttpPost("drafts/upload")]
        [DisableRequestSizeLimit]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [SwaggerResponseHeader(StatusCodes.Status201Created, HeaderNames.Location, "string", "Location of the newly created resource")]
        public async Task<ActionResult<PhysicalDocumentReferenceDto>> UploadDraftDocument(string company, [FromForm, Required] UploadDocumentCommand request, [FromForm, Required] IFormFile file)
        {
            long documentId;
            var tables = await _applicationTableQueries.GetApplicationTablesAsync(request.PhysicalDocumentTypeId.GetApplicationTableName());
            request.TableId = tables.First().TableId;

            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);
                request.CompanyId = company;
                request.DocumentName = request.DocumentName ?? file.FileName;
                request.IsDraft = true;
                request.File = stream.ToArray();

                documentId = await _mediator.Send(request);
            }

            return CreatedAtAction(nameof(GetGeneratedDocumentById), new { physicalDocumentId = documentId }, new PhysicalDocumentReferenceDto { PhysicalDocumentId = documentId });
        }

        /// <summary>
        /// Get a list of document templates by tags, ordered by BestMatch.
        /// </summary>
        /// <param name="company">Company Id.</param>
        /// <param name="request">Tags to filter.</param>
        /// <returns>A <see cref="Task{TResult}"/> representing the result of the asynchronous operation.</returns>
        [HttpPost("templates/contractadvice/tags")]
        [ProducesResponseType(typeof(IEnumerable<TemplatesBestMatchDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetContractAdviceTemplatesByTags(string company, [FromBody, Required] IEnumerable<TagDto> request)
        {
            List<TemplatesBestMatchDto> templateList = new List<TemplatesBestMatchDto>();

            IEnumerable<EntitiesBestMatchDto> result = await _tagService.ListContractAdviceTemplatesByTagsAsync(company, request);
            var documentTemplates = await _physicalDocumentGenerationService.GetTemplates(PhysicalDocumentType.ContractAdvice, company, true);

            foreach (var item in result.ToList())
            {
                var template = documentTemplates.FirstOrDefault(x => x.Id == item.EntityExternalId);
                if (template == null)
                {
                    continue;
                }

                templateList.Add(new TemplatesBestMatchDto()
                {
                    EntityId = item.EntityId,
                    PhysicalDocumentId = item.EntityExternalId,
                    BestMatch = item.BestMatch,
                    Name = template.Name,
                    Description = template.Description
                });
            }

            return this.Ok(templateList);
        }
    }
}
