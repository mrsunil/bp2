using AutoMapper;
using LDC.Atlas.Application.Common.Configuration;
using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Document.Common.Dtos;
using LDC.Atlas.Document.Common.Entities;
using LDC.Atlas.Document.Common.Services;
using LDC.Atlas.Document.Common.Utils;
using LDC.Atlas.Infrastructure.Services;
using LDC.Atlas.MasterData.Common;
using LDC.Atlas.Services.Trading.Application.Queries;
using LDC.Atlas.Services.Trading.Application.Queries.Dto;
using LDC.Atlas.Services.Trading.Entities;
using LDC.Atlas.Services.Trading.Infrastructure.Policies;
using LDC.Atlas.Services.Trading.Repositories;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Commands
{
    public class SectionCommandsHandler :
        IRequestHandler<ApproveSectionCommand>,
        IRequestHandler<DeleteCostsCommand>,
        IRequestHandler<CreateTrancheCommand, IEnumerable<SectionReference>>,
        IRequestHandler<CreateSplitCommand, IEnumerable<SectionReference>>,
        IRequestHandler<SplitDetailsCommand, IEnumerable<SectionReference>>,
        IRequestHandler<BulkSplitDetailsCommand, IEnumerable<SectionReference>>,
        IRequestHandler<UnapproveSectionCommand>,
        IRequestHandler<AssignContractAdviceCommand, PhysicalDocumentReferenceDto>,
        IRequestHandler<GenerateContractAdviceCommand, PhysicalDocumentReferenceDto>,
        IRequestHandler<UpdateContractAdviceCommand, PhysicalDocumentReferenceDto>,
        IRequestHandler<UpdateBulkApprovalCommand>,
        IRequestHandler<DeleteTradeFavoriteCommand>,
        IRequestHandler<DeleteSectionCommand>,
        IRequestHandler<IntercoValidationCommand, IntercoValidation>,
        IRequestHandler<CreateFavouriteCommand, long>,
        IRequestHandler<CreateManualIntercoCommand, IEnumerable<SectionReference>>,
        IRequestHandler<CloseSectionStatusCommand>,
        IRequestHandler<OpenSectionStatusCommand>,
        IRequestHandler<CancelSectionStatusCommand>,
        IRequestHandler<ReverseCancelSectionStatusCommand>,
        IRequestHandler<SaveBulkCostsCommand, IEnumerable<CostBulkEdit>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICostRepository _costRepository;
        private readonly ISectionRepository _sectionRepository;
        private readonly ITradeRepository _tradeRepository;
        private readonly IIdentityService _identityService;
        private readonly IMasterDataService _masterDataService;
        private readonly IPhysicalContractQueries _physicalContractQueries;
        private readonly IUserService _userService;
        private readonly IFreezeRepository _freezeRepository;
        private readonly ILogger _logger;
        private readonly IMapper _mapper;
        private readonly IAuthorizationService _authorizationService;
        private readonly IPhysicalDocumentStorageService _physicalDocumentStorageService;
        private readonly IPhysicalDocumentGenerationService _physicalDocumentGenerationService;
        private readonly ISystemDateTimeService _systemDateTimeService;
        private readonly IApplicationTableService _applicationTableQueries;
        private readonly ISectionQueries _sectionQueries;
        private readonly IInvoiceMarkingQueries _invoiceMarkingQueries;
        private readonly IInvoiceMarkingRepository _invoiceMarkingRepository;
        //private readonly LDC.Atlas.Services.Execution.Application.Queries.IInvoiceQueries _invoiceQueries;

        public SectionCommandsHandler(
            ILogger<SectionCommandsHandler> logger,
            IUnitOfWork unitOfWork,
            ICostRepository costRepository,
            ISectionRepository sectionRepository,
            ITradeRepository tradeRepository,
            IFreezeRepository freezeRepository,
            IIdentityService identityService,
            IMasterDataService masterDataService,
            IPhysicalContractQueries physicalContractQueries,
            IUserService userService,
            IMapper mapper,
            IAuthorizationService authorizationService,
            IPhysicalDocumentStorageService physicalDocumentStorageService,
            ISystemDateTimeService systemDateTimeService,
            IPhysicalDocumentGenerationService physicalDocumentGenerationService,
            IApplicationTableService applicationTableQueries,
            ISectionQueries sectionQueries,
            IInvoiceMarkingQueries invoiceMarkingQueries,
            IInvoiceMarkingRepository invoiceMarkingRepository)
        //LDC.Atlas.Services.Execution.Application.Queries.IInvoiceQueries invoiceQueries)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _costRepository = costRepository ?? throw new ArgumentNullException(nameof(costRepository));
            _sectionRepository = sectionRepository ?? throw new ArgumentNullException(nameof(sectionRepository));
            _tradeRepository = tradeRepository ?? throw new ArgumentNullException(nameof(tradeRepository));
            _freezeRepository = freezeRepository ?? throw new ArgumentNullException(nameof(freezeRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _masterDataService = masterDataService ?? throw new ArgumentNullException(nameof(masterDataService));
            _physicalContractQueries = physicalContractQueries ?? throw new ArgumentNullException(nameof(physicalContractQueries));
            _userService = userService ?? throw new ArgumentNullException(nameof(userService));
            _authorizationService = authorizationService ?? throw new ArgumentNullException(nameof(authorizationService));
            _physicalDocumentStorageService = physicalDocumentStorageService ?? throw new ArgumentNullException(nameof(physicalDocumentStorageService));
            _systemDateTimeService = systemDateTimeService ?? throw new ArgumentNullException(nameof(systemDateTimeService));
            _physicalDocumentGenerationService = physicalDocumentGenerationService ?? throw new ArgumentNullException(nameof(physicalDocumentGenerationService));
            _applicationTableQueries = applicationTableQueries ?? throw new ArgumentNullException(nameof(applicationTableQueries));
            _sectionQueries = sectionQueries ?? throw new ArgumentNullException(nameof(sectionQueries));
            _invoiceMarkingQueries = invoiceMarkingQueries ?? throw new ArgumentNullException(nameof(invoiceMarkingQueries));
            _invoiceMarkingRepository = invoiceMarkingRepository ?? throw new ArgumentNullException(nameof(invoiceMarkingRepository));
            //_invoiceQueries = invoiceQueries ?? throw new ArgumentNullException(nameof(invoiceQueries));
        }

        public async Task<Unit> Handle(ApproveSectionCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();
            decimal priceCodeConversion = 0;
            decimal weightCodeConversion = 0;
            decimal companyWeightUnit = 0;
            try
            {
                var dateVersionId = await _systemDateTimeService.GetCompanyCurrentDataVersionId(request.Company);
                IEnumerable<long> sectionIdList;
                bool isApproved = false;
                sectionIdList = await _sectionQueries.GetSectionIdOfChildContracts(request.Company, request.SectionId, dateVersionId);

                List<Cost> costList = new List<Cost>();
                foreach (var sectionId in sectionIdList)
                {
                    // Load domain objects
                    var section = await _sectionRepository.GetSectionById(sectionId, request.Company, dateVersionId);

                    if (!section.IsCancelled && !section.IsClosed && section.ContractStatusCode != ContractStatus.Approved)
                    {
                        isApproved = true;

                        var costs = (await _costRepository.LoadSectionCostsAsync(sectionId, request.Company, dateVersionId)).ToList();

                    // Update costs
                    if (costs.Any() && section.FirstApprovalDateTime == null)
                    {
                        var fxRates = await _masterDataService.GetFxRatesAsync(section.FirstApprovalDateTime);
                        var weightUnits = (await _masterDataService.GetWeightUnitsAsync(request.Company)).ToList();
                        var priceUnits = (await _masterDataService.GetPriceUnitsAsync(request.Company)).ToList();
                        var conversionRate = fxRates.FirstOrDefault(x => x.CurrencyCode == section.CurrencyCode);

                        if (conversionRate?.Rate == null)
                        {
                            // TODO: reactivate this code when FX Rate is ready
                            // throw new Exception(string.Format("Conversion rate not available for '{0}' currency", section.Currency));
                            conversionRate = new MasterData.Common.Entities.FxRate { Rate = 1, CurrencyRoeType = "D" };
                        }

                        var companyDetails = await _masterDataService.GetCompanyByIdAsync(section.CompanyId);

                        var tradeWeightUnit = weightUnits.First(x => x.WeightUnitId == section.WeightUnitId);
                        var mtWeightUnit = weightUnits.First(x => x.WeightCode == "MT");

                        var tradeQuantityMt = (section.Quantity * tradeWeightUnit.ConversionFactor) /
                                              mtWeightUnit.ConversionFactor;
                        var pmtPriceUnit = priceUnits.First(x => x.PriceCode == "PMT");

                        var tradeQuantity = section.Quantity;

                        // weight Code Conversion calculation
                        var filteredWeight = weightUnits;
                        var selectedWeight = filteredWeight.Where(weight => weight.WeightUnitId == section.WeightUnitId).ToArray();
                        var companyWeight = filteredWeight.Where(weight => weight.WeightCode == companyDetails.WeightCode).ToArray();
                        if (selectedWeight != null && selectedWeight.Any() && companyWeight != null && companyWeight.Any())
                        {
                            // we will always get one row at a time
                            weightCodeConversion = selectedWeight[0].ConversionFactor;
                            companyWeightUnit = companyWeight[0].ConversionFactor;
                        }

                        var companyPriceUnit = priceUnits.First(x => x.PriceCode == companyDetails.PriceCode);

                        foreach (var cost in costs)
                        {
                            cost.OriginalEstCurrencyCode = cost.CurrencyCode;
                            cost.OriginalEstPriceUnitId = cost.PriceUnitId;
                            cost.OriginalEstRate = cost.Rate;
                            cost.OriginalEstRateTypeId = cost.RateTypeId;
                            cost.CompanyId = request.Company;

                            switch (cost.OriginalEstRateTypeId)
                            {
                                case (int)RateType.Rate:
                                    {
                                        // Price Code Conversion calculation
                                        var filteredPrice = priceUnits;
                                        var selectedPrice = filteredPrice.Where((price) => price.PriceUnitId == cost.PriceUnitId).ToArray();
                                        if (selectedPrice != null && selectedPrice.Any())
                                        {
                                            // we will always get one row at a time
                                            priceCodeConversion = selectedPrice[0].ConversionFactor;
                                        }

                                        var costAmount = cost.Rate * priceCodeConversion * tradeQuantity * weightCodeConversion;

                                        cost.OriginalEstimatedPMTValue = costAmount / ((section.Quantity * weightCodeConversion) / companyWeightUnit);
                                    }

                                    break;
                                case (int)RateType.Amount:
                                    {
                                        var costAmount = cost.Rate;
                                        cost.OriginalEstimatedPMTValue = costAmount / ((section.Quantity * weightCodeConversion) / companyWeightUnit);
                                    }

                                    break;
                                case (int)RateType.Percent:
                                    {
                                        var costAmount = section.ContractedValue * (cost.Rate / 100);
                                        cost.OriginalEstimatedPMTValue = costAmount / ((section.Quantity * weightCodeConversion) / companyWeightUnit);
                                    }

                                    break;
                                default:
                                    throw new AtlasBusinessException(
                                        $"Invalid cost rate type: {cost.OriginalEstRateTypeId}");
                            }
                        }

                        costList.AddRange(costs);
                    }
                }
                }

                // Approve section

                if (isApproved)
                {
                    await _sectionRepository.ApproveSectionAsync(request.SectionId, request.Company);
                    _logger.LogInformation("Section with id {Atlas_SectionId} approved.", request.SectionId);
                    if (costList.Any())
                    {
                        await _costRepository.AddUpdateCostsAsync(costList, request.Company, dateVersionId);
                    }

                    _unitOfWork.Commit();
                }
            }
            catch (Exception)
            {
                _unitOfWork.Rollback();
                throw;
            }

            return Unit.Value;
        }

        public async Task<Unit> Handle(DeleteCostsCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                if (request.DataVersionId != null)
                {
                    var freezeDate = await _freezeRepository.GetFreezeNotClosedAsync(request.Company, request.DataVersionId.Value);

                    if (freezeDate == null)
                    {
                        throw new AtlasBusinessException($"Costs cannot be deleted in a freeze if the month is closed.");
                    }
                }

                var section = await _sectionRepository.GetSectionById(request.SectionId, request.Company, request.DataVersionId);

                if (section == null)
                {
                    throw new NotFoundException("Section", request.SectionId);
                }

                var authorizationResult = await _authorizationService.AuthorizeAsync(_identityService.GetUser(), section, Policies.DeleteCostsTradePhysicalPolicy);

                if (authorizationResult.Succeeded)
                {
                    await _costRepository.DeleteCostsAsync(request.Company, request.SectionId, request.CostIds, request.DataVersionId);
                }
                else
                {
                    throw new AtlasSecurityException("One or more privileges are required to perform this action.");
                }

                _unitOfWork.Commit();

                _logger.LogInformation("Costs with id {Atlas_CostId} from section {Atlas_SectionId} deleted.", string.Join(",", request.CostIds), request.SectionId);
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }

            return Unit.Value;
        }

        public async Task<IEnumerable<SectionReference>> Handle(CreateTrancheCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var sectionTrancheContract = _mapper.Map<SectionDeprecated>(request);
                var company = await _masterDataService.GetCompanyByIdAsync(request.CompanyId);

                if (company.IsProvinceEnable)
                {
                    sectionTrancheContract.ProvinceId = company.DefaultProvinceId;
                    sectionTrancheContract.BranchId = company.DefaultBranchId;
                }
                else
                {
                    sectionTrancheContract.ProvinceId = null;
                    sectionTrancheContract.BranchId = null;
                }


                sectionTrancheContract.ChildSections.ToList().ForEach(section => section.OriginalQuantity = 0);

                var parentSection = await _sectionRepository.GetSectionById(sectionTrancheContract.ChildSections.ToList()[0].SectionOriginId, request.CompanyId, null);

                if (parentSection.AllocatedTo != null)
                {
                    throw new AtlasBusinessException($"Allocated Trade cannot tranche.");
                }

                IEnumerable<SectionDeprecated> childSections = sectionTrancheContract.ChildSections.Where(x => x.SectionId == 0);

                foreach (SectionDeprecated childSection in childSections)
                {
                    if (parentSection.DeliveryPeriodEndDate != childSection.DeliveryPeriodEndDate
                        || parentSection.DeliveryPeriodStartDate != childSection.DeliveryPeriodStartDate
                        || parentSection.PaymentTermCode != childSection.PaymentTerms)
                    {
                        childSection.EstimatedMaturityDate = await CalculateEstimatedMaturityDate(childSection, parentSection, request.CompanyId);
                    }
                    else
                    {
                        childSection.EstimatedMaturityDate = parentSection.EstimatedMaturityDate;
                    }
                }

                var references = (await _tradeRepository.CreateTrancheSplitAsync(sectionTrancheContract, request.CompanyId)).ToList();

                foreach (var section in references)
                {
                    _logger.LogInformation("New tranche created with id {Atlas_SectionId}", section.SectionId);
                }

                SplitSectionCommand splitCostRequest = new SplitSectionCommand();
                splitCostRequest.Company = request.CompanyId;
                splitCostRequest.SectionOriginId = sectionTrancheContract.ChildSections.First().SectionOriginId;
                splitCostRequest.ChildSections = references.Select(x => new ChildSectionsToSplitCommand { ChildSectionId = x.SectionId, SplitQuantity = x.Quantity }).ToList();

                await SplitSectionTraffic(splitCostRequest, parentSection.CharterId, cancellationToken);

                await CreateInvoiceMarkingsSplit(splitCostRequest, parentSection.Quantity, parentSection.InvoicingStatusId, cancellationToken);

                await CreateCostsSplit(splitCostRequest, parentSection.Quantity, parentSection.Price, parentSection.ContractStatusCode, cancellationToken);

                _unitOfWork.Commit();

                return references;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        private async Task<DateTime?> CalculateEstimatedMaturityDate(SectionDeprecated physicalFixedPricedContract, Section parentSection, string companyId)
        {
            DateTime? estimatedMaturityDate = physicalFixedPricedContract.EstimatedMaturityDate;
            if (physicalFixedPricedContract.EstimatedMaturityDate == null
                   && physicalFixedPricedContract.PaymentTerms != null)
            {
                IEnumerable<MasterData.Common.Entities.PaymentTerms> selectedPaymentTerm = await _masterDataService.GetPaymentTermsAsync(companyId, physicalFixedPricedContract.PaymentTerms);


                if (selectedPaymentTerm != null)
                {
                    var firstSelectedPaymentTerm = selectedPaymentTerm.ToList().FirstOrDefault();

                    if (firstSelectedPaymentTerm != null)
                    {
                        int? creditDays = (int?)firstSelectedPaymentTerm.CreditDays;

                        if (firstSelectedPaymentTerm.CreditAgainst == CreditAgainstTypes.C.ToString())
                        {
                            var company = await _masterDataService.GetCompanyByIdAsync(companyId);
                            estimatedMaturityDate = company.ActiveDate ?? DateTime.UtcNow;
                        }
                        else if (firstSelectedPaymentTerm.CreditAgainst == CreditAgainstTypes.A.ToString())
                        {
                            estimatedMaturityDate = physicalFixedPricedContract.DeliveryPeriodEndDate;
                        }
                        else if (firstSelectedPaymentTerm.CreditAgainst == CreditAgainstTypes.I.ToString())
                        {
                            estimatedMaturityDate = parentSection.InvoiceDate ?? CalculateMaturityDateOnShippment(physicalFixedPricedContract);

                        }
                        else
                        {
                            // Need to call new Date(date) to avoid modifying the blDate when changing maturityDate
                            estimatedMaturityDate = physicalFixedPricedContract.BlDate ?? CalculateMaturityDateOnShippment(physicalFixedPricedContract);
                        }

                        if (creditDays != null)
                        {
                            estimatedMaturityDate = ((DateTime)estimatedMaturityDate).AddDays((int)creditDays);
                        }
                    }
                }
            }

            return estimatedMaturityDate;
        }

        private DateTime CalculateMaturityDateOnShippment(SectionDeprecated physicalFixedPricedContract)
        {
            DateTime dateToConsider = DateTime.UtcNow;
            if (physicalFixedPricedContract.PositionMonthType == PositionMonthType.Start)
            {
                dateToConsider = (DateTime)physicalFixedPricedContract.DeliveryPeriodStartDate;
                dateToConsider = dateToConsider.AddMonths(physicalFixedPricedContract.PositionMonthIndex);
            }
            else if (physicalFixedPricedContract.PositionMonthType == PositionMonthType.End)
            {
                dateToConsider = (DateTime)physicalFixedPricedContract.DeliveryPeriodEndDate;
                dateToConsider = dateToConsider.AddMonths(physicalFixedPricedContract.PositionMonthIndex);
            }

            DateTime firstOfNextMonth = new DateTime(dateToConsider.Year, dateToConsider.Month, 1).AddMonths(1);
            return firstOfNextMonth.AddDays(-1);
        }


        public async Task<IEnumerable<SectionReference>> Handle(CreateSplitCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                await _authorizationService.AuthorizeAsync(_identityService.GetUser(), null, Policies.CreateTrancheSplitPolicy);
                await SplitCommonRules.ValidateSplitContract(request, _physicalContractQueries, _userService);

                var sectionTrancheContract = _mapper.Map<SectionDeprecated>(request);
                var company = await _masterDataService.GetCompanyByIdAsync(request.CompanyId);

                if (company.IsProvinceEnable)
                {
                    sectionTrancheContract.ProvinceId = company.DefaultProvinceId;
                    sectionTrancheContract.BranchId = company.DefaultBranchId;
                }
                else
                {
                    sectionTrancheContract.ProvinceId = null;
                    sectionTrancheContract.BranchId = null;
                }

                sectionTrancheContract.ChildSections.ToList().ForEach(section => section.OriginalQuantity = 0);

                IEnumerable<SectionDeprecated> childSections = sectionTrancheContract.ChildSections.Where(x => x.SectionId == 0);

                foreach (SectionDeprecated childSection in childSections)
                {
                    var parentSection = await _sectionRepository.GetSectionById(childSection.SectionOriginId, request.CompanyId, null);

                    if (parentSection.DeliveryPeriodEndDate != childSection.DeliveryPeriodEndDate
                        || parentSection.DeliveryPeriodStartDate != childSection.DeliveryPeriodStartDate
                        || parentSection.PaymentTermCode != childSection.PaymentTerms)
                    {
                        childSection.EstimatedMaturityDate = await CalculateEstimatedMaturityDate(childSection, parentSection, request.CompanyId);
                    }
                    else
                    {
                        childSection.EstimatedMaturityDate = parentSection.EstimatedMaturityDate;
                    }
                }


                var references = await _tradeRepository.CreateTrancheSplitAsync(sectionTrancheContract, request.CompanyId);

                foreach (var section in references)
                {
                    _logger.LogInformation("New split created with id {Atlas_SectionId}", section.SectionId);
                }

                foreach (long sectionOriginId in request.ChildSections.Select(x => x.SectionOriginId).Distinct())
                {
                    var section = await _sectionRepository.GetSectionById(sectionOriginId, request.CompanyId, null);

                    SplitSectionCommand splitCostRequest = new SplitSectionCommand();
                    splitCostRequest.Company = request.CompanyId;
                    splitCostRequest.SectionOriginId = sectionOriginId;
                    splitCostRequest.ChildSections = references
                        .Where(x => x.SectionOriginId == sectionOriginId)
                        .Select(x => new ChildSectionsToSplitCommand { ChildSectionId = x.SectionId, SplitQuantity = x.Quantity }).ToList();

                    await SplitSectionTraffic(splitCostRequest, section.CharterId, cancellationToken);

                    await CreateInvoiceMarkingsSplit(splitCostRequest, request.Quantity, section.InvoicingStatusId, cancellationToken);

                    await CreateCostsSplit(splitCostRequest, request.OriginalQuantity, section.Price, section.ContractStatusCode, cancellationToken);
                }

                _unitOfWork.Commit();

                return references;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<IEnumerable<SectionReference>> Handle(SplitDetailsCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                await _authorizationService.AuthorizeAsync(_identityService.GetUser(), null, Policies.CreateTrancheSplitPolicy);
                await SplitCommonRules.ValidateSplitDetailsContract(request, _sectionRepository, _userService);

                List<SectionReference> references = new List<SectionReference>();
                int i = 0;
                int count = 0;
                if (request.SectionIds != null && request.SectionIds.Length > 0)
                {
                    foreach (long sectionId in request.SectionIds)
                    {
                        var section = await _sectionRepository.GetSectionById(sectionId, request.CompanyId, null);
                        decimal originalQuantity = section.Quantity;
                        decimal originalPrice = section.Price;
                        ContractStatus originalContractStatus = section.ContractStatusCode;
                        SplitDetails splitDetails = await _tradeRepository.GetSectionNumberForSplit(request.CompanyId, section.SectionId);

                        if (section != null && splitDetails != null)
                        {
                            int incrementNumber = Convert.ToInt16(splitDetails.SectionNumberId.Substring(splitDetails.SectionNumberId.Length - 3), CultureInfo.InvariantCulture) + 1;

                            if (incrementNumber > 999)
                            {
                                throw new Exception("More than 999 Split not allowed");
                            }
                            else
                            {
                                section.SectionNumberId = splitDetails.SectionNumberId.Substring(0, 1) + incrementNumber.ToString("000", CultureInfo.InvariantCulture);
                                section.SectionOriginId = section.SectionId;
                                section.SectionId = 0;
                                section.OriginalQuantity = 0;
                                section.Quantity = request.Quantity;
                                if (request.ContractedValues != null && request.ContractedValues.Length > 0)
                                {
                                    section.ContractedValue = !string.IsNullOrWhiteSpace(request.ContractedValues[count]) ? Convert.ToDecimal(request.ContractedValues[count]) : 0;
                                }

                                SectionReference sectionReference = await _sectionRepository.CreateSplitForContract(request.CompanyId, section, true);

                                references.Add(sectionReference);
                            }

                            SplitSectionCommand splitCostRequest = new SplitSectionCommand();
                            splitCostRequest.Company = request.CompanyId;
                            splitCostRequest.SectionOriginId = sectionId;
                            splitCostRequest.ChildSections = references.Where(x => x.SectionOriginId == sectionId).Select(x => new ChildSectionsToSplitCommand { ChildSectionId = x.SectionId, SplitQuantity = x.Quantity }).ToList();

                            await SplitSectionTraffic(splitCostRequest, section.CharterId, cancellationToken);

                            await CreateInvoiceMarkingsSplit(splitCostRequest, originalQuantity, section.InvoicingStatusId, cancellationToken);

                            await CreateCostsSplit(splitCostRequest, originalQuantity, originalPrice, originalContractStatus, cancellationToken);
                        }

                        i++;
                        count = count + 1;
                    }

                    foreach (var section in references)
                    {
                        _logger.LogInformation("New split created with id {Atlas_SectionId}", section.SectionId);
                    }
                }

                _unitOfWork.Commit();
                return references;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<IEnumerable<SectionReference>> Handle(BulkSplitDetailsCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                List<SectionReference> references = new List<SectionReference>();
                int i = 0;
                int count = 0;
                if (request.Quantity != null && request.Quantity.Length > 0)
                {
                    foreach (long quantity in request.Quantity)
                    {
                        var section = await _sectionRepository.GetSectionById(request.SectionId, request.CompanyId, null);
                        decimal originalQuantity = section.Quantity;
                        decimal originalPrice = section.Price;
                        ContractStatus originalContractStatus = section.ContractStatusCode;
                        SplitDetails splitDetails = await _tradeRepository.GetSectionNumberForSplit(request.CompanyId, section.SectionId);

                        if (section != null && splitDetails != null)
                        {
                            int incrementNumber = Convert.ToInt16(splitDetails.SectionNumberId.Substring(splitDetails.SectionNumberId.Length - 3), CultureInfo.InvariantCulture) + 1;

                            if (incrementNumber > 999)
                            {
                                throw new Exception("More than 999 Split not allowed");
                            }
                            else
                            {
                                section.SectionNumberId = splitDetails.SectionNumberId.Substring(0, 1) + incrementNumber.ToString("000", CultureInfo.InvariantCulture);
                                section.SectionOriginId = section.SectionId;
                                section.SectionId = 0;
                                section.OriginalQuantity = quantity;
                                section.Quantity = quantity;
                                if (request.ContractedValues != null && request.ContractedValues.Length > 0)
                                {
                                    section.ContractedValue = !string.IsNullOrWhiteSpace(request.ContractedValues[count]) ? Convert.ToDecimal(request.ContractedValues[count]) : 0;
                                }

                                SectionReference sectionReference = await _sectionRepository.CreateSplitForContract(request.CompanyId, section);
                                references.Add(sectionReference);
                            }

                            SplitSectionCommand splitCostRequest = new SplitSectionCommand();
                            splitCostRequest.Company = request.CompanyId;
                            splitCostRequest.SectionOriginId = request.SectionId;
                            splitCostRequest.ChildSections = references.Select(x => new ChildSectionsToSplitCommand { ChildSectionId = x.SectionId, SplitQuantity = x.Quantity }).ToList();

                            await CreateInvoiceMarkingsSplit(splitCostRequest, originalQuantity, section.InvoicingStatusId, cancellationToken);

                            await CreateCostsSplit(splitCostRequest, originalQuantity, originalPrice, originalContractStatus, cancellationToken);
                        }

                        i++;
                        count = count + 1;
                    }

                    foreach (var section in references)
                    {
                        _logger.LogInformation("New split created with id {Atlas_SectionId}", section.SectionId);
                    }
                }

                _unitOfWork.Commit();
                return references;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<Unit> Handle(UnapproveSectionCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                var dateVersionId = await _systemDateTimeService.GetCompanyCurrentDataVersionId(request.Company);
                var section = await _sectionRepository.GetSectionById(request.SectionId, request.Company, dateVersionId);
                if (!section.IsCancelled && !section.IsClosed && section.ContractStatusCode != ContractStatus.Unapproved)
                {
                    // Unapprove section
                    await _sectionRepository.UnapproveSectionAsync(request.SectionId, request.Company);

                    _logger.LogInformation("Section with id {Atlas_SectionId} unapproved.", request.SectionId);

                    _unitOfWork.Commit();
                }
            }
            catch (Exception)
            {
                _unitOfWork.Rollback();
                throw;
            }

            return Unit.Value;
        }

        public async Task<IEnumerable<SectionReference>> Handle(CreateManualIntercoCommand request, CancellationToken cancellationToken)
        {
            List<SectionReference> sectionReferences = new List<SectionReference>();
            _unitOfWork.BeginTransaction();

            try
            {
                var dataVersionId = await _systemDateTimeService.GetCompanyCurrentDataVersionId(request.IntercoCompanyId);

                //Get current section details by SectionId
                var section = await _sectionRepository.GetSectionById(request.SectionId, request.Company, request.DataVersionId);

                //Check for condition before create interco contracts
                if (section != null && !section.IsInterco && request.IsInterco &&
                    (section.Type == ContractType.Purchase || section.Type == ContractType.Sale)
                    && (section.SectionOriginId == 0) && (section.InvoicingStatusId == (long)InvoicingStatus.Uninvoiced))
                {
                    var intercoPhysicalFixedPricedContract = _mapper.Map<Section>(section);
                    intercoPhysicalFixedPricedContract.CompanyId = request.IntercoCompanyId;
                    intercoPhysicalFixedPricedContract.TraderId = request.IntercoTraderId;
                    intercoPhysicalFixedPricedContract.DepartmentId = request.IntercoDepartmentId;
                    intercoPhysicalFixedPricedContract.Type = (section.Type == ContractType.Purchase) ? ContractType.Sale : ContractType.Purchase;
                    intercoPhysicalFixedPricedContract.DataVersionId = dataVersionId;
                    intercoPhysicalFixedPricedContract.ContractDate = DateTime.UtcNow;
                    intercoPhysicalFixedPricedContract.PaymentTerms = section.PaymentTermCode;
                    intercoPhysicalFixedPricedContract.ContractTerms = section.ContractTermCode;
                    intercoPhysicalFixedPricedContract.ContractTermsLocation = section.ContractTermLocationCode;

                    string supplierCode = (section.Type == ContractType.Purchase) ? section.SellerCode : section.BuyerCode;
                    intercoPhysicalFixedPricedContract.Costs = (await _costRepository.LoadSectionCostsAsync(intercoPhysicalFixedPricedContract.SectionId,
                        request.Company, request.DataVersionId)).Where(c => c.SupplierCode == supplierCode).ToList();

                    // only one contract has to be always created
                    intercoPhysicalFixedPricedContract.NumberOfContract = 1;
                    intercoPhysicalFixedPricedContract.SectionId = 0;

                    var intercoReferences = (await _tradeRepository.CreatePhysicalContractAsImageAsync(intercoPhysicalFixedPricedContract)).ToList();

                    foreach (var intercoItem in intercoReferences)
                    {
                        if (intercoItem.SectionId > 0 && intercoPhysicalFixedPricedContract.Costs.Any())
                        {
                            foreach (var intercoCostItem in intercoPhysicalFixedPricedContract.Costs)
                            {
                                intercoCostItem.CostId = 0;
                                intercoCostItem.CompanyId = intercoPhysicalFixedPricedContract.CompanyId;
                                intercoCostItem.SectionId = intercoItem.SectionId;
                                intercoCostItem.DataVersionId = dataVersionId;
                                intercoCostItem.CostDirectionId = (intercoCostItem.CostDirectionId == 1) ? 2 : 1;
                            }

                            // check the business rule for PriceUnitId.
                            await _costRepository.AddCostsAsync(intercoPhysicalFixedPricedContract.Costs, intercoPhysicalFixedPricedContract.CompanyId, dataVersionId);
                        }
                    }

                    var childSectionsDto = await _sectionQueries.GetTradeChildSectionDataAsync(request.Company, request.SectionId, null, null);

                    if (childSectionsDto != null && childSectionsDto.Any())
                    {
                        IEnumerable<SectionDeprecated> childSections = MapChildSections(childSectionsDto);

                        CreateSplitCommand splitRequest = new CreateSplitCommand();
                        splitRequest.ChildSections = childSections;
                        splitRequest.CompanyId = request.IntercoCompanyId;
                        splitRequest.OriginalQuantity = section.Quantity;
                        splitRequest.Quantity = section.Quantity;
                        var sectionTrancheContract = _mapper.Map<SectionDeprecated>(splitRequest);
                        sectionTrancheContract.SectionId = intercoReferences.FirstOrDefault().SectionId;
                        sectionTrancheContract.ContractLabel = intercoReferences.FirstOrDefault().ContractLabel;
                        foreach (var splitTrancheItem in sectionTrancheContract.ChildSections)
                        {
                            splitTrancheItem.SectionId = 0;
                            splitTrancheItem.ContractId = intercoReferences.FirstOrDefault().PhysicalContractId;
                            splitTrancheItem.SectionOriginId = (int)intercoReferences.FirstOrDefault().SectionId;
                            splitTrancheItem.BuyerCode = intercoPhysicalFixedPricedContract.BuyerCode;
                            splitTrancheItem.SellerCode = intercoPhysicalFixedPricedContract.SellerCode;
                            splitTrancheItem.Memorandum = string.Empty;
                            splitTrancheItem.CounterpartyReference = string.Empty;
                            splitTrancheItem.DeliveryPeriodEndDate = intercoPhysicalFixedPricedContract.DeliveryPeriodEndDate.Value;
                            splitTrancheItem.DepartmentId = intercoPhysicalFixedPricedContract.DepartmentId;
                            splitTrancheItem.Status = ContractStatus.Unapproved;
                            splitTrancheItem.PricingMethod = intercoPhysicalFixedPricedContract.PricingMethod;
                        }

                        bool isTradeImage = true;
                        var splitTranchReferences = await _tradeRepository.CreateTrancheSplitAsync(sectionTrancheContract, request.IntercoCompanyId, isTradeImage);

                        // Inserting cost while creating an Image of a trade,if available
                        foreach (var childItem in splitTranchReferences)
                        {
                            int index = 0;
                            childItem.Costs = (await _costRepository.LoadSectionCostsAsync(childSectionsDto.ToList()[index].SectionId,
                                request.Company, request.DataVersionId)).Where(c => c.SupplierCode == supplierCode).ToList();

                            if (childItem.Costs != null)
                            {
                                foreach (var costItem in childItem.Costs)
                                {
                                    costItem.CostId = 0;
                                    costItem.CompanyId = intercoPhysicalFixedPricedContract.CompanyId;
                                    costItem.SectionId = childItem.SectionId;
                                    costItem.DataVersionId = dataVersionId;
                                    costItem.CostDirectionId = (costItem.CostDirectionId == 1) ? 2 : 1;
                                }

                                await _costRepository.AddCostsAsync(childItem.Costs, request.IntercoCompanyId, dataVersionId);
                            }
                            index++;
                        }
                    }



                    // Update Reference & Memo Details
                    var sourceDataVersionId = await _systemDateTimeService.GetCompanyCurrentDataVersionId(request.Company);

                    await UpdateReferenceAndInternalMemo(sourceDataVersionId,
                                 section.PhysicalContractId,
                                 request.IntercoCompanyId.ToUpper() + "/" + intercoReferences.FirstOrDefault().ContractLabel,
                                 dataVersionId,
                                 intercoReferences.FirstOrDefault().PhysicalContractId,
                                 request.Company.ToUpper() + "/" + section.ContractLabel,
                                 section.Type);

                    sectionReferences.AddRange(intercoReferences);

                    _logger.LogInformation("Manual Interco Contract with id {Atlas_ContractLabel} created.", intercoReferences.FirstOrDefault().ContractLabel);
                }

                _unitOfWork.Commit();

                return sectionReferences;
            }
            catch (Exception)
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        private async Task UpdateReferenceAndInternalMemo(long? sourceDataVersionId, long? sourcePhysicalContractId, string sourceCounterpartReferenceAndMemorandum,
                                long? targetDataVersionId, long? targetPhysicalContractId, string targetCounterpartReferenceAndMemorandum, ContractType contractType)
        {
            ReferenceInternalMemo referenceInternalMemo = new ReferenceInternalMemo();

            referenceInternalMemo.PhysicalContractInterCoId = null;
            referenceInternalMemo.DataVersionId = sourceDataVersionId;
            referenceInternalMemo.PhysicalContractId = sourcePhysicalContractId;
            referenceInternalMemo.CounterpartRef = sourceCounterpartReferenceAndMemorandum;
            referenceInternalMemo.Memorandum = "Inter-company transfer to " + sourceCounterpartReferenceAndMemorandum;

            referenceInternalMemo.LinkedDataVersionId = targetDataVersionId;
            referenceInternalMemo.LinkedPhysicalContractId = targetPhysicalContractId;
            referenceInternalMemo.LinkedCounterpartRef = targetCounterpartReferenceAndMemorandum;
            referenceInternalMemo.LinkedMemorandum = "Inter-company transfer from " + targetCounterpartReferenceAndMemorandum;
            referenceInternalMemo.InterCoTypeId = (contractType == ContractType.Purchase) ? 1 : 2;

            await _tradeRepository.UpdateReferenceAndInternalMemoAsync(referenceInternalMemo);
        }

        public List<Cost> CreateCostOnSplit(
            IEnumerable<Cost> costs,
            long sectionId,
            decimal originalQuantity,
            decimal quantity,
            decimal price,
            string companyId,
            bool isLastIteration,
            ContractStatus contractStatus)
        {
            List<Cost> costList = new List<Cost>();

            if (costs.Any())
            {
                foreach (var cost in costs)
                {
                    Cost childCost = GetChildCost(cost, sectionId, originalQuantity, quantity, price, companyId, contractStatus);

                    cost.CompanyId = companyId;
                    if (contractStatus == ContractStatus.Approved)
                    {
                        cost.OriginalEstRate = cost.Rate;
                    }

                    if (cost.RateTypeId == (int)RateType.Amount)
                    {
                        cost.Rate = cost.Rate - childCost.Rate;
                    }

                    costList.Add(childCost);

                    if (isLastIteration)
                    {
                        costList.Add(cost);
                    }
                }
            }

            return costList;
        }

        private Cost GetChildCost(
            Cost cost,
            long sectionId,
            decimal originalQuantity,
            decimal quantity,
            decimal price,
            string companyId,
            ContractStatus contractStatus)
        {
            Cost childCost = new Cost
            {
                CostId = -1,
                CompanyId = cost.CompanyId,
                CostDirectionId = cost.CostDirectionId,
                CostMatrixLineId = cost.CostMatrixLineId,
                CostTypeCode = cost.CostTypeCode,
                CurrencyCode = cost.CurrencyCode,
                Description = cost.Description,
                InPL = cost.InPL,
                InvoiceStatus = cost.InvoiceStatus,
                Narrative = cost.Narrative,
                NoAction = cost.NoAction,
                OriginalEstCurrencyCode = cost.OriginalEstCurrencyCode,
                OriginalEstimatedPMTValue = cost.OriginalEstimatedPMTValue,
                OriginalEstPriceUnitId = cost.OriginalEstPriceUnitId,
                OriginalEstRate = cost.OriginalEstRate,
                OriginalEstRateTypeId = cost.OriginalEstRateTypeId,
                PriceUnitId = cost.PriceUnitId,
                RateTypeId = cost.RateTypeId,
                SectionId = sectionId,
                SupplierCode = cost.SupplierCode,
            };

            switch (cost.RateTypeId)
            {
                case (int)RateType.Amount:
                    if (quantity > 0)
                    {
                        var perQuantity = originalQuantity / quantity;
                        childCost.Rate = 0;
                        if (perQuantity > 0)
                        {
                            childCost.Rate = cost.Rate / perQuantity;
                            if (contractStatus == ContractStatus.Approved)
                            {
                                childCost.OriginalEstRate = childCost.Rate;
                            }
                        }

                        if (contractStatus == ContractStatus.Approved)
                        {
                            childCost.OriginalEstimatedPMTValue = childCost.Rate / quantity;
                        }
                    }

                    break;
                case (int)RateType.Percent:
                    childCost.Rate = cost.Rate;
                    if (contractStatus == ContractStatus.Approved)
                    {
                        childCost.OriginalEstimatedPMTValue = ((cost.Rate / 100) * quantity * price) / quantity;
                    }

                    break;
                case (int)RateType.Rate:
                    childCost.Rate = cost.Rate;
                    if (contractStatus == ContractStatus.Approved)
                    {
                        childCost.OriginalEstimatedPMTValue = cost.Rate;
                    }

                    break;
            }

            return childCost;
        }

        public async Task<PhysicalDocumentReferenceDto> Handle(AssignContractAdviceCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var draftDocument = await _physicalDocumentStorageService.DownloadDraftDocumentByIdAsync(request.DocumentId);
                if (draftDocument?.FileContent == null)
                {
                    throw new AtlasBusinessException("Document has not found.");
                }

                var section = await _sectionRepository.GetSectionById(request.SectionId, request.Company, null);
                string counterPartyCode = section.Type == ContractType.Purchase ? section.SellerCode : section.BuyerCode;

                var validDocumentName = $"{request.Company}_CONADV_{request.SectionId}_PREVIEW_{counterPartyCode}_{_identityService.GetUserName()}";
                if (!draftDocument.DocumentName.Contains(validDocumentName, StringComparison.InvariantCultureIgnoreCase))
                {
                    throw new AtlasBusinessException(PhysicalDocumentMessages.GenerateErrorMessage(PhysicalDocumentType.ContractAdvice, PhysicalDocumentErrors.Naming));
                }

                var companyDate = await _systemDateTimeService.GetCompanyDate(request.Company);
                var documentName = $"{companyDate.ToString("yyyyMMdd_HHMMss", CultureInfo.InvariantCulture)}_{request.Company}_CONADV_{request.SectionId}_{counterPartyCode}{draftDocument.DocumentExtension}";

                var documentId = await _physicalDocumentStorageService.UploadDocument(new UploadDocumentParameters
                {
                    CompanyId = request.Company,
                    DocumentName = documentName,
                    File = draftDocument.FileContent,
                    DocumentTemplatePath = draftDocument.DocumentTemplate,
                    PhysicalDocumentTypeId = PhysicalDocumentType.ContractAdvice,
                    PhysicalDocumentStatus = PhysicalDocumentStatus.New,
                    RecordId = request.SectionId,
                    TableId = await GetApplicationTableId(),
                });

                await GenerateContractAdviceDocument(request.SectionId, request.Company, request.DocumentTemplatePath, true);

                _unitOfWork.Commit();

                return new PhysicalDocumentReferenceDto { PhysicalDocumentId = documentId };
            }
            catch (Exception)
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<PhysicalDocumentReferenceDto> Handle(GenerateContractAdviceCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var documentId = await GenerateContractAdviceDocument(request.SectionId, request.Company, request.DocumentTemplatePath, false);

                _unitOfWork.Commit();

                _logger.LogInformation("Document with id {Atlas_DocumentId} has been created by user {Atlas_UserId}.", documentId, _identityService.GetUserName());

                return new PhysicalDocumentReferenceDto { PhysicalDocumentId = documentId };
            }
            catch (Exception)
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<PhysicalDocumentReferenceDto> Handle(UpdateContractAdviceCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var draftDocument = await _physicalDocumentStorageService.DownloadDraftDocumentByIdAsync(request.DraftDocumentId);
                if (draftDocument?.FileContent == null)
                {
                    throw new AtlasBusinessException("Document has not found.");
                }

                var section = await _sectionRepository.GetSectionById(request.SectionId, request.Company, null);
                if (section == null)
                {
                    throw new AtlasBusinessException("Section has not found");
                }

                string counterPartyCode = section.Type == ContractType.Purchase ? section.SellerCode : section.BuyerCode;

                var validPreviewDocumentName = $"{request.Company}_CONADV_{request.SectionId}_PREVIEW_{counterPartyCode}";
                var validDocumentName = $"{request.Company}_CONADV_{request.SectionId}_{counterPartyCode}";

                if (!draftDocument.DocumentName.Contains(validPreviewDocumentName, StringComparison.InvariantCultureIgnoreCase) &&
                    !draftDocument.DocumentName.Contains(validDocumentName, StringComparison.InvariantCultureIgnoreCase))
                {
                    throw new AtlasBusinessException("The uploaded file is invalid, the filename has been modified. Please upload the document with the original filename.");
                }

                var companyDate = await _systemDateTimeService.GetCompanyDate(request.Company);
                var documentName = $"{companyDate.ToString("yyyyMMdd_HHMMss", CultureInfo.InvariantCulture)}_{request.Company}_CONADV_{request.SectionId}_{counterPartyCode}{draftDocument.DocumentExtension}";

                var documentId = await _physicalDocumentStorageService.UploadDocument(new UploadDocumentParameters
                {
                    CompanyId = request.Company,
                    DocumentName = documentName,
                    File = draftDocument.FileContent,
                    DocumentTemplatePath = draftDocument.DocumentTemplate,
                    PhysicalDocumentTypeId = PhysicalDocumentType.ContractAdvice,
                    PhysicalDocumentStatus = PhysicalDocumentStatus.New,
                    RecordId = request.SectionId,
                    TableId = await GetApplicationTableId(),
                });

                await _physicalDocumentStorageService.UpdateDocumentStatus(request.PhysicalDocumentId, PhysicalDocumentStatus.Deprecated);

                _unitOfWork.Commit();

                return new PhysicalDocumentReferenceDto { PhysicalDocumentId = documentId };
            }
            catch (Exception)
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        private async Task<long> GenerateContractAdviceDocument(long sectionId, string company, string templatePath, bool isPreview)
        {
            var template = await _physicalDocumentGenerationService.GetTemplateByPath(templatePath, PhysicalDocumentType.ContractAdvice, company);

            if (template == null)
            {
                throw new AtlasBusinessException($"Cannot find requested template: {templatePath}");
            }

            var section = await _sectionRepository.GetSectionById(sectionId, company, null);

            var reportParameters = new Dictionary<string, string>
            {
                { "CompanyId", company },
                { "PhysicalContractId", section.PhysicalContractId.ToString(CultureInfo.InvariantCulture) }
            };

            var documentResponse = await _physicalDocumentGenerationService.GenerateDocument(templatePath, reportParameters, PhysicalDocumentFormat.WORDOPENXML);

            var companyDate = await _systemDateTimeService.GetCompanyDate(company);
            string counterPartyCode = section.Type == ContractType.Purchase ? section.SellerCode : section.BuyerCode;

            string documentName;
            if (isPreview)
            {
                documentName = $"{companyDate.ToString("yyyyMMdd_HHMMss", CultureInfo.InvariantCulture)}_{company}_CONADV_{sectionId}_PREVIEW_{counterPartyCode}.{documentResponse.Extension}";
            }
            else
            {
                documentName = $"{companyDate.ToString("yyyyMMdd_HHMMss", CultureInfo.InvariantCulture)}_{company}_CONADV_{sectionId}_{counterPartyCode}.{documentResponse.Extension}";
            }

            var documentId = await _physicalDocumentStorageService.UploadDocument(
                new UploadDocumentParameters
                {
                    CompanyId = company,
                    DocumentName = documentName,
                    File = documentResponse.Result,
                    DocumentTemplatePath = template.Path,
                    PhysicalDocumentTypeId = PhysicalDocumentType.ContractAdvice,
                    PhysicalDocumentStatus = isPreview ? PhysicalDocumentStatus.Preview : PhysicalDocumentStatus.New,
                    RecordId = sectionId,
                    TableId = await GetApplicationTableId(),
                });

            _logger.LogInformation("Document with id {Atlas_DocumentId} has been created by user {Atlas_UserId}.", documentId, _identityService.GetUserName());

            return documentId;
        }

        private async Task<int> GetApplicationTableId()
        {
            var table = (await _applicationTableQueries.GetApplicationTablesAsync(PhysicalDocumentType.ContractAdvice.GetApplicationTableName())).FirstOrDefault();

            if (table == null)
            {
                throw new Exception($"Table \"{PhysicalDocumentType.ContractAdvice.GetApplicationTableName()}\" not found in application tables.");
            }

            return table.TableId;
        }

        public async Task<Unit> Handle(UpdateBulkApprovalCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();
            decimal weightCodeConversion = 0;
            decimal companyWeightUnit = 0;
            decimal priceCodeConversion = 0;
            try
            {
                // Estimating costs

                var dateVersionId = await _systemDateTimeService.GetCompanyCurrentDataVersionId(request.CompanyId);
                List<Cost> costList = new List<Cost>();
                foreach (var sectionId in request.SectionIds)
                {
                    // Load domain objects
                    var section = await _sectionRepository.GetSectionById(sectionId, request.CompanyId, dateVersionId);

                    var costs = (await _costRepository.LoadSectionCostsAsync(sectionId, request.CompanyId, dateVersionId)).ToList();
                    if (costs.Any() && section.FirstApprovalDateTime == null)
                    {
                        var fxRates = await _masterDataService.GetFxRatesAsync(section.FirstApprovalDateTime);
                        var weightUnits = (await _masterDataService.GetWeightUnitsAsync(request.CompanyId)).ToList();
                        var priceUnits = (await _masterDataService.GetPriceUnitsAsync(request.CompanyId)).ToList();
                        var conversionRate = fxRates.FirstOrDefault(x => x.CurrencyCode == section.CurrencyCode);
                        if (conversionRate?.Rate == null)
                        {
                            // TODO: reactivate this code when FX Rate is ready
                            // throw new Exception(string.Format("Conversion rate not available for '{0}' currency", section.Currency));
                            conversionRate = new MasterData.Common.Entities.FxRate { Rate = 1, CurrencyRoeType = "D" };
                        }

                        var companyDetails = await _masterDataService.GetCompanyByIdAsync(section.CompanyId);

                        var tradeWeightUnit = weightUnits.First(x => x.WeightUnitId == section.WeightUnitId);
                        var mtWeightUnit = weightUnits.First(x => x.WeightCode == "MT");

                        var tradeQuantityMt = (section.Quantity * tradeWeightUnit.ConversionFactor) /
                                              mtWeightUnit.ConversionFactor;
                        var pmtPriceUnit = priceUnits.First(x => x.PriceCode == companyDetails.PriceCode);

                        // weight Code Conversion calculation
                        var filteredWeight = weightUnits;
                        var selectedWeight = filteredWeight.Where(weight => weight.WeightUnitId == section.WeightUnitId).ToArray();
                        var companyWeight = filteredWeight.Where(weight => weight.WeightCode == companyDetails.WeightCode).ToArray();
                        if (selectedWeight != null && selectedWeight.Any() && companyWeight != null && companyWeight.Any())
                        {
                            // we will always get one row at a time
                            weightCodeConversion = selectedWeight[0].ConversionFactor;
                            companyWeightUnit = companyWeight[0].ConversionFactor;
                        }

                        var tradeQuantity = section.Quantity;
                        foreach (var cost in costs)
                        {
                            cost.OriginalEstCurrencyCode = cost.CurrencyCode;
                            cost.OriginalEstPriceUnitId = cost.PriceUnitId;
                            cost.OriginalEstRate = cost.Rate;
                            cost.OriginalEstRateTypeId = cost.RateTypeId;
                            cost.CompanyId = request.CompanyId;

                            switch (cost.OriginalEstRateTypeId)
                            {
                                case (int)RateType.Rate:
                                    {
                                        // Price Code Conversion calculation
                                        var filteredPrice = priceUnits;
                                        var selectedPrice = filteredPrice.Where((price) => price.PriceUnitId == cost.PriceUnitId).ToArray();
                                        if (selectedPrice != null && selectedPrice.Any())
                                        {
                                            // we will always get one row at a time
                                            priceCodeConversion = selectedPrice[0].ConversionFactor;
                                        }
                                        var costAmount = cost.Rate * priceCodeConversion * tradeQuantity * weightCodeConversion;

                                        cost.OriginalEstimatedPMTValue = costAmount / ((section.Quantity * weightCodeConversion) / companyWeightUnit);
                                    }

                                    break;
                                case (int)RateType.Amount:
                                    {
                                        var costAmount = cost.Rate;
                                        cost.OriginalEstimatedPMTValue = costAmount / ((section.Quantity * weightCodeConversion) / companyWeightUnit);
                                    }

                                    break;
                                case (int)RateType.Percent:
                                    {
                                        var costAmount = section.ContractedValue * (cost.Rate / 100);
                                        cost.OriginalEstimatedPMTValue = costAmount / ((section.Quantity * weightCodeConversion) / companyWeightUnit);
                                    }

                                    break;
                                default:
                                    throw new AtlasBusinessException(
                                        $"Invalid cost rate type: {cost.OriginalEstRateTypeId}");
                            }

                        }

                        costList.AddRange(costs);
                    }
                }

                // Approving trades
                await _sectionRepository.UpdateBulkApproval(request.CompanyId, request.SectionIds);

                // Updating costs
                if (costList.Any())
                {
                    await _costRepository.AddUpdateCostsAsync(costList, request.CompanyId, dateVersionId);
                }

                _unitOfWork.Commit();
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }

            return Unit.Value;
        }

        /// <summary>
        /// Get the invoice marking of the parent
        /// Foreach child section, create the new invoice marking
        /// Update the invoice marking of the parent
        /// </summary>
        /// <param name="request">SplitCostsOfSection containing the new sections splitted</param>
        /// <param name="quantity">the original section quantity</param>
        /// <param name="invoiceStatusId">the invoice status id</param>
        /// <param name="cancellationToken">the cancellation token</param>
        private async Task CreateInvoiceMarkingsSplit(
            SplitSectionCommand request,
            decimal quantity,
            long invoiceStatusId,
            CancellationToken cancellationToken)
        {
            IEnumerable<InvoiceMarkingDto> invoiceMarkings = await _invoiceMarkingQueries.GetSectionInvoiceMarkingsAsync(request.SectionOriginId, request.Company, null);
            foreach (var invoiceMarking in invoiceMarkings)
            {
                List<InvoiceMarkingDto> invoiceMarkingsSplitted = new List<InvoiceMarkingDto>();

                foreach (var createdSection in request.ChildSections)
                {
                    var percentage = quantity == 0 ? 1 : createdSection.SplitQuantity / quantity;

                    // Calculate new invoice marking amount for the new child cost
                    InvoiceMarkingDto invoiceMarkingSplitted = new InvoiceMarkingDto
                    {
                        CostId = null,
                        SectionId = createdSection.ChildSectionId,
                        InvoiceLineId = invoiceMarking.InvoiceLineId,
                        InvoiceDate = invoiceMarking.InvoiceDate,
                        InvoiceReference = invoiceMarking.InvoiceReference,
                        PostingStatusId = invoiceMarking.PostingStatusId,
                        InvoiceAmount = invoiceMarking.InvoiceAmount * percentage, // not splitted
                        InvoicePercent = invoiceMarking.InvoicePercent,
                        DueDate = invoiceMarking.DueDate,
                        PaymentTermCode = invoiceMarking.PaymentTermCode,
                        PaidAmount = invoiceMarking.PaidAmount,
                        CustomerRef = invoiceMarking.CustomerRef,
                        PaidPercentage = invoiceMarking.PaidPercentage,
                        CashMatchDate = invoiceMarking.CashMatchDate,
                        RemainingAmount = invoiceMarking.RemainingAmount * percentage, // not splitted
                        Quantity = invoiceMarking.InvoicedQuantity * percentage,
                        CompanyId = request.Company
                    };

                    invoiceMarkingsSplitted.Add(invoiceMarkingSplitted);
                }

                // Save the new splitted invoice marking - invoiceStatus is null because it is used only for costs invoice markings
                await _invoiceMarkingRepository.AddInvoiceMarkingAsync(invoiceMarkingsSplitted, (int)invoiceStatusId, request.Company);

                // Update original invoice marking
                invoiceMarking.InvoiceAmount = invoiceMarking.InvoiceAmount - invoiceMarkingsSplitted.Sum(im => im.InvoiceAmount);
                invoiceMarking.RemainingAmount = invoiceMarking.RemainingAmount - invoiceMarkingsSplitted.Sum(im => im.RemainingAmount);
                invoiceMarking.Quantity = invoiceMarking.InvoicedQuantity - invoiceMarkingsSplitted.Sum(im => im.Quantity);

                // Update the original invoice marking - invoiceStatus is null because it is used only for costs invoice markings
                await _invoiceMarkingRepository.UpdateInvoiceMarkingAsync(invoiceMarking, (int)invoiceStatusId, request.Company);
            }
        }

        private async Task SplitSectionTraffic(
            SplitSectionCommand request,
            long? chartedId,
            CancellationToken cancellationToken)
        {
            SectionTrafficDto sectionTraffic = await _sectionRepository.LoadSectionTraffic(request.SectionOriginId, request.Company, null);
            List<SectionTrafficDto> childSectionTraffic = new List<SectionTrafficDto>();
            foreach (var childSection in request.ChildSections)
            {
                var newSectionTraffic = new SectionTrafficDto
                {
                    SectionId = childSection.ChildSectionId,
                    BLDate = sectionTraffic.BLDate,
                    BLReference = sectionTraffic.BLReference,
                    VesselCode = sectionTraffic.VesselCode,
                    CompanyId = sectionTraffic.CompanyId,
                    VesselId = sectionTraffic.VesselId,
                    ShippingStatusId = sectionTraffic.ShippingStatusId,
                    ShippingStatusCode = sectionTraffic.ShippingStatusCode,
                    CreatedDateTime = sectionTraffic.CreatedDateTime,
                    CreatedBy = sectionTraffic.CreatedBy,
                    ContractDate = sectionTraffic.ContractDate,
                    ModifiedBy = null,
                    ModifiedDateTime = null
                };
                childSectionTraffic.Add(newSectionTraffic);
            }

            if (chartedId != null)
            {
                List<long> sectionList = childSectionTraffic.Select(x => x.SectionId).ToList();
                await _sectionRepository.AssignSectionsToCharterAsync(chartedId, sectionList, request.Company);
                await _sectionRepository.UpdateSectionTraffic(childSectionTraffic, request.Company);
            }
        }

        /// <summary>
        /// Calculate new values for costs
        /// Get invoice markings for those costs
        /// Calculate new values for invoice marking
        /// Save new and update original costs and invoice markings
        /// </summary>
        /// <param name="request">SplitCostsOfSection containing the new sections splitted</param>
        /// <param name="quantity">the original section quantity</param>
        /// <param name="price">the original price</param>
        /// <param name="contractStatusCode">the original contract status code</param>
        /// <param name="cancellationToken">the cancellation token</param>
        private async Task CreateCostsSplit(
        SplitSectionCommand request,
        decimal quantity,
        decimal price,
        ContractStatus contractStatusCode,
        CancellationToken cancellationToken)
        {
            var costs = await _costRepository.LoadSectionCostsAsync(request.SectionOriginId, request.Company, null);

            foreach (var cost in costs)
            {
                List<(decimal, Cost)> createdCosts = new List<(decimal, Cost)>();

                foreach (var childSection in request.ChildSections)
                {
                    // Get child cost with updated values
                    Cost childCost = GetChildCost(
                        cost,
                        childSection.ChildSectionId,
                        quantity,
                        childSection.SplitQuantity,
                        price,
                        request.Company,
                        contractStatusCode);

                    // Save the new child cost
                    List<Cost> costToSave = new List<Cost>();
                    costToSave.Add(childCost);
                    var percentage = quantity != 0 ? childSection.SplitQuantity / quantity : 100;

                    Cost newCost = (await _costRepository.AddCostsAsync(costToSave, request.Company, null)).FirstOrDefault();
                    createdCosts.Add((percentage, newCost));

                    // saving the cost invoicing status id, to map the one of the parent.
                    // this should have been done in the CreateCost method, but the SP forces the invoicingStatusId to 1...
                    // and due to the proximity of the deployemnt, the choice has been done to call a new SP which updates
                    // this status
                    await _costRepository.UpdateCostInvoicingStatusAsync(
                        newCost.CostId,
                        cost.InvoiceStatus,
                        request.Company);
                }

                IEnumerable<InvoiceMarkingDto> invoiceMarkings = await _invoiceMarkingQueries.GetCostInvoiceMarkingsAsync(cost.CostId, request.Company);

                foreach (var invoiceMarking in invoiceMarkings)
                {
                    List<InvoiceMarkingDto> invoiceMarkingsSplitted = new List<InvoiceMarkingDto>();

                    foreach (var (percentage, createdCost) in createdCosts)
                    {
                        // Calculate new invoice marking amount for the new child cost
                        InvoiceMarkingDto invoiceMarkingSplitted = new InvoiceMarkingDto
                        {
                            CostId = createdCost.CostId,
                            SectionId = invoiceMarking.SectionId == null ? createdCost.SectionId : (long?)null,
                            InvoiceLineId = invoiceMarking.InvoiceLineId,
                            InvoiceDate = invoiceMarking.InvoiceDate,
                            InvoiceReference = invoiceMarking.InvoiceReference,
                            PostingStatusId = invoiceMarking.PostingStatusId,
                            InvoiceAmount = invoiceMarking.InvoiceAmount * percentage,
                            InvoicePercent = invoiceMarking.InvoicePercent,
                            DueDate = invoiceMarking.DueDate,
                            PaymentTermCode = invoiceMarking.PaymentTermCode,
                            PaidAmount = invoiceMarking.PaidAmount,
                            CustomerRef = invoiceMarking.CustomerRef,
                            PaidPercentage = invoiceMarking.PaidPercentage,
                            CashMatchDate = invoiceMarking.CashMatchDate,
                            RemainingAmount = invoiceMarking.RemainingAmount * percentage,
                            CompanyId = request.Company
                        };
                        invoiceMarkingsSplitted.Add(invoiceMarkingSplitted);
                    }

                    // Save the new splitted invoice marking
                    await _invoiceMarkingRepository.AddInvoiceMarkingAsync(invoiceMarkingsSplitted, cost.InvoiceStatus, request.Company);

                    // Update original invoice marking
                    invoiceMarking.InvoiceAmount = invoiceMarking.InvoiceAmount - invoiceMarkingsSplitted.Sum(im => im.InvoiceAmount);
                    invoiceMarking.RemainingAmount = invoiceMarking.RemainingAmount - invoiceMarkingsSplitted.Sum(im => im.RemainingAmount);

                    // Update the original invoice marking
                    await _invoiceMarkingRepository.UpdateInvoiceMarkingAsync(invoiceMarking, cost.InvoiceStatus, request.Company);
                }

                // Update original cost
                if ((contractStatusCode == ContractStatus.Approved) || (cost.RateTypeId == (int)RateType.Amount))
                {
                    if (contractStatusCode == ContractStatus.Approved)
                    {
                        cost.OriginalEstRate = cost.Rate;
                    }

                    if (cost.RateTypeId == (int)RateType.Amount)
                    {
                        foreach (var (p, createdCost) in createdCosts)
                        {
                            cost.Rate = cost.Rate - createdCost.Rate;
                        }
                    }

                    await _costRepository.UpdateCostAsync(cost, request.Company);
                }
            }
        }

        public async Task<long> Handle(CreateFavouriteCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {

                // Contract Term
                var contractTerms = await _masterDataService.GetContractTermsAsync(request.CompanyId);
                if (contractTerms != null)
                {
                    var contractTerm = contractTerms.FirstOrDefault(ct => ct.ContractTermCode == request.TradeFavoriteToBeCreated.ContractTermCode);
                    if (contractTerm != null)
                    {
                        request.TradeFavoriteToBeCreated.ContractTermId = contractTerm.ContractTermId;
                    }
                }

                // Counterparty Buyer & Seller
                var counterparties = await _masterDataService.GetCounterpartiesAsync(request.CompanyId);
                if (counterparties != null)
                {
                    var buyerCode = counterparties.FirstOrDefault(cp => cp.CounterpartyCode == request.TradeFavoriteToBeCreated.BuyerCode);
                    if (buyerCode != null)
                    {
                        request.TradeFavoriteToBeCreated.BuyerId = buyerCode.CounterpartyID;
                    }

                    var sellerCode = counterparties.FirstOrDefault(cp => cp.CounterpartyCode == request.TradeFavoriteToBeCreated.SellerCode);
                    if (sellerCode != null)
                    {
                        request.TradeFavoriteToBeCreated.SellerId = sellerCode.CounterpartyID;
                    }
                }

                // Arbitration
                var arbitrations = await _masterDataService.GetArbitrationsAsync(request.CompanyId);
                if (arbitrations != null)
                {
                    var arbitrationCode = arbitrations.FirstOrDefault(a => a.ArbitrationCode == request.TradeFavoriteToBeCreated.ArbitrationCode);
                    if (arbitrationCode != null)
                    {
                        request.TradeFavoriteToBeCreated.ArbitrationId = arbitrationCode.ArbitrationId;
                    }
                }

                // Payment Term
                var paymentTerms = await _masterDataService.GetPaymentTermsAsync(request.CompanyId);
                if (paymentTerms != null)
                {
                    var paymentTermCode = paymentTerms.FirstOrDefault(pt => pt.PaymentTermsCode == request.TradeFavoriteToBeCreated.PaymentTermCode);
                    if (paymentTermCode != null)
                    {
                        request.TradeFavoriteToBeCreated.PaymentTermsId = paymentTermCode.PaymentTermsId;
                    }
                }

                // Port Buyer & Seller
                var ports = await _masterDataService.GetPortsAsync(request.CompanyId);
                if (ports != null)
                {
                    if (!string.IsNullOrEmpty(request.TradeFavoriteToBeCreated.PortOriginCode))
                    {
                        var portOriginCode = ports.FirstOrDefault(p => p.PortCode == request.TradeFavoriteToBeCreated.PortOriginCode);
                        if (portOriginCode != null)
                        {
                            request.TradeFavoriteToBeCreated.OriginPortId = portOriginCode.PortId;
                        }
                    }

                    if (!string.IsNullOrEmpty(request.TradeFavoriteToBeCreated.PortDestinationCode))
                    {
                        var portDestinationCode = ports.FirstOrDefault(p => p.PortCode == request.TradeFavoriteToBeCreated.PortDestinationCode);
                        if (portDestinationCode != null)
                        {
                            request.TradeFavoriteToBeCreated.DestinationPortId = portDestinationCode.PortId;
                        }
                    }

                    var contractTermLocationCode = ports.FirstOrDefault(p => p.PortCode == request.TradeFavoriteToBeCreated.ContractTermLocationCode);
                    if (contractTermLocationCode != null)
                    {
                        request.TradeFavoriteToBeCreated.ContractTermLocationId = contractTermLocationCode.PortId;
                    }
                }

                if (request.TradeFavoriteToBeCreated.Costs != null && request.TradeFavoriteToBeCreated.Costs.Any())
                {
                    // Cost Type
                    var costTypes = await _masterDataService.GetCostTypesAsync(request.CompanyId);
                    if (costTypes != null)
                    {
                        foreach (var costItem in request.TradeFavoriteToBeCreated.Costs)
                        {
                            var costTypeCode = costTypes.FirstOrDefault(ct => ct.CostTypeCode == costItem.CostTypeCode);
                            if (costTypeCode != null)
                            {
                                costItem.CostTypeId = costTypeCode.CostTypeId;
                            }

                            if (!string.IsNullOrEmpty(costItem.SupplierCode))
                            {
                                var supplierCode = counterparties.FirstOrDefault(s => s.CounterpartyCode == costItem.SupplierCode);
                                if (supplierCode != null)
                                {
                                    costItem.SupplierId = supplierCode.CounterpartyID;
                                }
                            }
                        }
                    }
                }

                var tradeFavoriteId = await _sectionRepository.CreateTradeFavouriteAsync(request.TradeFavoriteToBeCreated, request.CompanyId);
                _unitOfWork.Commit();
                return tradeFavoriteId;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<Unit> Handle(DeleteTradeFavoriteCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                await _sectionRepository.DeleteTradeFavoriteAsync(request.TradeFavoriteId);
                _logger.LogInformation("Trade Favorite with id {Atlas_TradeFavoriteId} deleted.", request.TradeFavoriteId);

                _unitOfWork.Commit();
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }

            return Unit.Value;
        }

        /// <summary>
        /// Handle Delete Section Command.
        /// </summary>
        /// <param name="request">The delete command request.</param>
        /// <param name="cancellationToken">The cancellation token</param>
        public async Task<Unit> Handle(DeleteSectionCommand request, CancellationToken cancellationToken)
        {
            var section = await _sectionQueries.GetSectionByIdAsync(request.SectionId, request.Company, null);

            if (section.AllocatedTo != null || section.AllocatedToId != null || section.Quantity > 0 || section.ChildSections != null)
            {
                throw new AtlasBusinessException($"Invalid section for deletion");
            }
            else
            {
                _unitOfWork.BeginTransaction();
                try
                {
                    // Delete section
                    await _sectionRepository.DeleteSectionAsync(new long[] { request.SectionId }, request.Company);

                    _logger.LogInformation("Section with id {Atlas_SectionId} deleted.", request.SectionId);

                    _unitOfWork.Commit();
                }
                catch (Exception)
                {
                    _unitOfWork.Rollback();
                    throw;
                }

                return Unit.Value;
            }
        }

        /// <summary>
        /// Handle Close Section Command.
        /// </summary>
        /// <param name="request">The close command request.</param>
        /// <param name="cancellationToken">The cancellation token</param>
        public async Task<Unit> Handle(CloseSectionStatusCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                await _sectionRepository.CloseSectionAsync(request.SectionIds.ToArray(), request.Company, request.DataVersionId);

                _logger.LogInformation("Section with id {Atlas_SectionId} closed.", string.Join(", ", request.SectionIds));

                _unitOfWork.Commit();
            }
            catch (Exception)
            {
                _unitOfWork.Rollback();
                throw;
            }
            return Unit.Value;
        }

        /// <summary>
        /// Handle Open Section Command.
        /// </summary>
        /// <param name="request">The open command request.</param>
        /// <param name="cancellationToken">The cancellation token</param>
        public async Task<Unit> Handle(OpenSectionStatusCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                await _sectionRepository.OpenSectionAsync(request.SectionIds, request.Company,request.DataVersionId);

                _logger.LogInformation("Section with id {Atlas_SectionId} reopned.", string.Join(", ", request.SectionIds));

                _unitOfWork.Commit();
            }
            catch (Exception)
            {
                _unitOfWork.Rollback();
                throw;
            }

            return Unit.Value;
        }

        public async Task<Unit> Handle(CancelSectionStatusCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                await _sectionRepository.CancelSectionAsync(request.SectionIds, request.Company, request.BlDate);

                _logger.LogInformation("Section with id {Atlas_SectionId} cancelled.", string.Join(", ", request.SectionIds));

                _unitOfWork.Commit();
            }
            catch (Exception)
            {
                _unitOfWork.Rollback();
                throw;
            }

            return Unit.Value;
        }

        public async Task<Unit> Handle(ReverseCancelSectionStatusCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                await _sectionRepository.UnCancelSectionAsync(request.SectionIds, request.Company);

                _logger.LogInformation("Section with id {Atlas_SectionId} reverse cancelled.", string.Join(", ", request.SectionIds));

                _unitOfWork.Commit();
            }
            catch (Exception)
            {
                _unitOfWork.Rollback();
                throw;
            }

            return Unit.Value;
        }

        public async Task<IntercoValidation> Handle(IntercoValidationCommand request, CancellationToken cancellationToken)
        {
            IntercoValidation intercoValidation = new IntercoValidation();
            try
            {
                intercoValidation.CompanyId = request.IntercoValidation.CompanyId;
                var missingDataList = await _tradeRepository.ValidateIntercoValidation(request.IntercoValidation);
                if (missingDataList != null)
                {
                    intercoValidation.IntercoFields = new List<IntercoField>();
                    foreach (var missingData in missingDataList)
                    {
                        intercoValidation.IntercoFields.Add(new IntercoField
                        {
                            GroupId = 0,
                            Name = missingData.FieldName,
                            Value = missingData.FieldValue,
                            Type = missingData.GroupName
                        });
                    }
                }

                _logger.LogInformation("Validate Interco Fields {Atlas_IntercoFieldsForCompanyId} validated.", request.IntercoValidation.CompanyId);
            }
            catch
            {
                throw;
            }
            return intercoValidation;
        }

        public async Task<IEnumerable<CostBulkEdit>> Handle(SaveBulkCostsCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();
            List<CostBulkEdit> newCostsCreated = new List<CostBulkEdit>();
            try
            {
                List<CostBulkEdit> newCost = new List<CostBulkEdit>();
                List<CostBulkEdit> costsToUpdate = new List<CostBulkEdit>();
                List<CostBulkEdit> costsToDelete = new List<CostBulkEdit>();
                List<InvoiceMarkingCostLines> costInvoiceLinesToUpdate = new List<InvoiceMarkingCostLines>();

                foreach (CostBulkEdit cost in request.Costs)
                {
                    if (!string.IsNullOrEmpty(cost.RowStatus))
                    {
                        if (cost.IsDelete)
                        {
                            costsToDelete.Add(cost);
                        }
                        else if (cost.RowStatus.ToLower() == "n")
                        {
                            newCost.Add(cost);
                        }
                        else if (cost.RowStatus.ToLower() == "a")
                        {
                            costsToUpdate.Add(cost);
                        }
                    }
                }

                if (costsToDelete.Count() > 0)
                {
                    var costsDeleted = await _costRepository.DeleteCostsForTradeCostBulkEditAsync(request.Company, costsToDelete, request.DataVersionId);
                    if (costsDeleted.Count() > 0)
                    {
                        foreach (long costId in costsDeleted)
                        {
                            if (costId != null)
                            {
                                _logger.LogInformation("Cost with id {Atlas_CostID} Deleted.", costId);
                            }
                        }
                    }
                }

                if (newCost.Count > 0)
                {
                    var costsCreated = await _costRepository.AddBulkCostsAsync(newCost, request.Company, request.DataVersionId);
                    if (costsCreated.Count() > 0)
                    {
                        foreach (CostBulkEdit cost in costsCreated)
                        {
                            if (cost.CostId != null)
                            {
                                _logger.LogInformation("Cost with id {Atlas_CostID} Created.", cost.CostId);
                            }

                            cost.RowStatus = "N";
                            newCostsCreated.Add(cost);
                        }
                    }
                }

                if (costsToUpdate.Count > 0)
                {
                    var invoiceLines = await _sectionQueries.GetInvoiceLinesForBulkCosts(costsToUpdate, request.Company, request.DataVersionId);
                    decimal totalInvoicePercent = 0;
                    decimal costInvoicePercent = 0;
                    if (invoiceLines.Any())
                    {
                        foreach (CostBulkEdit cost in costsToUpdate)
                        {
                            var costInvoiceLines = costInvoiceLinesToUpdate.Any(x => x.CostId == cost.CostId);
                            if (!costInvoiceLines || costInvoiceLinesToUpdate.Count == 0)
                            {
                                totalInvoicePercent = invoiceLines.Where(x => x.CostId == cost.CostId).Sum(x => x.InvoicePercent);

                                foreach (InvoiceMarkingCostLines invoiceLine in invoiceLines.Where(x => x.CostId == cost.CostId))
                                {
                                    costInvoicePercent = (cost.InvoicePercent * 100) / totalInvoicePercent;
                                    invoiceLine.InvoicePercent = (costInvoicePercent * invoiceLine.InvoicePercent) / 100;
                                    costInvoiceLinesToUpdate.Add(invoiceLine);
                                }
                            }
                        }
                    }


                    var costsUpdated = await _costRepository.UpdateBulkCostsAsync(costsToUpdate, costInvoiceLinesToUpdate, request.Company, request.DataVersionId);
                    if (costsUpdated.Count() > 0)
                    {
                        foreach (CostBulkEdit cost in costsUpdated)
                        {
                            if (cost.CostId != null)
                            {
                                _logger.LogInformation("Cost with id {Atlas_CostID} Updated.", cost.CostId);
                            }
                        }
                    }
                }


                _unitOfWork.Commit();

            }
            catch (Exception)
            {
                _unitOfWork.Rollback();
                throw;
            }

            return newCostsCreated;
        }

        //public async Task<IEnumerable<SectionReference>> Handle(CreateTrancheCommand request, CancellationToken cancellationToken)
        //{
        //    _unitOfWork.BeginTransaction();

        //    try
        //    {
        //        // Load the section to slice
        //        var section = await _sectionRepository.GetSectionById(request.SectionId, request.Company);

        //        if (section == null)
        //        {
        //            throw new NotFoundException("Section", request.SectionId);
        //        }

        //        // The contract cannot be cut into tranches according to those criteria :
        //        // - Contract section is closed
        //        // - Contract “Quantity” is equal to 0
        //        // - Contract section is allocated

        //        //if (section.ContractStatusCode == ContractStatus.Invoiced)
        //        //{
        //        //    throw new AtlasBusinessException("Contract cannot be sliced: Contract section is closed");
        //        //}

        //        if (section.Quantity <= 0)
        //        {
        //            throw new AtlasBusinessException("Contract cannot be sliced: Contract “Quantity” is equal to 0");
        //        }

        //        if (section.AllocatedTo != null)
        //        {
        //            throw new AtlasBusinessException("Contract cannot be sliced: Contract section is allocated");
        //        }

        //        // Validate tranches
        //        // Tranche quantity is equal or less than parent “quantity”. If not, there should be an error message displayed “Cannot be more than the parent “quantity”.
        //        // Contract quantity is > 0
        //        if (section.Quantity < request.Sections.Sum(s => s.Quantity))
        //        {
        //            throw new AtlasBusinessException("Contract cannot be sliced: Tranches quantities cannot be more than the parent “quantity”");
        //        }

        //        foreach (var trancheSplitSection in request.Sections)
        //        {

        //        }

        //        var sectionTrancheContract = _mapper.Map<SectionDeprecated>(request);

        //        var references = await _sectionRepository.CreateSectionsAsync(sectionTrancheContract, request.Company);

        //        foreach (var sectionReference in references)
        //        {
        //            _logger.LogInformation("New tranche created with id {SectionId}", sectionReference.SectionId);
        //        }

        //        _unitOfWork.Commit();

        //        return references;
        //    }
        //    catch
        //    {
        //        _unitOfWork.Rollback();
        //        throw;
        //    }
        //}

        //public async Task<IEnumerable<SectionReference>> Handle(CreateSplitCommand request, CancellationToken cancellationToken)
        //{
        //    _unitOfWork.BeginTransaction();

        //    try
        //    {
        //        var user = _identityService.GetUserName();

        //        var sectionTrancheContract = _mapper.Map<SectionDeprecated>(request);

        //        var references = await _sectionRepository.CreateSectionsAsync(sectionTrancheContract, request.Company);

        //        foreach (var section in references)
        //        {
        //            _logger.LogInformation("New split created with id {SectionId}", section.SectionId);
        //        }

        //        _unitOfWork.Commit();

        //        return references;
        //    }
        //    catch
        //    {
        //        _unitOfWork.Rollback();
        //        throw;
        //    }
        //}
        private IEnumerable<SectionDeprecated> MapChildSections(IEnumerable<ChildSectionsSearchResultDto> childSections)
        {
            List<SectionDeprecated> listSections = new List<SectionDeprecated>();

            foreach (var section in childSections)
            {
                SectionDeprecated childSection = new SectionDeprecated();
                childSection.SectionId = section.SectionId;
                childSection.ContractId = section.SectionId;
                childSection.ContractLabel = section.ContractLabel;
                childSection.SectionNumber = section.ContractLabel.Split('.')[1];
                childSection.CounterpartyReference = section.CounterpartyReference;
                childSection.Quantity = section.Quantity;
                childSection.DeliveryPeriodStartDate = section.DeliveryPeriodStartDate.Value;
                childSection.PositionMonthIndex = section.PositionMonthIndex;
                childSection.ContractTerms = section.ContractTerm;
                childSection.ContractTermsLocation = section.ContractTermsLocation;
                childSection.PaymentTerms = section.PaymentTerm;
                childSection.Currency = section.Currency;
                childSection.Price = section.Price;
                childSection.BlDate = section.BlDate;
                childSection.AssignedCharterReference = section.AssignedCharterReference;
                childSection.LastModifiedBy = section.LastModifiedBy;
                childSection.ContractLabelOrigin = section.ContractLabel;
                childSection.ContractDate = section.ContractDate;
                childSection.CreationDate = section.CreatedDateTime;
                childSection.CreatedBy = section.CreatedBy;
                childSection.LastModifiedDate = section.ModifiedDateTime;
                childSection.LastModifiedBy = section.ModifiedBy;
                childSection.ContractType = section.ContractType;
                childSection.ContractId = section.ContractId;
                childSection.SectionNumber = section.SectionNumber;
                childSection.DepartmentId = section.DepartmentId;
                childSection.BuyerCode = section.BuyerCode;
                childSection.SellerCode = section.SellerCode;
                childSection.CommodityId = section.CommodityId;
                childSection.OriginalQuantity = section.OriginalQuantity;
                childSection.WeightUnitId = section.WeightUnitId;
                childSection.PortOfOrigin = section.PortOriginCode;
                childSection.PortOfDestination = section.PortDestinationCode;
                childSection.PositionMonthType = section.PositionMonthType;
                childSection.AllocationDate = section.AllocationDate;
                childSection.CharterAssignmentDate = section.CharterAssignmentDate;
                childSection.CreationDate = section.CreationDate;
                childSection.LastModifiedDate = section.LastModifiedDate;
                childSection.CropYear = section.CropYear;
                childSection.PaymentTerms = section.PaymentTermCode;
                childSection.PriceUnitId = section.PriceUnitId;
                childSection.Arbitration = section.ArbitrationCode;
                childSection.ContractedValue = section.ContractedValue;
                childSection.SectionTypeId = section.SectionTypeId;
                childSection.PortOfOrigin = section.PortOfOrigin;
                childSection.PortOfDestination = section.PortOfDestination;
                childSection.ContractTerms = section.ContractTerms;
                childSection.PeriodTypeId = section.PeriodTypeId;
                childSection.PaymentTerms = section.PaymentTerms;
                childSection.CropYearTo = section.CropYearTo;
                childSection.Arbitration = section.Arbitration;
                childSection.PositionMonth = section.PositionMonth;
                childSection.OtherReference = section.OtherReference;
                childSection.PeriodTypeId = section.PeriodTypeId;
                childSection.Currency = section.Currency;
                listSections.Add(childSection);
            }
            return listSections;
        }

    }
}