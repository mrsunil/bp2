using AutoMapper;
using LDC.Atlas.Application.Core.Entities;
using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.Services;
using LDC.Atlas.MasterData.Common;
using LDC.Atlas.Services.Trading.Application.Queries;
using LDC.Atlas.Services.Trading.Application.Queries.Dto;
using LDC.Atlas.Services.Trading.Entities;
using LDC.Atlas.Services.Trading.Repositories;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Commands
{
    public class PhysicalContractCommandsHandler :
       IRequestHandler<CreatePhysicalFixedPricedContractCommand, IEnumerable<SectionReference>>,
        IRequestHandler<UpdatePhysicalContractCommand, IEnumerable<SectionReference>>,
        IRequestHandler<PhysicalTradeBulkEditCommand>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ITradeRepository _tradeRepository;
        private readonly ISectionRepository _sectionRepository;
        private readonly ICostRepository _costRepository;
        private readonly IIdentityService _identityService;
        private readonly IFreezeRepository _freezeRepository;
        private readonly ISystemDateTimeService _systemDateTimeService;
        private readonly ILogger _logger;
        private readonly IMapper _mapper;
        private readonly IAuthorizationService _authorizationService;
        private readonly IProcessMessageService _processMessageService;
        private readonly IMasterDataService _masterDataService;
        private readonly ISectionQueries _sectionQueries;
        private readonly IUserService _userService;

        public PhysicalContractCommandsHandler(
            ILogger<PhysicalContractCommandsHandler> logger,
            IUnitOfWork unitOfWork,
            ITradeRepository tradeRepository,
            ISectionRepository sectionRepository,
            ICostRepository costRepository,
            IIdentityService identityService,
            IFreezeRepository freezeRepository,
            ISystemDateTimeService systemDateTimeService,
            IMapper mapper,
            IAuthorizationService authorizationService,
            IProcessMessageService processMessageService,
            IMasterDataService masterDataService,
            IUserService userService,
            ISectionQueries sectionQueries)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _tradeRepository = tradeRepository ?? throw new ArgumentNullException(nameof(tradeRepository));
            _sectionRepository = sectionRepository ?? throw new ArgumentNullException(nameof(sectionRepository));
            _costRepository = costRepository ?? throw new ArgumentNullException(nameof(costRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _systemDateTimeService = systemDateTimeService ?? throw new ArgumentNullException(nameof(systemDateTimeService));
            _authorizationService = authorizationService ?? throw new ArgumentNullException(nameof(authorizationService));
            _freezeRepository = freezeRepository ?? throw new ArgumentNullException(nameof(freezeRepository));
            _processMessageService = processMessageService ?? throw new ArgumentNullException(nameof(processMessageService));
            _masterDataService = masterDataService ?? throw new ArgumentNullException(nameof(masterDataService));
            _userService = userService ?? throw new ArgumentNullException(nameof(userService));
            _sectionQueries = sectionQueries ?? throw new ArgumentNullException(nameof(sectionQueries));
        }

        public async Task<IEnumerable<SectionReference>> Handle(CreatePhysicalFixedPricedContractCommand request, CancellationToken cancellationToken)
        {
            List<SectionReference> sectionReferences = new List<SectionReference>();
            _unitOfWork.BeginTransaction();

            try
            {
                if (request.ContractReference?.Length > 0)
                {
                    request.ContractReference = request.ContractReference.PadLeft(7, '0');
                }

                var companyDate = await _systemDateTimeService.GetCompanyDate(request.CompanyId);

                if (request.ContractDate.Date > companyDate.Date)
                {
                    throw new AtlasBusinessException($"Contract date cannot be in the future. Contract date: {request.ContractDate.Date}. Company date: {companyDate}.");
                }

                if (request.DataVersionId != null)
                {
                    var freezeDate = await _freezeRepository.GetFreezeNotClosedAsync(request.CompanyId, request.DataVersionId.Value);

                    if (freezeDate == null)
                    {
                        throw new AtlasBusinessException($"Contracts cannot be created in a freeze if the month is closed.");
                    }

                    if (request.ContractReference == null)
                    {
                        throw new AtlasBusinessException($"Contract reference is mandatory in a frozen database.");
                    }
                }

                await PhysicalContractCommonRules.ValidatePhysicalContract(request, _identityService, _masterDataService, _userService, _systemDateTimeService);

                var user = _identityService.GetUserName();
                request.CreatedBy = user;
                var physicalFixedPricedContract = _mapper.Map<Section>(request);
                var company = await _masterDataService.GetCompanyByIdAsync(request.CompanyId);

                if (company.IsProvinceEnable)
                {
                    physicalFixedPricedContract.ProvinceId = company.DefaultProvinceId;
                    physicalFixedPricedContract.BranchId = company.DefaultBranchId;
                }
                else
                {
                    physicalFixedPricedContract.ProvinceId = null;
                    physicalFixedPricedContract.BranchId = null;
                }

                // At least one contract has to be always created
                physicalFixedPricedContract.NumberOfContract = (request.NumberOfContracts > 0) ? request.NumberOfContracts : 1;
                physicalFixedPricedContract.IsInterco = request.IsInterco;

                if (!string.IsNullOrWhiteSpace(physicalFixedPricedContract.OtherReference))
                {
                    physicalFixedPricedContract.EstimatedMaturityDate = null;
                }

                physicalFixedPricedContract.EstimatedMaturityDate = await CalculateEstimatedMaturityDate(physicalFixedPricedContract, request.CompanyId);

                var references = (await _tradeRepository.CreatePhysicalContractAsImageAsync(physicalFixedPricedContract)).ToList();
                sectionReferences.AddRange(references);
                foreach (var item in references)
                {
                    if (item.SectionId > 0 && item.Quantity > 0 && physicalFixedPricedContract.Costs.Any())
                    {
                        foreach (var costItem in physicalFixedPricedContract.Costs)
                        {
                            costItem.CompanyId = request.CompanyId;
                            costItem.SectionId = item.SectionId;
                            costItem.DataVersionId = item.DataVersionId;
                        }

                        // check the business rule for PriceUnitId.
                        await _costRepository.AddCostsAsync(physicalFixedPricedContract.Costs, request.CompanyId, request.DataVersionId);
                    }

                    // request.ChildSections would not be null if only it is Imaging the trade and we have selected Image Splits/tranche option as well
                    if (request.ChildSections != null)
                    {
                        if (item.SectionId > 0 && request.ChildSections.Any())
                        {
                            CreateSplitCommand splitRequest = new CreateSplitCommand();
                            splitRequest.ChildSections = request.ChildSections;
                            splitRequest.ChildSections.ToList().ForEach(section => section.OriginalQuantity = 0);
                            splitRequest.CompanyId = request.CompanyId;
                            splitRequest.OriginalQuantity = request.Quantity;
                            splitRequest.Quantity = request.Quantity;
                            var sectionTrancheContract = _mapper.Map<SectionDeprecated>(splitRequest);
                            sectionTrancheContract.SectionId = item.SectionId;
                            sectionTrancheContract.ContractLabel = item.ContractLabel;
                            foreach (var splitTrancheItem in sectionTrancheContract.ChildSections)
                            {
                                splitTrancheItem.SectionId = 0;
                                splitTrancheItem.ContractId = item.PhysicalContractId;
                                splitTrancheItem.SectionOriginId = (int)item.SectionId;
                                splitTrancheItem.EstimatedMaturityDate = physicalFixedPricedContract.EstimatedMaturityDate;
                            }

                            bool isTradeImage = true;
                            var splitTranchReferences = await _tradeRepository.CreateTrancheSplitAsync(sectionTrancheContract, request.CompanyId, isTradeImage);

                            // Inserting cost while creating an Image of a trade,if available
                            foreach (var childItem in splitTranchReferences)
                            {
                                if (request.ChildSections.First().Costs != null)
                                {
                                    var childCosts = request.ChildSections.First().Costs;
                                    foreach (var costItem in childCosts)
                                    {
                                        costItem.CompanyId = request.CompanyId;
                                        costItem.SectionId = childItem.SectionId;
                                        costItem.DataVersionId = childItem.DataVersionId;
                                    }

                                    await _costRepository.AddCostsAsync(childCosts, request.CompanyId, request.DataVersionId);
                                }
                            }
                        }
                    }

                    if (request.IsInterco)
                    {
                        sectionReferences = await CreateIntercoContractOnCreateContract(request, physicalFixedPricedContract, references, sectionReferences);
                    }

                    if (request.DataVersionId != null)
                    {
                        // this might be incorrect. This is due to the code that is written above where you can create multiple contracts in your Current db with Image
                        await InsertFreezeRecalcProcessQueue(references[0].SectionId, request.DataVersionId, request.CompanyId);
                    }
                }

                _unitOfWork.Commit();
                _logger.LogInformation("New physical contract with id {Atlas_ContractLabel} created.", references[0].ContractLabel);

                return sectionReferences;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        private async Task<List<SectionReference>> CreateIntercoContractOnCreateContract(CreatePhysicalFixedPricedContractCommand request,
            Section physicalFixedPricedContract, List<SectionReference> references, List<SectionReference> sectionReferences)
        {
            // Create Interco Trade if available
            if (request.IsInterco)
            {
                string counterpartyCode = (physicalFixedPricedContract.Type == ContractType.Purchase) ?
                        physicalFixedPricedContract.SellerCode : physicalFixedPricedContract.BuyerCode;
                var counterparty = await _masterDataService.GetAllByCounterpartyIdAsync(request.CompanyId, counterpartyCode);

                if (counterparty != null && counterparty.FirstOrDefault() != null &&
                    counterparty.FirstOrDefault().CompanyId != request.CompanyId &&
                    counterparty.FirstOrDefault().IsCounterpartyGroupAccount)
                {
                    var dataVersionId = await _systemDateTimeService.GetCompanyCurrentDataVersionId(request.IntercoCompanyId);

                    var intercoPhysicalFixedPricedContract = _mapper.Map<Section>(request);
                    intercoPhysicalFixedPricedContract.CompanyId = physicalFixedPricedContract.IntercoCompanyId;
                    intercoPhysicalFixedPricedContract.TraderId = physicalFixedPricedContract.IntercoTraderId;
                    intercoPhysicalFixedPricedContract.DepartmentId = physicalFixedPricedContract.IntercoDepartmentId;
                    intercoPhysicalFixedPricedContract.Type = (physicalFixedPricedContract.Type == ContractType.Purchase) ? ContractType.Sale : ContractType.Purchase;
                    intercoPhysicalFixedPricedContract.DataVersionId = dataVersionId;
                    intercoPhysicalFixedPricedContract.ContractDate = DateTime.UtcNow;

                    intercoPhysicalFixedPricedContract.Costs = physicalFixedPricedContract.Costs.Where(r => r.SupplierCode == counterpartyCode);

                    // At least one contract has to be always created
                    intercoPhysicalFixedPricedContract.NumberOfContract = 1;

                    var intercoReferences = (await _tradeRepository.CreatePhysicalContractAsImageAsync(intercoPhysicalFixedPricedContract)).ToList();

                    foreach (var intercoItem in intercoReferences)
                    {
                        if (intercoItem.SectionId > 0 && intercoPhysicalFixedPricedContract.Costs.Any())
                        {
                            foreach (var intercoCostItem in intercoPhysicalFixedPricedContract.Costs)
                            {
                                intercoCostItem.CompanyId = intercoPhysicalFixedPricedContract.CompanyId;
                                intercoCostItem.SectionId = intercoItem.SectionId;
                                intercoCostItem.DataVersionId = dataVersionId;
                                intercoCostItem.CostDirectionId = (intercoCostItem.CostDirectionId == 1) ? 2 : 1;
                            }

                            // check the business rule for PriceUnitId.
                            await _costRepository.AddCostsAsync(intercoPhysicalFixedPricedContract.Costs, intercoPhysicalFixedPricedContract.CompanyId, dataVersionId);
                        }
                    }

                    // Update Reference & Memo Details
                    var sourceDataVersionId = await _systemDateTimeService.GetCompanyCurrentDataVersionId(physicalFixedPricedContract.CompanyId);

                    await UpdateReferenceAndInternalMemo(sourceDataVersionId,
                            references.FirstOrDefault().PhysicalContractId,
                            request.IntercoCompanyId.ToUpper() + "/" + intercoReferences.FirstOrDefault().ContractLabel,
                            dataVersionId,
                            intercoReferences.FirstOrDefault().PhysicalContractId,
                            request.CompanyId.ToUpper() + "/" + references.FirstOrDefault().ContractLabel,
                            request.Type);

                    sectionReferences.AddRange(intercoReferences);
                }
                else
                {
                    throw new AtlasBusinessException($"Invalid Counterparty for Interco Contract.");
                }
            }
            return sectionReferences;
        }

        public async Task<Unit> Handle(PhysicalTradeBulkEditCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                var physicalTradeBulkEditObjects = _mapper.Map<PhysicalTradeBulkEdit>(request);
                await _tradeRepository.PhysicalTradeBulkEditAsync(physicalTradeBulkEditObjects);
                _unitOfWork.Commit();
                return Unit.Value;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        private async Task<DateTime?> CalculateEstimatedMaturityDate(Section physicalFixedPricedContract, string companyId)
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
                            estimatedMaturityDate = physicalFixedPricedContract.InvoiceDate ?? CalculateMaturityDateOnShippment(physicalFixedPricedContract);
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

        private DateTime CalculateMaturityDateOnShippment(Section physicalFixedPricedContract)
        {
            DateTime dateToConsider = DateTime.UtcNow;
            if (physicalFixedPricedContract.PositionMonthType == PositionMonthType.Start)
            {
                dateToConsider = (DateTime)physicalFixedPricedContract.DeliveryPeriodStartDate;
                dateToConsider = dateToConsider.AddMonths(physicalFixedPricedContract.MonthPositionIndex);
            }
            else if (physicalFixedPricedContract.PositionMonthType == PositionMonthType.End)
            {
                dateToConsider = (DateTime)physicalFixedPricedContract.DeliveryPeriodEndDate;
                dateToConsider = dateToConsider.AddMonths(physicalFixedPricedContract.MonthPositionIndex);
            }

            DateTime firstOfNextMonth = new DateTime(dateToConsider.Year, dateToConsider.Month, 1).AddMonths(1);
            return firstOfNextMonth.AddDays(-1);
        }


        public async Task<IEnumerable<SectionReference>> Handle(UpdatePhysicalContractCommand request, CancellationToken cancellationToken)
        {
            List<SectionReference> sectionReferences = new List<SectionReference>();
            _unitOfWork.BeginTransaction();
            try
            {
                var companyDate = await _systemDateTimeService.GetCompanyDate(request.CompanyId);

                if (request.ContractDate.Date > companyDate.Date)
                {
                    throw new AtlasBusinessException($"Contract date cannot be in the future. Contract date: {request.ContractDate.Date}. Company date: {companyDate}.");
                }

                if (request.DataVersionId != null)
                {
                    var freezeDate = await _freezeRepository.GetFreezeNotClosedAsync(request.CompanyId, request.DataVersionId.Value);

                    if (freezeDate == null)
                    {
                        throw new AtlasBusinessException($"Contracts cannot be updated in a freeze if the month is closed.");
                    }
                }

                var physicalFixedPricedContract = _mapper.Map<Section>(request);
                var company = await _masterDataService.GetCompanyByIdAsync(request.CompanyId);

                if (company.IsProvinceEnable)
                {
                    physicalFixedPricedContract.ProvinceId = company.DefaultProvinceId;
                    physicalFixedPricedContract.BranchId = company.DefaultBranchId;
                }
                else
                {
                    physicalFixedPricedContract.ProvinceId = null;
                    physicalFixedPricedContract.BranchId = null;
                }

                var section = await _sectionRepository.GetSectionById(request.SectionId, request.CompanyId, request.DataVersionId);

                if (section.EstimatedMaturityDate == physicalFixedPricedContract.EstimatedMaturityDate
                    && (section.DeliveryPeriodStartDate != physicalFixedPricedContract.DeliveryPeriodStartDate
                    || section.DeliveryPeriodEndDate != physicalFixedPricedContract.DeliveryPeriodEndDate
                    || section.PaymentTermCode != physicalFixedPricedContract.PaymentTermCode
                    || physicalFixedPricedContract.BlDate != section.BlDate
                    || section.InvoiceDate != physicalFixedPricedContract.InvoiceDate
                    || section.PositionMonthType != physicalFixedPricedContract.PositionMonthType
                    || section.MonthPositionIndex != physicalFixedPricedContract.MonthPositionIndex))
                {
                    physicalFixedPricedContract.EstimatedMaturityDate = null;
                }

                physicalFixedPricedContract.EstimatedMaturityDate = await CalculateEstimatedMaturityDate(physicalFixedPricedContract, request.CompanyId);

                if (section.IsClosed)
                {
                    throw new AtlasBusinessException($"Closed trade cannot be updated.");
                }

                physicalFixedPricedContract.IsInterco = request.IsInterco;
                await _tradeRepository.UpdatePhysicalContractAsync(physicalFixedPricedContract, request.CompanyId);

                List<Cost> newCosts = new List<Cost>();
                foreach (var item in physicalFixedPricedContract.Costs)
                {
                    item.SectionId = physicalFixedPricedContract.SectionId;
                    item.CompanyId = request.CompanyId;
                    item.DataVersionId = request.DataVersionId;
                    if (item.CostId != 0)
                    {
                        await _costRepository.UpdateCostAsync(item, request.CompanyId);
                    }
                    else
                    {
                        newCosts.Add(item);
                    }
                }

                if (newCosts.Count > 0)
                {
                    await _costRepository.AddCostsAsync(newCosts, request.CompanyId, request.DataVersionId);
                }

                if (request.IsInterco)
                {
                    sectionReferences = await CreateIntercoContractOnUpdateContract(request, section, sectionReferences);
                }

                if (request.DataVersionId != null)
                {
                    await InsertFreezeRecalcProcessQueue(request.SectionId, request.DataVersionId, request.CompanyId);
                }

                _unitOfWork.Commit();
                _logger.LogInformation("Section with id {Atlas_SectionId} updated.", physicalFixedPricedContract.SectionId);
                return sectionReferences;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        private async Task<List<SectionReference>> CreateIntercoContractOnUpdateContract(UpdatePhysicalContractCommand request,
            Section section, List<SectionReference> sectionReferences)
        {
            string counterpartyCode = (request.Type == ContractType.Purchase) ? request.SellerCode : request.BuyerCode;
            var counterparty = await _masterDataService.GetAllByCounterpartyIdAsync(request.CompanyId, counterpartyCode);

            if (counterparty != null && counterparty.FirstOrDefault() != null &&
                counterparty.FirstOrDefault().CompanyId != request.CompanyId &&
                counterparty.FirstOrDefault().IsCounterpartyGroupAccount)
            {
                if (section != null && !section.IsInterco &&
                (section.Type == ContractType.Purchase || section.Type == ContractType.Sale) &&
                (section.SectionOriginId == 0) && (section.InvoicingStatusId == (long)InvoicingStatus.Uninvoiced))
                {
                    var dataVersionId = await _systemDateTimeService.GetCompanyCurrentDataVersionId(request.IntercoCompanyId);

                    var intercoPhysicalFixedPricedContract = _mapper.Map<Section>(section);
                    intercoPhysicalFixedPricedContract.CompanyId = request.IntercoCompanyId;
                    intercoPhysicalFixedPricedContract.TraderId = request.IntercoTraderId;
                    intercoPhysicalFixedPricedContract.DepartmentId = request.IntercoDepartmentId;
                    intercoPhysicalFixedPricedContract.Type = (request.Type == ContractType.Purchase) ? ContractType.Sale : ContractType.Purchase;
                    intercoPhysicalFixedPricedContract.DataVersionId = dataVersionId;
                    intercoPhysicalFixedPricedContract.ContractDate = DateTime.UtcNow;
                    intercoPhysicalFixedPricedContract.PaymentTerms = section.PaymentTermCode;
                    intercoPhysicalFixedPricedContract.ContractTerms = section.ContractTermCode;
                    intercoPhysicalFixedPricedContract.ContractTermsLocation = section.ContractTermLocationCode;

                    string supplierCode = (section.Type == ContractType.Purchase) ? section.SellerCode : section.BuyerCode;
                    intercoPhysicalFixedPricedContract.Costs = (await _costRepository.LoadSectionCostsAsync(intercoPhysicalFixedPricedContract.SectionId,
                        request.CompanyId, request.DataVersionId)).Where(c => c.SupplierCode == supplierCode).ToList();

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

                    var childSectionsDto = await _sectionQueries.GetTradeChildSectionDataAsync(request.CompanyId, request.SectionId, null, null);

                    // request.ChildSections would not be null if only it is Imaging the trade and we have selected Image Splits/tranche option as well
                    if (childSectionsDto != null && childSectionsDto.Any())
                    {
                        IEnumerable<SectionDeprecated> childSections = MapChildSections(childSectionsDto);

                        CreateSplitCommand splitRequest = new CreateSplitCommand();
                        splitRequest.ChildSections = childSections;
                        splitRequest.CompanyId = request.IntercoCompanyId;
                        splitRequest.OriginalQuantity = request.Quantity;
                        splitRequest.Quantity = request.Quantity;
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
                                request.CompanyId, request.DataVersionId)).Where(c => c.SupplierCode == supplierCode).ToList();

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
                    var sourceDataVersionId = await _systemDateTimeService.GetCompanyCurrentDataVersionId(request.CompanyId);

                    await UpdateReferenceAndInternalMemo(sourceDataVersionId,
                                request.PhysicalContractId,
                                request.IntercoCompanyId.ToUpper() + "/" + intercoReferences.FirstOrDefault().ContractLabel,
                                dataVersionId,
                                intercoReferences.FirstOrDefault().PhysicalContractId,
                                request.CompanyId.ToUpper() + "/" + section.ContractLabel,
                                request.Type);

                    sectionReferences.AddRange(intercoReferences);
                }
            }
            if (section != null && section.IsInterco && request.IsRemoveInterco)
            {
                await _tradeRepository.DeleteReferenceAndInternalMemoAsync(section.PhysicalContractId);
            }

            return sectionReferences;
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

        /// <summary>
        /// This method will insert record into Process message to call the recalc
        /// </summary>
        /// <param name="sectionId"> section command object</param>
        /// <param name="dataVersionId">dataversion being edited</param>
        /// <param name="companyId">company on which there is edition</param>
        private async Task InsertFreezeRecalcProcessQueue(long sectionId, long? dataVersionId, string companyId)
        {
            dynamic message = new JObject(
               new JProperty("userId", _identityService.GetUserName()),
               new JProperty("sectionId", sectionId),
               new JProperty("dataVersionId", dataVersionId));

            await _processMessageService.SendMessage(new ProcessMessage
            {
                ProcessTypeId = (int)ProcessType.AtlasRecalculationProcessor,
                CompanyId = companyId,
                Content = message.ToString()
            });
        }

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