using AutoMapper;
using LDC.Atlas.Application.Common.Configuration;
using LDC.Atlas.Application.Core.Entities;
using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Document.Common.Dtos;
using LDC.Atlas.Document.Common.Entities;
using LDC.Atlas.Document.Common.OpenXml;
using LDC.Atlas.Document.Common.Services;
using LDC.Atlas.Document.Common.Utils;
using LDC.Atlas.MasterData.Common;
using LDC.Atlas.Services.Execution.Application.Queries;
using LDC.Atlas.Services.Execution.Entities;
using LDC.Atlas.Services.Execution.Infrastructure.Policies;
using LDC.Atlas.Services.Execution.Repositories;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Application.Commands
{
    public class InvoiceCommandsHandler : IRequestHandler<CreateInvoiceCommand, InvoiceRecord>,
        IRequestHandler<CreateTransactionDocumentCommand, TransactionCreationResponse>,
        IRequestHandler<UpdateInvoiceDocumentCommand, PhysicalDocumentReferenceDto>
    {
        private readonly ILogger<InvoiceCommandsHandler> _logger;
        private readonly IPhysicalDocumentStorageService _physicalDocumentStorageService;
        private readonly IPhysicalDocumentGenerationService _physicalDocumentGenerationService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IInvoiceRepository _invoiceRepository;
        private readonly IIdentityService _identityService;
        private readonly ISystemDateTimeService _systemDateTimeService;
        private readonly IApplicationTableService _applicationTableQueries;
        private readonly IMapper _mapper;
        private readonly IProcessMessageService _processMessageService;
        private readonly IAuthorizationService _authorizationService;
        private Func<byte[], IWordDocument> _getWordDocument;
        private readonly IAccountingSetUpQueries _accountingQueries;
        private readonly IMasterDataService _masterDataService;

        public InvoiceCommandsHandler(
            ILogger<InvoiceCommandsHandler> logger,
            IPhysicalDocumentStorageService physicalDocumentStorageService,
            IPhysicalDocumentGenerationService physicalDocumentGenerationService,
            ISystemDateTimeService systemDateTimeService,
            IUnitOfWork unitOfWork,
            IInvoiceRepository invoiceRepository,
            IIdentityService identityService,
            IApplicationTableService applicationTableQueries,
            IMapper mapper,
            IProcessMessageService processMessageService,
            IAuthorizationService authorizationService,
            IAccountingSetUpQueries accountingQueries,
            IMasterDataService masterDataService)
        {
            _invoiceRepository = invoiceRepository ?? throw new ArgumentNullException(nameof(invoiceRepository));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _physicalDocumentStorageService = physicalDocumentStorageService ?? throw new ArgumentNullException(nameof(physicalDocumentStorageService));
            _physicalDocumentGenerationService = physicalDocumentGenerationService ?? throw new ArgumentNullException(nameof(physicalDocumentGenerationService));
            _systemDateTimeService = systemDateTimeService ?? throw new ArgumentNullException(nameof(systemDateTimeService));
            _applicationTableQueries = applicationTableQueries ?? throw new ArgumentNullException(nameof(applicationTableQueries));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _processMessageService = processMessageService;
            _authorizationService = authorizationService;
            _accountingQueries = accountingQueries;
            _masterDataService = masterDataService ?? throw new ArgumentNullException(nameof(masterDataService));
        }

        internal Func<byte[], IWordDocument> GetWordDocument { get { return _getWordDocument ?? ((b) => { return new WordDocument(b); }); } set => _getWordDocument = value; }

        /// <summary>
        /// Creation of an invoie OR a REVERSAL of an invoice
        /// </summary>
        /// <param name="request">Request</param>
        /// <param name="cancellationToken">cancellation token</param>
        /// <returns>Task Invoice Record</returns>
        public async Task<InvoiceRecord> Handle(CreateInvoiceCommand request, CancellationToken cancellationToken)
        {
            var invoice = _mapper.Map<InvoiceRecord>(request);

            var newInvoiceLines = invoice.InvoiceLines;

            var companyDate = await _systemDateTimeService.GetCompanyDate(request.CompanyId);

            if (request.InvoiceType == InvoiceType.Reversal)
            {
                _unitOfWork.BeginTransaction();
                try
                {
                    invoice.InvoiceDocumentType = request.IsDraft ? InvoiceDocumentType.Draft : InvoiceDocumentType.Reversal;

                    await GetInvoiceDocumentReferenceValueForReversal(invoice);

                    InvoiceRecord generatedInvoice = null;

                    if (request.IsDraft)
                    {
                        generatedInvoice = await _invoiceRepository.CreateDraftReversalInvoice(invoice);
                    }
                    else
                    {
                        generatedInvoice = await _invoiceRepository.CreateReversalInvoiceAsync(invoice);
                    }

                    if (generatedInvoice.InvoiceId != 0)
                    {
                        invoice = generatedInvoice;
                    }

                    if (generatedInvoice.IsPosted && !request.IsDraft)
                    {
                        await EnqueueMessage(generatedInvoice.TransactionDocumentId.ToString(CultureInfo.InvariantCulture), request.CompanyId);
                    }

                    // Process the document if the user has provided a specific one (via previous upload)
                    if (!request.IsDraft && request.PhysicalDocumentId != null)
                    {
                        var documentId = await ProcessUserDocument(request, invoice, companyDate);

                        invoice.PhysicalDocumentId = documentId;

                        // Update invoice in DB with document Id
                        await _invoiceRepository.UpdateInvoicePhysicalDocument(invoice.InvoiceId, documentId);
                    }

                    _unitOfWork.Commit();
                }
                catch (Exception)
                {
                    _unitOfWork.Rollback();
                    throw;
                }
            }
            else
            {
                _unitOfWork.BeginTransaction();
                try
                {
                    // Added case to validate if Nominal Account Code is null for when IsATradeCost = true for any cost
                    // Raise error in this case
                    var lstofCostTypeId = request.InvoiceLines.Select(lines => lines.CostId).Where(cost => cost != null);

                    if (lstofCostTypeId.ToList().Count > 0)
                    {
                        var lstOfCostType = await _masterDataService.GetCostTypesAsync(request.CompanyId);

                        string errorMessage = string.Empty;

                        var costType = lstOfCostType.Where(cost => lstofCostTypeId.Any(costId => costId == cost.CostTypeId) && cost.IsATradeCost && cost.NominalAccountId == null).Select(cost => cost.CostTypeCode);

                        errorMessage = string.Join(", ", costType.ToArray());

                        if (errorMessage.Length > 0)
                        {

                            errorMessage = "Cost " + errorMessage + " has no nominal account in database. Please contact support.";

                            throw new Exception(errorMessage);
                        }
                    }

                    invoice.InvoiceDocumentType = request.IsDraft ? InvoiceDocumentType.Draft : InvoiceDocumentType.Invoice;

                    // For InvoiceTypes Cost, Washout & Goods-Costs, insert the newly added lines of Cost to Trade.Costs
                    if (!(request.InvoiceType == InvoiceType.Reversal))
                    {
                        if (invoice.InvoiceLines.Any(invoiceLine => invoiceLine.SectionId == null))
                        {
                            newInvoiceLines = await (request.InvoiceType == InvoiceType.Washout ? AddCostLinesForWashout(invoice.InvoiceLines, request.CompanyId) :
                                AddCostLines(invoice.InvoiceLines, request.CompanyId, request.InvoiceType, request.IsDraft));
                        }
                        else
                        {
                            for (int i = 0; i < invoice.InvoiceLines.Count(); i++)
                            {
                                invoice.InvoiceLines.ToArray()[i].LineNumber = i + 1;
                            }
                        }
                    }

                    if (invoice.InvoiceType == InvoiceType.Cancelled)
                    {
                        invoice.TotalInvoiceValue = invoice.CostDirection == CostDirection.Receivable ? newInvoiceLines.Sum(x => x.LineAmount) : -newInvoiceLines.Sum(x => x.LineAmount);
                    }
                    else
                    {
                        CalculateBalancedTotalAmount(invoice, newInvoiceLines);
                    }

                    // Generate document reference
                    await GetInvoiceDocumentReferenceValue(invoice);

                    // Create the invoice
                    await _invoiceRepository.CreateInvoiceAsync(invoice, newInvoiceLines.Any() ? newInvoiceLines : invoice.InvoiceLines);

                    if (!request.IsDraft)
                    {
                        await EnqueueMessage(invoice.TransactionDocumentId.ToString(CultureInfo.InvariantCulture), request.CompanyId);
                    }

                    // Process the document if the user has provided a specific one (via previous upload)
                    if (!request.IsDraft && request.PhysicalDocumentId != null)
                    {
                        var documentId = await ProcessUserDocument(request, invoice, companyDate);

                        invoice.PhysicalDocumentId = documentId;

                        // Update invoice in DB with document Id
                        await _invoiceRepository.UpdateInvoicePhysicalDocument(invoice.InvoiceId, documentId);
                    }

                    _unitOfWork.Commit();
                }
                catch (Exception)
                {
                    _unitOfWork.Rollback();
                    throw;
                }
            }

            // Generate physical document
            _unitOfWork.BeginTransaction();
            try
            {
                // We create a physical document based on the specified template
                if (request.PhysicalDocumentId == null && !string.IsNullOrEmpty(request.Template))
                {
                    var documentId = await GenerateInvoiceDocument(request, invoice, companyDate, false);

                    invoice.PhysicalDocumentId = documentId;

                    if (!request.IsDraft)
                    {
                        // Update invoice in DB with document Id
                        await _invoiceRepository.UpdateInvoicePhysicalDocument(invoice.InvoiceId, documentId);
                    }
                }

                // The user has provided a document (via previous upload)
                else if (!request.IsDraft && request.PhysicalDocumentId != null)
                {
                    // Generate the preview document
                    var previewDocumentId = await GenerateInvoiceDocument(request, invoice, companyDate, true);

                    invoice.PreviewPhysicalDocumentId = previewDocumentId;
                }

                _unitOfWork.Commit();
            }
            catch (Exception)
            {
                _unitOfWork.Rollback();

                // TODO: Rollback invoice creation if not draft
                throw;
            }

            _logger.LogInformation("New goods invoice created with id {Atlas_InvoiceId}.", invoice.InvoiceId);

            return invoice;
        }

        private async Task<long> ProcessUserDocument(CreateInvoiceCommand request, InvoiceRecord invoice, DateTime companyDate)
        {
            // Load user document from DB
            var document = await _physicalDocumentStorageService.DownloadDraftDocumentByIdAsync(request.PhysicalDocumentId.Value);

            if (document?.FileContent == null)
            {
                throw new NotFoundException("PhysicalDocument", request.PhysicalDocumentId.Value);
            }

            var wordHelper = GetWordDocument(document.FileContent);

            // Check if the document is valid
            CheckDocumentValidity(document, invoice, wordHelper);

            // Replace document placeholder with invoice document reference
            var isMatch = wordHelper.SearchAndReplace(System.Text.RegularExpressions.Regex.Escape("[DOCUMENT_REFERENCE]"), invoice.DocumentReference);

            if (!isMatch)
            {
                throw new AtlasBusinessException("The selected document format does not allow to add the document reference. The invoice has not been created. Please repeat the operation with another document or choose another option.");
            }

            var physicalDocumentType = MapInvoiceTypeToPhysicalDocumentType(invoice.InvoiceType);

            // Add metadata inside the document
            wordHelper.AddCustomXmlPart(new InvoiceDocumentMetadata { InvoiceId = invoice.InvoiceId, Company = invoice.CompanyId, UserName = _identityService.GetUserName() });

            var documentName = $"{companyDate.ToString("yyyyMMdd_HHMMss", CultureInfo.InvariantCulture)}_{invoice.CompanyId}_{Enum.GetName(typeof(InvoiceType), invoice.InvoiceType)}_{invoice.CounterpartyCode}{document.DocumentExtension}";

            var table = (await _applicationTableQueries.GetApplicationTablesAsync(physicalDocumentType.GetApplicationTableName())).FirstOrDefault();

            if (table == null)
            {
                throw new AtlasTechnicalException($"Table \"{physicalDocumentType.GetApplicationTableName()}\" not found in application tables.");
            }

            // Save the document in DB
            var documentId = await _physicalDocumentStorageService.UploadDocument(new UploadDocumentParameters
            {
                CompanyId = request.CompanyId,
                DocumentName = documentName,
                File = wordHelper.GetFile(),
                DocumentTemplatePath = document.DocumentTemplate,
                PhysicalDocumentTypeId = physicalDocumentType,
                PhysicalDocumentStatus = PhysicalDocumentStatus.New,
                RecordId = invoice.InvoiceId,
                TableId = await GetApplicationTableId(physicalDocumentType),
            });

            return documentId;
        }

        /// <summary>
        /// Calculation of the total of the invoice based on the lines.
        /// Algorithm also applied in UpdateAccountingDocumentStatusToPostedCommandHandler.UpdateDocumentRates
        /// </summary>
        /// <param name="invoice">Invoice</param>
        /// <param name="newInvoiceLines">List of invoice lines</param>
        private void CalculateBalancedTotalAmount(InvoiceRecord invoice, IEnumerable<InvoiceLineRecord> newInvoiceLines)
        {
            invoice.TotalInvoiceValue = 0;

            if (newInvoiceLines.Any())
            {
                foreach (var lines in newInvoiceLines)
                {
                    lines.LineAmount = Math.Round(lines.LineAmount, 2);
                    lines.VATAmount = Math.Round(lines.VATAmount, 2);
                    if (lines.CostId != null)
                    {
                        if (lines.CostDirectionId == (int)CostDirection.Payable)
                        {
                            invoice.TotalInvoiceValue = invoice.TotalInvoiceValue - lines.LineAmount;
                        }
                        else
                        {
                            invoice.TotalInvoiceValue = invoice.TotalInvoiceValue + lines.LineAmount;
                        }
                    }
                    else
                    {
                        if (lines.ContractType == ContractType.Purchase)
                        {
                            invoice.TotalInvoiceValue = invoice.TotalInvoiceValue == 0 ? lines.LineAmount : invoice.TotalInvoiceValue - lines.LineAmount;
                        }
                        else
                        {
                            invoice.TotalInvoiceValue = invoice.TotalInvoiceValue + lines.LineAmount;
                        }
                    }
                }
            }
            else if (invoice.InvoiceLines.Any())
            {
                foreach (var lines in invoice.InvoiceLines)
                {
                    lines.LineAmount = Math.Round(lines.LineAmount, 2);
                    lines.VATAmount = Math.Round(lines.VATAmount, 2);
                    if (lines.CostId != null)
                    {
                        if (lines.CostDirectionId == (int)CostDirection.Payable)
                        {
                            invoice.TotalInvoiceValue = invoice.TotalInvoiceValue - lines.LineAmount;
                        }
                        else
                        {
                            invoice.TotalInvoiceValue = invoice.TotalInvoiceValue + lines.LineAmount;
                        }
                    }
                    else
                    {
                        invoice.TotalInvoiceValue = invoice.TotalInvoiceValue + lines.LineAmount;
                    }
                }
            }
        }

        public async Task<PhysicalDocumentReferenceDto> Handle(UpdateInvoiceDocumentCommand request, CancellationToken cancellationToken)
        {
            var draftDocument = await _physicalDocumentStorageService.DownloadDraftDocumentByIdAsync(request.DraftDocumentId);
            if (draftDocument?.FileContent == null)
            {
                throw new AtlasBusinessException("Document has not found.");
            }

            var invoice = await _invoiceRepository.GetInvoiceByIdAsync(request.InvoiceId);
            if (invoice == null)
            {
                throw new AtlasBusinessException("Invoice has not found.");
            }

            var validPreviewDocumentName = $"{request.Company}_{Enum.GetName(typeof(InvoiceType), invoice.InvoiceType)}_PREVIEW_{invoice.CounterpartyCode}";
            var validDocumentName = $"{request.Company}_{Enum.GetName(typeof(InvoiceType), invoice.InvoiceType)}_{invoice.CounterpartyCode}";
            if (!draftDocument.DocumentName.Contains(validPreviewDocumentName, StringComparison.InvariantCultureIgnoreCase) &&
                !draftDocument.DocumentName.Contains(validDocumentName, StringComparison.InvariantCultureIgnoreCase))
            {
                throw new AtlasBusinessException("The uploaded file is invalid, the filename has been modified. Please upload the document with the original filename.");
            }

            var companyDate = await _systemDateTimeService.GetCompanyDate(request.Company);
            var documentName = $"{companyDate.ToString("yyyyMMdd_HHMMss", CultureInfo.InvariantCulture)}_{request.Company}_{Enum.GetName(typeof(InvoiceType), invoice.InvoiceType)}_{invoice.CounterpartyCode}{draftDocument.DocumentExtension}";

            var physicalDocumentType = MapInvoiceTypeToPhysicalDocumentType(invoice.InvoiceType);

            var documentId = await _physicalDocumentStorageService.UploadDocument(new UploadDocumentParameters
            {
                CompanyId = request.Company,
                DocumentName = documentName,
                File = draftDocument.FileContent,
                DocumentTemplatePath = draftDocument.DocumentTemplate,
                PhysicalDocumentTypeId = physicalDocumentType,
                PhysicalDocumentStatus = PhysicalDocumentStatus.New,
                RecordId = request.InvoiceId,
                TableId = await GetApplicationTableId(physicalDocumentType),
            });

            if (invoice.PhysicalDocumentId == request.PhysicalDocumentId)
            {
                await _invoiceRepository.UpdateInvoicePhysicalDocument(request.InvoiceId, documentId);
            }

            await _physicalDocumentStorageService.UpdateDocumentStatus(request.PhysicalDocumentId, PhysicalDocumentStatus.Deprecated);

            return new PhysicalDocumentReferenceDto { PhysicalDocumentId = documentId };
        }

        /// <summary>
        /// Creation of the REVERSAL of a transaction document (the name of the command here is misleading)
        /// </summary>
        /// <param name="request">request</param>
        /// <param name="cancellationToken">Cancellation token</param>
        public async Task<TransactionCreationResponse> Handle(CreateTransactionDocumentCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                string documentLabel = string.Empty;
                string year = string.Empty;
                int transactionDocumentTypeId = request.TransactionDocumentTypeId;
                int documentReferenceYear = 0;
                string documentReferenceYearValue = string.Empty;
                CommonRules commonRules = new CommonRules(_accountingQueries, _authorizationService, _identityService);
                documentReferenceYear = await commonRules.GetDocumentReferenceYear(request.DocumentDate, request.Company);
                documentReferenceYearValue = documentReferenceYear.ToString(System.Globalization.CultureInfo.InvariantCulture).Substring(2, 2);
                documentLabel = Enum.GetName(typeof(MasterDocumentType), transactionDocumentTypeId);
                year = DateTime.UtcNow.Year.ToString(CultureInfo.InvariantCulture).Substring(2, 2);


                int referencenumber = await _invoiceRepository.GetInvoiceDocumentReferenceValues(request.Company, transactionDocumentTypeId, documentReferenceYear);
                int yearNumber = referencenumber;
                int docYear = DateTime.UtcNow.Year;

                string documentReference = string.Concat(documentLabel, year, string.Format(CultureInfo.InvariantCulture, "{0:D5}", referencenumber));

                var objResponse = await _invoiceRepository.CreateTransactionDocument(
                    request.TransactionDocumentTypeId,
                    request.DocumentDate,
                    request.CurrencyCode,
                    request.AuthorizedForPosting,
                    request.PhysicalDocumentId,
                    documentReference,
                    yearNumber,
                    documentReferenceYear,
                    request.Company,
                    request.ToInterface);

                objResponse.DocumentReference = documentReference;

                // Creation of the "reversal" record
                await _invoiceRepository.InsertReversalTransactionMapping(request.TransactionDocumentId, objResponse.TransactionDocumentId, request.Company);

                // Update of the status "isreversed" for the original document
                await _invoiceRepository.UpdateDocumentTypeForDocumentReversal(request.TransactionDocumentId, request.Company);
                await EnqueueMessage(objResponse.TransactionDocumentId.ToString(CultureInfo.InvariantCulture), request.Company);

                _unitOfWork.Commit();

                return objResponse;
            }
            catch
            {
                _unitOfWork.Rollback();

                throw;
            }
        }

        private void CheckDocumentValidity(PhysicalDraftDocumentDto document, InvoiceRecord newInvoice, IWordDocument wordHelper)
        {
            if (document.PhysicalDocumentTypeId != (int)PhysicalDocumentType.InvoiceGoodsInvoice
                && document.PhysicalDocumentTypeId != (int)PhysicalDocumentType.InvoiceCostsInvoice
                && document.PhysicalDocumentTypeId != (int)PhysicalDocumentType.InvoiceGoodsCostInvoice
                && document.PhysicalDocumentTypeId != (int)PhysicalDocumentType.InvoiceWashout
                && document.PhysicalDocumentTypeId != (int)PhysicalDocumentType.InvoiceCancellation)
            {
                throw new AtlasBusinessException($"The provided document is not of type invoice.");
            }

            var documentName = $"{newInvoice.CompanyId}_{Enum.GetName(typeof(InvoiceType), newInvoice.InvoiceType)}_PREVIEW_{newInvoice.CounterpartyCode}_{_identityService.GetUserName()}";

            if (!document.DocumentName.Contains(documentName, StringComparison.InvariantCultureIgnoreCase))
            {
                throw new AtlasBusinessException(PhysicalDocumentMessages.GenerateErrorMessage((PhysicalDocumentType)document.PhysicalDocumentTypeId, PhysicalDocumentErrors.Naming));
            }

            var metadata = wordHelper.GetCustomXmlPart<InvoiceDocumentMetadata>();

            if (metadata == null)
            {
                throw new AtlasBusinessException("The selected document has not been generated by Atlas. Please use a document originally created by Atlas.");
            }
        }

        private async Task<long> GenerateInvoiceDocument(CreateInvoiceCommand request, InvoiceRecord newInvoice, DateTime companyDate, bool isPreview)
        {
            var physicalDocumentType = MapInvoiceTypeToPhysicalDocumentType(request.InvoiceType);

            var template = await _physicalDocumentGenerationService.GetTemplateByPath(request.Template, physicalDocumentType, request.CompanyId);

            if (template == null)
            {
                throw new AtlasTechnicalException($"Cannot find requested template: {request.Template}");
            }

            // Generate the invoice physical document
            var reportParameters = new Dictionary<string, string>
            {
                { "Company", newInvoice.CompanyId },
                { "InvoiceId", newInvoice.InvoiceId.ToString(CultureInfo.InvariantCulture) },
                { "IsPreview", isPreview.ToString(CultureInfo.InvariantCulture) }
            };

            var documentResponse = await _physicalDocumentGenerationService.GenerateDocument(request.Template, reportParameters, PhysicalDocumentFormat.WORDOPENXML);

            string documentName;

            if (request.IsDraft)
            {
                documentName = $"{companyDate.ToString("yyyyMMdd_HHMMss", CultureInfo.InvariantCulture)}_{newInvoice.CompanyId}_{Enum.GetName(typeof(InvoiceType), newInvoice.InvoiceType)}_PREVIEW_{newInvoice.CounterpartyCode}_{_identityService.GetUserName()}.{documentResponse.Extension}";
            }
            else if (isPreview)
            {
                documentName = $"{companyDate.ToString("yyyyMMdd_HHMMss", CultureInfo.InvariantCulture)}_{newInvoice.CompanyId}_{Enum.GetName(typeof(InvoiceType), newInvoice.InvoiceType)}_PREVIEW_{newInvoice.CounterpartyCode}.{documentResponse.Extension}";
            }
            else
            {
                documentName = $"{companyDate.ToString("yyyyMMdd_HHMMss", CultureInfo.InvariantCulture)}_{newInvoice.CompanyId}_{Enum.GetName(typeof(InvoiceType), newInvoice.InvoiceType)}_{newInvoice.CounterpartyCode}.{documentResponse.Extension}";
            }

            // Add metadata inside the document
            var wordHelper = GetWordDocument(documentResponse.Result);

            wordHelper.AddCustomXmlPart(new InvoiceDocumentMetadata { InvoiceId = newInvoice.InvoiceId, Company = newInvoice.CompanyId, UserName = _identityService.GetUserName() });

            var table = (await _applicationTableQueries.GetApplicationTablesAsync(physicalDocumentType.GetApplicationTableName())).FirstOrDefault();

            if (table == null)
            {
                throw new AtlasTechnicalException($"Table \"{physicalDocumentType.GetApplicationTableName()}\" not found in application tables.");
            }

            // Save the document in DB
            var documentId = await _physicalDocumentStorageService.UploadDocument(new UploadDocumentParameters
            {
                CompanyId = request.CompanyId,
                DocumentName = documentName,
                File = wordHelper.GetFile(),
                DocumentTemplatePath = template.Path,
                PhysicalDocumentTypeId = physicalDocumentType,
                PhysicalDocumentStatus = isPreview ? PhysicalDocumentStatus.Preview : PhysicalDocumentStatus.New,
                RecordId = newInvoice.InvoiceId,
                TableId = await GetApplicationTableId(physicalDocumentType),
                IsDraft = request.IsDraft
            });

            return documentId;
        }

        /// <summary>
        /// This method will generate the document reference number based on InvoiceType
        /// e.x For Purchase Invoice: PI1800001
        ///     For Sale Invoice: SI1800001
        /// </summary>
        /// <param name="invoice">The invoice</param>
        private async Task GetInvoiceDocumentReferenceValue(InvoiceRecord invoice)
        {
            string documentLabel = string.Empty;
            int documentReferenceYear = 0;
            string documentReferenceYearValue = string.Empty;
            CommonRules commonRules = new CommonRules(_accountingQueries, _authorizationService, _identityService);
            documentReferenceYear = await commonRules.GetDocumentReferenceYear(invoice.InvoiceDate, invoice.CompanyId);
            documentReferenceYearValue = documentReferenceYear.ToString(System.Globalization.CultureInfo.InvariantCulture).Substring(2, 2);
            switch (invoice.InvoiceType)
            {
                case InvoiceType.CommercialPurchase:
                case InvoiceType.GoodsCostPurchase:
                    invoice.TransactionDocumentTypeId = (int)MasterDocumentType.PI;
                    documentLabel = MasterDocumentType.PI.ToString();
                    break;
                case InvoiceType.CommercialSale:
                case InvoiceType.GoodsCostSales:
                    invoice.TransactionDocumentTypeId = (int)MasterDocumentType.SI;
                    documentLabel = MasterDocumentType.SI.ToString();
                    break;
                case InvoiceType.Cost:
                case InvoiceType.CostReceivable:
                case InvoiceType.CostDebitNote:
                case InvoiceType.CostCreditNote:
                    switch (invoice.CostDirection)
                    {
                        case CostDirection.Payable:
                            if (invoice.DocumentType == TransactionDocumentType.PISI)
                            {
                                invoice.TransactionDocumentTypeId = (int)MasterDocumentType.PI;
                                documentLabel = MasterDocumentType.PI.ToString();
                                invoice.InvoiceType = InvoiceType.Cost;
                            }
                            else
                            {
                                invoice.TransactionDocumentTypeId = (int)MasterDocumentType.CN;
                                documentLabel = MasterDocumentType.CN.ToString();
                                invoice.InvoiceType = InvoiceType.CostCreditNote;
                            }

                            break;
                        case CostDirection.Receivable:
                            if (invoice.DocumentType == TransactionDocumentType.PISI)
                            {
                                invoice.TransactionDocumentTypeId = (int)MasterDocumentType.SI;
                                documentLabel = MasterDocumentType.SI.ToString();
                                invoice.InvoiceType = InvoiceType.CostReceivable;
                            }
                            else
                            {
                                invoice.TransactionDocumentTypeId = (int)MasterDocumentType.DN;
                                documentLabel = MasterDocumentType.DN.ToString();
                                invoice.InvoiceType = InvoiceType.CostDebitNote;
                            }

                            break;
                    }

                    break;
                case InvoiceType.Washout:
                case InvoiceType.Cancelled:
                    switch (invoice.CostDirection)
                    {
                        case CostDirection.Payable:

                            invoice.TransactionDocumentTypeId = (int)MasterDocumentType.CN;
                            documentLabel = MasterDocumentType.CN.ToString();
                            break;
                        case CostDirection.Receivable:
                            invoice.TransactionDocumentTypeId = (int)MasterDocumentType.DN;
                            documentLabel = MasterDocumentType.DN.ToString();
                            break;
                    }

                    break;
                default:
                    documentLabel = MasterDocumentType.PI.ToString();
                    break;
            }

            var result = await _invoiceRepository.GetInvoiceDocumentReferenceValues(invoice.CompanyId, invoice.TransactionDocumentTypeId, documentReferenceYear);
            string documentDateYear = invoice.InvoiceDate.Year.ToString(CultureInfo.InvariantCulture);
            invoice.YearNumber = result;
            invoice.DocumentReference = string.Concat(invoice.InvoiceDocumentType == InvoiceDocumentType.Draft ? $"D_{DateTime.UtcNow.ToString("yyyyMMddHHMMss", CultureInfo.InvariantCulture)}_" : string.Empty, documentLabel, documentReferenceYearValue, string.Format(CultureInfo.InvariantCulture, "{0:D5}", invoice.YearNumber));
        }

        private async Task GetInvoiceDocumentReferenceValueForReversal(InvoiceRecord invoice)
        {
            string documentLabel = string.Empty;
            int transactdocumentTypeId = invoice.TransactionDocumentTypeId;
            int documentReferenceYear = 0;
            string documentReferenceYearValue = string.Empty;
            CommonRules commonRules = new CommonRules(_accountingQueries, _authorizationService, _identityService);
            documentReferenceYear = await commonRules.GetDocumentReferenceYear(invoice.InvoiceDate, invoice.CompanyId);
            documentReferenceYearValue = documentReferenceYear.ToString(System.Globalization.CultureInfo.InvariantCulture).Substring(2, 2);
            if (invoice.DocumentType == TransactionDocumentType.Original)
            {
                switch (invoice.TransactionDocumentTypeId)
                {
                    case (int)MasterDocumentType.PI:
                        documentLabel = MasterDocumentType.PI.ToString();
                        break;
                    case (int)MasterDocumentType.SI:
                        documentLabel = MasterDocumentType.SI.ToString();
                        break;
                    case (int)MasterDocumentType.CN:
                        documentLabel = MasterDocumentType.DN.ToString();
                        transactdocumentTypeId = (int)MasterDocumentType.DN;
                        break;
                    case (int)MasterDocumentType.DN:
                        documentLabel = MasterDocumentType.CN.ToString();
                        transactdocumentTypeId = (int)MasterDocumentType.CN;
                        break;

                    default:
                        documentLabel = MasterDocumentType.PI.ToString();
                        break;
                }
            }
            else if (invoice.DocumentType == TransactionDocumentType.CNDN)
            {
                switch (invoice.TransactionDocumentTypeId)
                {
                    case (int)MasterDocumentType.PI:
                    case (int)MasterDocumentType.CN:
                        documentLabel = MasterDocumentType.DN.ToString();
                        transactdocumentTypeId = (int)MasterDocumentType.DN;
                        break;
                    case (int)MasterDocumentType.SI:
                    case (int)MasterDocumentType.DN:
                        documentLabel = MasterDocumentType.CN.ToString();
                        transactdocumentTypeId = (int)MasterDocumentType.CN;
                        break;
                    default:
                        documentLabel = MasterDocumentType.PI.ToString();
                        break;
                }
            }

            invoice.TransactionDocumentTypeId = transactdocumentTypeId;
            var result = await _invoiceRepository.GetInvoiceDocumentReferenceValues(invoice.CompanyId, transactdocumentTypeId, documentReferenceYear);
            string documentDateYear = invoice.InvoiceDate.Year.ToString(CultureInfo.InvariantCulture);
            invoice.YearNumber = result;
            invoice.DocumentReference = string.Concat(invoice.InvoiceDocumentType == InvoiceDocumentType.Draft ? $"D_{DateTime.UtcNow.ToString("yyyyMMddHHMMss", CultureInfo.InvariantCulture)}_" : string.Empty, documentLabel, documentReferenceYearValue, string.Format(CultureInfo.InvariantCulture, "{0:D5}", invoice.YearNumber));
        }

        /// <summary>
        /// This method will Insert the newly added lines of Cost to Trade Cost
        /// which will return the CostIds of the newly inserted Costs and then
        /// map them with SectionId in UDTT_InvoiceLine
        /// </summary>
        /// <param name="invoiceLines"> Invoice Line Record Collection</param>
        /// <param name="company"> Company Id</param>
        /// <param name="selectedInvoiceType">selectedInvoiceType</param>
        /// <param name="isDraft">Draft ?</param>
        private async Task<IEnumerable<InvoiceLineRecord>> AddCostLines(IEnumerable<InvoiceLineRecord> invoiceLines, string company, InvoiceType selectedInvoiceType, bool isDraft)
        {
            List<CostLine> costLines = new List<CostLine>();
            List<InvoiceLineRecord> toBeSavedInvoiceLines = new List<InvoiceLineRecord>();
            int existingCostLineCount, newlyAddedCostLineCount = 0;
            var sectionIdPresent = invoiceLines.FirstOrDefault(invoiceLine => invoiceLine.SectionId != null).SectionId;
            bool otherSectionIdExist = invoiceLines.Any(invoiceLine => invoiceLine.SectionId != null
            && invoiceLine.SectionId != sectionIdPresent);

            if (selectedInvoiceType == InvoiceType.GoodsCostPurchase || selectedInvoiceType == InvoiceType.GoodsCostSales)
            {
                existingCostLineCount = invoiceLines.Count(invoiceLine => invoiceLine.SectionId != null && invoiceLine.CostId == null);
                newlyAddedCostLineCount = invoiceLines.Count(invoiceLine => invoiceLine.SectionId == null && invoiceLine.CostId == null);
            }
            else
            {
                existingCostLineCount = invoiceLines.Count(invoiceLine => invoiceLine.SectionId != null);
                newlyAddedCostLineCount = invoiceLines.Count(invoiceLine => invoiceLine.SectionId == null);
            }

            // when single sectionId is selected and single CostLine has been added
            // when single sectionId is selected and multiple CostLines have been added
            if (!otherSectionIdExist && (existingCostLineCount > 0 && newlyAddedCostLineCount > 0))
            {
                long sectionId = (long)invoiceLines.First(invoiceLine => invoiceLine.SectionId != null).SectionId;
                foreach (InvoiceLineRecord invoiceLine in invoiceLines.Where(invoiceLine => invoiceLine.CostId == null && invoiceLine.SectionId == null))
                {
                    CostLine newCostLine = new CostLine()
                    {
                        CostDirectionId = invoiceLine.CostDirectionId,
                        CostTypeCode = invoiceLine.CostTypeCode,
                        SectionId = sectionId,
                        CurrencyCode = invoiceLine.CurrencyCode,
                        RateTypeId = invoiceLine.RateTypeId,
                        Rate = invoiceLine.LineAmount,
                        Narrative = invoiceLine.Narrative,
                        InPNL = invoiceLine.InPL,
                        NoAction = invoiceLine.NoAct
                    };
                    costLines.Add(newCostLine);
                }
            }

            // when multiple sectionIds are selected and Single CostLine has been added
            else if (existingCostLineCount > 1 && newlyAddedCostLineCount == 1 && otherSectionIdExist)
            {
                decimal contractQuantitySum = 0;
                if (selectedInvoiceType == InvoiceType.GoodsCostPurchase || selectedInvoiceType == InvoiceType.GoodsCostSales || selectedInvoiceType == InvoiceType.CommercialPurchase || selectedInvoiceType == InvoiceType.CommercialSale)
                {
                    contractQuantitySum = invoiceLines.Where(i => i.CostId == null).Sum(invoiceLine => invoiceLine.Quantity);
                }
                else
                {
                    contractQuantitySum = invoiceLines.Where(i => i.CostId != null).Sum(invoiceLine => invoiceLine.Quantity);
                }

                var newlyAddedCostLine = invoiceLines.FirstOrDefault(invoiceLine => invoiceLine.SectionId == null && invoiceLine.CostId == null);

                if (selectedInvoiceType == InvoiceType.GoodsCostPurchase || selectedInvoiceType == InvoiceType.GoodsCostSales)
                {
                    foreach (InvoiceLineRecord invoiceLine in invoiceLines.Where(invoiceLine => invoiceLine.SectionId != null && invoiceLine.CostId == null))
                    {
                        CostLine newCostLine = new CostLine
                        {
                            CostDirectionId = newlyAddedCostLine.CostDirectionId,
                            CostTypeCode = newlyAddedCostLine.CostTypeCode,
                            SectionId = (long)invoiceLine.SectionId,
                            CurrencyCode = newlyAddedCostLine.CurrencyCode,
                            RateTypeId = newlyAddedCostLine.RateTypeId,
                            Rate = newlyAddedCostLine.LineAmount * (invoiceLine.Quantity / contractQuantitySum),
                            Narrative = newlyAddedCostLine.Narrative,
                            InPNL = newlyAddedCostLine.InPL,
                            NoAction = newlyAddedCostLine.NoAct
                        };
                        costLines.Add(newCostLine);
                    }
                }
                else
                {
                    foreach (InvoiceLineRecord invoiceLine in invoiceLines.Where(invoiceLine => invoiceLine.SectionId != null))
                    {
                        CostLine newCostLine = new CostLine
                        {
                            CostDirectionId = newlyAddedCostLine.CostDirectionId,
                            CostTypeCode = newlyAddedCostLine.CostTypeCode,
                            SectionId = (long)invoiceLine.SectionId,
                            CurrencyCode = newlyAddedCostLine.CurrencyCode,
                            RateTypeId = newlyAddedCostLine.RateTypeId,
                            Rate = newlyAddedCostLine.LineAmount * (invoiceLine.Quantity / contractQuantitySum),
                            Narrative = newlyAddedCostLine.Narrative,
                            InPNL = newlyAddedCostLine.InPL,
                            NoAction = newlyAddedCostLine.NoAct
                        };
                        costLines.Add(newCostLine);
                    }
                }
            }

            // when multiple sectionId is selected but multiple new CostLines have been added
            else if (existingCostLineCount > 1 && newlyAddedCostLineCount > 1 && otherSectionIdExist)
            {
                decimal contractQuantitySum;
                if (selectedInvoiceType == InvoiceType.GoodsCostPurchase || selectedInvoiceType == InvoiceType.GoodsCostSales || selectedInvoiceType == InvoiceType.CommercialPurchase || selectedInvoiceType == InvoiceType.CommercialSale)
                {
                    contractQuantitySum = invoiceLines.Where(i => i.CostId == null).Sum(invoiceLine => invoiceLine.Quantity);
                }
                else
                {
                    contractQuantitySum = invoiceLines.Where(i => i.CostId != null).Sum(invoiceLine => invoiceLine.Quantity);
                }

                if (selectedInvoiceType == InvoiceType.GoodsCostPurchase || selectedInvoiceType == InvoiceType.GoodsCostSales || selectedInvoiceType == InvoiceType.CommercialPurchase || selectedInvoiceType == InvoiceType.CommercialSale)
                {
                    foreach (InvoiceLineRecord invoiceLine in invoiceLines.Where(invoiceLine => invoiceLine.CostId == null && invoiceLine.SectionId != null))
                    {
                        foreach (InvoiceLineRecord newlyAddInvoiceLine in invoiceLines.Where(newlyAddInvoiceLine => newlyAddInvoiceLine.SectionId == null))
                        {
                            CostLine newCostLine = new CostLine
                            {
                                CostDirectionId = newlyAddInvoiceLine.CostDirectionId,
                                CostTypeCode = newlyAddInvoiceLine.CostTypeCode,
                                SectionId = (long)invoiceLine.SectionId,
                                CurrencyCode = newlyAddInvoiceLine.CurrencyCode,
                                RateTypeId = newlyAddInvoiceLine.RateTypeId,
                                Rate = newlyAddInvoiceLine.LineAmount * (invoiceLine.Quantity / contractQuantitySum),
                                Narrative = newlyAddInvoiceLine.Narrative,
                                InPNL = newlyAddInvoiceLine.InPL,
                                NoAction = newlyAddInvoiceLine.NoAct
                            };
                            costLines.Add(newCostLine);
                        }
                    }
                }
                else
                {
                    foreach (InvoiceLineRecord invoiceLine in invoiceLines.Where(invoiceLine => invoiceLine.CostId != null))
                    {
                        foreach (InvoiceLineRecord newlyAddInvoiceLine in invoiceLines.Where(newlyAddInvoiceLine => newlyAddInvoiceLine.SectionId == null))
                        {
                            CostLine newCostLine = new CostLine
                            {
                                CostDirectionId = newlyAddInvoiceLine.CostDirectionId,
                                CostTypeCode = newlyAddInvoiceLine.CostTypeCode,
                                SectionId = (long)invoiceLine.SectionId,
                                CurrencyCode = newlyAddInvoiceLine.CurrencyCode,
                                RateTypeId = newlyAddInvoiceLine.RateTypeId,
                                Rate = newlyAddInvoiceLine.LineAmount * (invoiceLine.Quantity / contractQuantitySum),
                                Narrative = newlyAddInvoiceLine.Narrative,
                                InPNL = newlyAddInvoiceLine.InPL,
                                NoAction = newlyAddInvoiceLine.NoAct
                            };
                            costLines.Add(newCostLine);
                        }
                    }
                }
            }

            if (costLines.Count > 0)// && !isDraft)
            {
                // Flag costs as draft if needed
                costLines.ForEach(c => c.IsDraft = isDraft);

                var insertedCostLines = (await _invoiceRepository.AddCostsToTrade(costLines, company)).ToArray();

                int insertedCostLinesCount = insertedCostLines.Count();

                toBeSavedInvoiceLines = invoiceLines.Where(invoiceLine => invoiceLine.SectionId != null).ToList();
                IEnumerable<InvoiceLineRecord> newlyAddedInvoiceLines = invoiceLines.Where(invoiceLine => invoiceLine.SectionId == null);
                for (int i = 0; i < insertedCostLinesCount; i++)
                {
                    InvoiceLineRecord newInvoiceLine = new InvoiceLineRecord
                    {
                        SectionId = insertedCostLines[i].SectionId,
                        CostId = (int)insertedCostLines[i].CostId,
                        InvoicePercent = 100, // CostLines are defaulted to 100% Invoiced
                        LineAmount = insertedCostLines[i].Rate,
                        CurrencyCode = insertedCostLines[i].CurrencyCode,
                        VATCode = newlyAddedInvoiceLines.ToList()[i].VATCode,
                        CostDirectionId = insertedCostLines[i].CostDirectionId,
                    };
                    toBeSavedInvoiceLines.Add(newInvoiceLine);
                }

                for (int i = 0; i < toBeSavedInvoiceLines.Count; i++)
                {
                    toBeSavedInvoiceLines[i].LineNumber = i + 1;
                }
            }

            return toBeSavedInvoiceLines;
        }

        /// <summary>
        /// This method will Insert the newly added lines of Cost in washout to Trade Cost
        /// which will return the CostIds of the newly inserted Costs and then
        /// map them with SectionId in UDTT_InvoiceLine
        /// </summary>
        /// <param name="invoiceLines"> Invoice Line Record Collection</param>
        /// <param name="company"> Company Id</param>
        private async Task<IEnumerable<InvoiceLineRecord>> AddCostLinesForWashout(IEnumerable<InvoiceLineRecord> invoiceLines, string company)
        {
            List<CostLine> costLines = new List<CostLine>();
            List<InvoiceLineRecord> toBeSavedInvoiceLines = new List<InvoiceLineRecord>();
            int existingCostLineCount = invoiceLines.Count(invoiceLine => invoiceLine.SectionId != null && invoiceLine.ContractType == ContractType.Sale);
            int newlyAddedCostLineCount = invoiceLines.Count(invoiceLine => invoiceLine.SectionId == null);

            // when single sectionId is selected and single CostLine has been added
            // when single sectionId is selected and multiple CostLines have been added
            if ((existingCostLineCount == 1 && newlyAddedCostLineCount == 1) || (existingCostLineCount == 1 && newlyAddedCostLineCount > 1))
            {
                long sectionId = (long)invoiceLines.First(invoiceLine => invoiceLine.SectionId != null && invoiceLine.ContractType == ContractType.Sale).SectionId;
                foreach (InvoiceLineRecord invoiceLine in invoiceLines.Where(invoiceLine => invoiceLine.CostId == null && invoiceLine.SectionId == null))
                {
                    CostLine newCostLine = new CostLine()
                    {
                        CostDirectionId = invoiceLine.CostDirectionId,
                        CostTypeCode = invoiceLine.CostTypeCode,
                        SectionId = sectionId,
                        CurrencyCode = invoiceLine.CurrencyCode,
                        RateTypeId = invoiceLine.RateTypeId,
                        Rate = invoiceLine.LineAmount,
                        Narrative = invoiceLine.Narrative,
                        InPNL = invoiceLine.InPL,
                        NoAction = invoiceLine.NoAct
                    };
                    costLines.Add(newCostLine);
                }
            }

            // when multiple sectionIds are selected and Single CostLine has been added
            else if (existingCostLineCount > 1 && newlyAddedCostLineCount == 1)
            {
                decimal contractQuantitySum = invoiceLines.Sum(invoiceLine => invoiceLine.Quantity);
                var newlyAddedCostLine = invoiceLines.FirstOrDefault(invoiceLine => invoiceLine.SectionId == null);

                foreach (InvoiceLineRecord invoiceLine in invoiceLines.Where(invoiceLine => invoiceLine.SectionId != null && invoiceLine.ContractType == ContractType.Sale))
                {
                    CostLine newCostLine = new CostLine
                    {
                        CostDirectionId = newlyAddedCostLine.CostDirectionId,
                        CostTypeCode = newlyAddedCostLine.CostTypeCode,
                        SectionId = (long)invoiceLine.SectionId,
                        CurrencyCode = newlyAddedCostLine.CurrencyCode,
                        RateTypeId = newlyAddedCostLine.RateTypeId,
                        Rate = newlyAddedCostLine.LineAmount * (invoiceLine.Quantity / contractQuantitySum),
                        Narrative = newlyAddedCostLine.Narrative,
                        InPNL = newlyAddedCostLine.InPL,
                        NoAction = newlyAddedCostLine.NoAct
                    };
                    costLines.Add(newCostLine);
                }
            }

            // when multiple sectionId is selected but multiple new CostLines have been added
            else if (existingCostLineCount > 1 && newlyAddedCostLineCount > 1)
            {
                decimal contractQuantitySum = invoiceLines.Sum(invoiceLine => invoiceLine.Quantity);
                foreach (InvoiceLineRecord invoiceLine in invoiceLines.Where(invoiceLine => invoiceLine.SectionId != null && invoiceLine.ContractType == ContractType.Sale))
                {
                    foreach (InvoiceLineRecord newlyAddInvoiceLine in invoiceLines.Where(newlyAddInvoiceLine => newlyAddInvoiceLine.SectionId == null && newlyAddInvoiceLine.CostId == null))
                    {
                        CostLine newCostLine = new CostLine
                        {
                            CostDirectionId = newlyAddInvoiceLine.CostDirectionId,
                            CostTypeCode = newlyAddInvoiceLine.CostTypeCode,
                            SectionId = (long)invoiceLine.SectionId,
                            CurrencyCode = newlyAddInvoiceLine.CurrencyCode,
                            RateTypeId = newlyAddInvoiceLine.RateTypeId,
                            Rate = newlyAddInvoiceLine.LineAmount * (invoiceLine.Quantity / contractQuantitySum),
                            Narrative = newlyAddInvoiceLine.Narrative,
                            InPNL = newlyAddInvoiceLine.InPL,
                            NoAction = newlyAddInvoiceLine.NoAct
                        };
                        costLines.Add(newCostLine);
                    }
                }
            }

            if (costLines.Count > 0)
            {
                IEnumerable<CostLine> insertedCostLines = await _invoiceRepository.AddCostsToTrade(costLines, company);
                int insertedCostLinesCount = insertedCostLines.Count();
                toBeSavedInvoiceLines = invoiceLines.Where(invoiceLine => invoiceLine.SectionId != null).ToList();
                IEnumerable<InvoiceLineRecord> newlyAddedInvoiceLines = invoiceLines.Where(invoiceLine => invoiceLine.SectionId == null);

                for (int i = 0; i < insertedCostLinesCount; i++)
                {
                    InvoiceLineRecord newInvoiceLine = new InvoiceLineRecord
                    {
                        SectionId = insertedCostLines.ToArray()[i].SectionId,
                        CostId = (int)insertedCostLines.ToArray()[i].CostId,
                        InvoicePercent = 100, // CostLines are defaulted to 100% Invoiced
                        LineAmount = insertedCostLines.ToArray()[i].Rate,
                        CurrencyCode = insertedCostLines.ToArray()[i].CurrencyCode,
                        VATCode = newlyAddedInvoiceLines.ToArray()[i].VATCode,
                        CostDirectionId = insertedCostLines.ToArray()[i].CostDirectionId
                    };
                    toBeSavedInvoiceLines.Add(newInvoiceLine);
                }

                for (int i = 0; i < toBeSavedInvoiceLines.Count; i++)
                {
                    toBeSavedInvoiceLines[i].LineNumber = i + 1;
                }
            }

            return toBeSavedInvoiceLines;
        }

        private async Task EnqueueMessage(string contextInfo, string company)
        {
            var authorizationResult = await _authorizationService.AuthorizeAsync(_identityService.GetUser(), Policies.PostOpClosedPolicy);

            var content = new JObject();
            content.Add(new JProperty("docId", contextInfo));
            content.Add(new JProperty("postOpClosedPolicy", authorizationResult.Succeeded));
            ProcessMessage message = new ProcessMessage​
            {
                ProcessTypeId = (int)ProcessType.AtlasAccountingDocumentProcessor,
                CompanyId = company,
                Content = content.ToString(),
            };

            await _processMessageService.SendMessage(message);
        }

        private static PhysicalDocumentType MapInvoiceTypeToPhysicalDocumentType(InvoiceType invoiceType)
        {
            switch (invoiceType)
            {
                case InvoiceType.CommercialPurchase:
                case InvoiceType.CommercialSale:
                    return PhysicalDocumentType.InvoiceGoodsInvoice;
                case InvoiceType.Cost:
                case InvoiceType.CostReceivable:
                case InvoiceType.CostDebitNote:
                case InvoiceType.CostCreditNote:
                    return PhysicalDocumentType.InvoiceCostsInvoice;
                case InvoiceType.GoodsCostPurchase:
                case InvoiceType.GoodsCostSales:
                    return PhysicalDocumentType.InvoiceGoodsCostInvoice;
                case InvoiceType.Washout:
                    return PhysicalDocumentType.InvoiceWashout;
                case InvoiceType.Reversal:
                case InvoiceType.Cancelled:
                    return PhysicalDocumentType.InvoiceCancellation;
                default:
                    throw new AtlasTechnicalException($"Invalid invoice type: {invoiceType}");
            }
        }

        private async Task<int> GetApplicationTableId(PhysicalDocumentType physicalDocumentType)
        {
            var table = (await _applicationTableQueries.GetApplicationTablesAsync(physicalDocumentType.GetApplicationTableName())).FirstOrDefault();

            if (table == null)
            {
                throw new AtlasTechnicalException($"Table \"{physicalDocumentType.GetApplicationTableName()}\" not found in application tables.");
            }

            return table.TableId;
        }
    }
}