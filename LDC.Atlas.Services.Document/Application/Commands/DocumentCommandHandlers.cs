using AutoMapper;
using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.Document.Common.Entities;
using LDC.Atlas.Document.Common.Services;
using LDC.Atlas.Infrastructure.Services;
using LDC.Atlas.Services.Document.Entities;
using LDC.Atlas.Services.Document.Infrastructure.Policies;
using LDC.Atlas.Services.Document.Repositories;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Document.Application.Commands
{
    public class DocumentCommandHandlers
        : IRequestHandler<GenerateContractAdviceCommand, long>,
        IRequestHandler<UploadDocumentCommand, long>
    {
        private readonly IPhysicalDocumentGenerationService _physicalDocumentGenerationService;
        private readonly IPhysicalDocumentStorageService _physicalDocumentStorageService;
        private readonly IIdentityService _identityService;
        private readonly ISystemDateTimeService _systemDateTimeService;
        private readonly IDocumentRepository _documentRepository;
        private readonly ILogger<DocumentCommandHandlers> _logger;
        private readonly IAuthorizationService _authorizationService;
        private readonly IMapper _mapper;

        public DocumentCommandHandlers(
            IPhysicalDocumentGenerationService physicalDocumentGenerationService,
            IPhysicalDocumentStorageService physicalDocumentStorageService,
            IIdentityService identityService,
            ISystemDateTimeService systemDateTimeService,
            IDocumentRepository documentRepository,
            ILogger<DocumentCommandHandlers> logger,
            IAuthorizationService authorizationService,
            IMapper mapper)
        {
            _physicalDocumentGenerationService = physicalDocumentGenerationService;
            _physicalDocumentStorageService = physicalDocumentStorageService;
            _identityService = identityService;
            _systemDateTimeService = systemDateTimeService;
            _documentRepository = documentRepository;
            _logger = logger;
            _authorizationService = authorizationService;
            _mapper = mapper;
        }

        public async Task<long> Handle(GenerateContractAdviceCommand request, CancellationToken cancellationToken)
        {
            var authorizationResult = await _authorizationService.AuthorizeAsync(_identityService.GetUser(), Policies.GenerateContractAdvicePolicy);
            if (!authorizationResult.Succeeded)
            {
                throw new AtlasSecurityException("One or more privileges are required to perform this action.");
            }

            var template = await _physicalDocumentGenerationService.GetTemplateByPath(request.DocumentTemplatePath, PhysicalDocumentType.ContractAdvice, request.CompanyId);

            if (template == null)
            {
                throw new AtlasBusinessException($"Cannot find requested template: {request.DocumentTemplatePath}");
            }

            var contractAdviceInfo = await _documentRepository.GetContractAdviceInfoAsync(request.SectionId, request.CompanyId);

            var reportParameters = new Dictionary<string, string>
            {
                { "CompanyId", request.CompanyId },
                { "PhysicalContractId", contractAdviceInfo.PhysicalContractId.ToString(CultureInfo.InvariantCulture) }
            };

            var documentResponse = await _physicalDocumentGenerationService.GenerateDocument(request.DocumentTemplatePath, reportParameters, PhysicalDocumentFormat.WORDOPENXML);

            var companyDate = await _systemDateTimeService.GetCompanyDate(request.CompanyId);
            string counterPartyCode = contractAdviceInfo.Type == ContractType.Purchase ? contractAdviceInfo.SellerCode : contractAdviceInfo.BuyerCode;

            var documentName = $"{companyDate.ToString("yyyyMMdd_HHMMss", CultureInfo.InvariantCulture)}_{request.CompanyId}_CONADV_{request.SectionId}_PREVIEW_{counterPartyCode}_{_identityService.GetUserName()}.{documentResponse.Extension}";

            // Save document in database
            var documentId = await _physicalDocumentStorageService.UploadDocument(
                new UploadDocumentParameters
                {
                    CompanyId = request.CompanyId,
                    DocumentName = documentName,
                    File = documentResponse.Result,
                    DocumentTemplatePath = template.Path,
                    PhysicalDocumentTypeId = PhysicalDocumentType.ContractAdvice,
                    PhysicalDocumentStatus = PhysicalDocumentStatus.New,
                    RecordId = request.SectionId,
                    TableId = request.TableId,
                    IsDraft = true
                });

            _logger.LogInformation("Document with id {Atlas_DocumentId} has been created by user {Atlas_UserId}.", documentId, _identityService.GetUserName());

            return documentId;
        }

        public async Task<long> Handle(UploadDocumentCommand request, CancellationToken cancellationToken)
        {
            if (request.RecordId < 0)
            {
                throw new AtlasBusinessException("Record ID is invalid.");
            }

            var uploadParameters = _mapper.Map<UploadDocumentParameters>(request);
            return await _physicalDocumentStorageService.UploadDocument(uploadParameters);
        }
    }
}
