using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Lock.Application.Logic;
using LDC.Atlas.Services.Lock.Application.Queries;
using LDC.Atlas.Services.Lock.Application.Queries.Dto;
using LDC.Atlas.Services.Lock.Entities;
using LDC.Atlas.Services.Lock.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Lock.Application.Commands
{
    public class LockCommandsHandler :
        IRequestHandler<LockContractCommand, IEnumerable<LockDto>>,
        IRequestHandler<LockCharterCommand, IEnumerable<LockDto>>,
        IRequestHandler<LockFxDealCommand, IEnumerable<LockDto>>,
        IRequestHandler<LockUserAccountCommand, IEnumerable<LockDto>>,
        IRequestHandler<LockUserProfileCommand, IEnumerable<LockDto>>,
        IRequestHandler<LockCostMatrixCommand, IEnumerable<LockDto>>,
        IRequestHandler<LockCashDocumentCommand, IEnumerable<LockDto>>,
        IRequestHandler<LockInvoiceCommand, IEnumerable<LockDto>>,
        IRequestHandler<LockAccountingDocumentCommand, IEnumerable<LockDto>>,
        IRequestHandler<DeleteLocksCommand>,
        IRequestHandler<RefreshLockOwnershipCommand>,
        IRequestHandler<UnlockContractCommand>,
        IRequestHandler<UnlockCharterCommand>,
        IRequestHandler<UnlockFxDealCommand>,
        IRequestHandler<UnlockUserAccountCommand>,
        IRequestHandler<UnlockUserProfileCommand>,
        IRequestHandler<UnlockCostMatrixCommand>,
        IRequestHandler<UnlockCashDocumentCommand>,
        IRequestHandler<UnlockInvoiceCommand>,
        IRequestHandler<UnlockAccountingDocumentCommand>,
        IRequestHandler<CleanSessionCommand>
    {
        private const string ResourceCodeNotFound = "NOT FOUND";

        private readonly ILogger<LockCommandsHandler> _logger;
        private readonly IIdentityService _identityService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILockRepository _lockRepository;
        private readonly ILockQueries _lockQueries;

        public LockCommandsHandler(
            ILogger<LockCommandsHandler> logger,
            IIdentityService identityService,
            IUnitOfWork unitOfWork,
            ILockRepository lockRepository,
            ILockQueries lockQueries)
        {
            _lockRepository = lockRepository ?? throw new ArgumentNullException(nameof(lockRepository));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _lockQueries = lockQueries ?? throw new ArgumentNullException(nameof(lockQueries));
        }

        public async Task<IEnumerable<LockDto>> Handle(LockContractCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var userName = _identityService.GetUserName();
                var locks = new List<LockDto>();
                var lockDto = await GenerateContractLockRowIfNotLocked(request.CompanyId, request.ResourceId, request.FunctionalContext, userName, request.ApplicationSessionId);
                locks.Add(lockDto);
                if (RequiresLockWholeFamily(request.FunctionalContext))
                {
                    LockFunctionalContext relativeFunctionalContext = GetRelativeFunctionalContext(request.FunctionalContext);
                    var relatives = await _lockRepository.GetContractRelativesAsync(request.CompanyId, request.ResourceId);
                    foreach (var relative in relatives)
                    {
                        var childLockDto = await GenerateContractLockRowIfNotLocked(request.CompanyId, relative, relativeFunctionalContext, userName, request.ApplicationSessionId);
                        locks.Add(childLockDto);
                    }
                }

                if (RequiresLockAllocatedContractWholeFamily(request.FunctionalContext))
                {
                    var information = await _lockRepository.GetSectionInformationAsync(request.CompanyId, request.ResourceId);
                    if (information.AllocatedTo != null)
                    {
                        var allocatedLockDto = await GenerateContractLockRowIfNotLocked(request.CompanyId, information.AllocatedTo.Value, LockFunctionalContext.Deallocation, userName, request.ApplicationSessionId);
                        locks.Add(allocatedLockDto);
                        var allocatedRelatives = await _lockRepository.GetContractRelativesAsync(request.CompanyId, information.AllocatedTo.Value);
                        foreach (var allocatedRelative in allocatedRelatives)
                        {
                            var childLockDto = await GenerateContractLockRowIfNotLocked(request.CompanyId, allocatedRelative, LockFunctionalContext.RelativeDeallocation, userName, request.ApplicationSessionId);
                            locks.Add(childLockDto);
                        }
                    }
                }

                var lockCreationResult = await _lockRepository.CreateLocksAsync(locks, request.CompanyId, userName);
                _unitOfWork.Commit();

                return lockCreationResult;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        private static Dictionary<LockFunctionalContext, LockFunctionalContext> relativeFunctionalContextMapping = new Dictionary<LockFunctionalContext, LockFunctionalContext>()
        {
            { LockFunctionalContext.TradeEdit, LockFunctionalContext.RelativeTradeEdit },
            { LockFunctionalContext.Allocation, LockFunctionalContext.RelativeAllocation },
            { LockFunctionalContext.Deallocation, LockFunctionalContext.RelativeDeallocation },
            { LockFunctionalContext.BulkAllocation, LockFunctionalContext.RelativeAllocation },
            { LockFunctionalContext.BulkDeallocation, LockFunctionalContext.RelativeDeallocation },
            { LockFunctionalContext.TradeTranche, LockFunctionalContext.RelativeTradeTranche },
            { LockFunctionalContext.TradeSplit, LockFunctionalContext.RelativeTradeSplit }
        };

        private static LockFunctionalContext GetRelativeFunctionalContext(LockFunctionalContext lockFunctionalContext)
        {
            return relativeFunctionalContextMapping.ContainsKey(lockFunctionalContext)
                ? relativeFunctionalContextMapping[lockFunctionalContext]
                : LockFunctionalContext.RelativeTradeEdit;
        }

        private static bool RequiresLockAllocatedContractWholeFamily(LockFunctionalContext lockFunctionalContext)
        {
            return lockFunctionalContext == LockFunctionalContext.Deallocation;
        }

        private static bool RequiresLockWholeFamily(LockFunctionalContext lockFunctionalContext)
        {
            return lockFunctionalContext == LockFunctionalContext.TradeEdit ||
                   lockFunctionalContext == LockFunctionalContext.Allocation ||
                   lockFunctionalContext == LockFunctionalContext.Deallocation ||
                   lockFunctionalContext == LockFunctionalContext.BulkAllocation ||
                   lockFunctionalContext == LockFunctionalContext.BulkDeallocation ||
                   lockFunctionalContext == LockFunctionalContext.TradeSplit ||
                   lockFunctionalContext == LockFunctionalContext.TradeTranche;
        }

        public async Task<IEnumerable<LockDto>> Handle(LockCharterCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var userName = _identityService.GetUserName();
                var locks = new List<LockDto>();
                var lockDto = await GenerateCharterLockRowIfNotLocked(request.CompanyId, request.ResourceId, request.FunctionalContext, userName, request.ApplicationSessionId);
                locks.Add(lockDto);
                var lockCreationResult = await _lockRepository.CreateLocksAsync(locks, request.CompanyId, userName);
                _unitOfWork.Commit();

                return lockCreationResult;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<IEnumerable<LockDto>> Handle(LockFxDealCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var userName = _identityService.GetUserName();
                var locks = new List<LockDto>();
                var lockDto = await GenerateFxDealLockRowIfNotLocked(request.CompanyId, request.ResourceId, request.FunctionalContext, userName, request.ApplicationSessionId);
                locks.Add(lockDto);
                var lockCreationResult = await _lockRepository.CreateLocksAsync(locks, request.CompanyId, userName);
                _unitOfWork.Commit();

                return lockCreationResult;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<IEnumerable<LockDto>> Handle(LockUserAccountCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var userName = _identityService.GetUserName();
                var locks = new List<LockDto>();
                var lockDto = await GenerateUserAccountLockRowIfNotLocked(request.CompanyId, request.ResourceId, request.FunctionalContext, userName, request.ApplicationSessionId);
                locks.Add(lockDto);
                var lockCreationResult = await _lockRepository.CreateLocksAsync(locks, request.CompanyId, userName);
                _unitOfWork.Commit();

                return lockCreationResult;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<IEnumerable<LockDto>> Handle(LockUserProfileCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var userName = _identityService.GetUserName();
                var locks = new List<LockDto>();
                var lockDto = await GenerateUserProfileLockRowIfNotLocked(request.CompanyId, request.ResourceId, request.FunctionalContext, userName, request.ApplicationSessionId);
                locks.Add(lockDto);
                var lockCreationResult = await _lockRepository.CreateLocksAsync(locks, request.CompanyId, userName);
                _unitOfWork.Commit();

                return lockCreationResult;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<IEnumerable<LockDto>> Handle(LockCostMatrixCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var userName = _identityService.GetUserName();
                var locks = new List<LockDto>();
                var lockDto = await GenerateCostMatrixLockRowIfNotLocked(request.CompanyId, request.ResourceId, request.FunctionalContext, userName, request.ApplicationSessionId);
                locks.Add(lockDto);
                var lockCreationResult = await _lockRepository.CreateLocksAsync(locks, request.CompanyId, userName);
                _unitOfWork.Commit();

                return lockCreationResult;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<IEnumerable<LockDto>> Handle(LockCashDocumentCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var userName = _identityService.GetUserName();
                var locks = new List<LockDto>();
                var lockDto = await GenerateCashDocumentLockRowIfNotLocked(request.CompanyId, request.ResourceId, request.FunctionalContext, userName, request.ApplicationSessionId);
                locks.Add(lockDto);
                var lockCreationResult = await _lockRepository.CreateLocksAsync(locks, request.CompanyId, userName);
                _unitOfWork.Commit();

                return lockCreationResult;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<IEnumerable<LockDto>> Handle(LockInvoiceCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var userName = _identityService.GetUserName();
                var locks = await GenerateInvoiceLockRowIfNotLocked(request.CompanyId, request.ResourceId, request.FunctionalContext, userName, request.ApplicationSessionId);
                var lockCreationResult = await _lockRepository.CreateLocksAsync(locks, request.CompanyId, userName);
                _unitOfWork.Commit();

                return lockCreationResult;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<IEnumerable<LockDto>> Handle(LockAccountingDocumentCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var userName = _identityService.GetUserName();
                var locks = new List<LockDto>();
                var lockDto = await GenerateAccountingDocumentLockRowIfNotLocked(request.CompanyId, request.ResourceId, request.FunctionalContext, userName, request.ApplicationSessionId);
                locks.AddRange(lockDto);
                var lockCreationResult = await _lockRepository.CreateLocksAsync(locks, request.CompanyId, userName);
                _unitOfWork.Commit();

                return lockCreationResult;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<Unit> Handle(UnlockContractCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var unlocks = new List<UnlockDto>();
                unlocks.Add(new UnlockDto()
                {
                    CompanyId = request.CompanyId,
                    ResourceType = ResourceType.Contract,
                    ResourceId = request.ResourceId,
                    ApplicationSessionId = request.ApplicationSessionId
                });

                if (RequiresLockWholeFamily(request.FunctionalContext))
                {
                    var relatives = await _lockRepository.GetContractRelativesAsync(request.CompanyId, request.ResourceId);
                    foreach (var relative in relatives)
                    {
                        unlocks.Add(new UnlockDto()
                        {
                            CompanyId = request.CompanyId,
                            ResourceType = ResourceType.Contract,
                            ResourceId = relative,
                            ApplicationSessionId = request.ApplicationSessionId
                        });
                    }
                }

                if (RequiresLockAllocatedContractWholeFamily(request.FunctionalContext))
                {
                    var information = await _lockRepository.GetSectionInformationAsync(request.CompanyId, request.ResourceId);
                    if (information.AllocatedTo != null)
                    {
                        unlocks.Add(new UnlockDto()
                        {
                            CompanyId = request.CompanyId,
                            ResourceType = ResourceType.Contract,
                            ResourceId = information.AllocatedTo.Value,
                            ApplicationSessionId = request.ApplicationSessionId
                        });
                        var allocatedRelatives = await _lockRepository.GetContractRelativesAsync(request.CompanyId, information.AllocatedTo.Value);
                        foreach (var allocatedRelative in allocatedRelatives)
                        {
                            unlocks.Add(new UnlockDto()
                            {
                                CompanyId = request.CompanyId,
                                ResourceType = ResourceType.Contract,
                                ResourceId = allocatedRelative,
                                ApplicationSessionId = request.ApplicationSessionId
                            });
                        }
                    }
                }


                if (unlocks.Any())
                {
                    await _lockRepository.UnlockAsync(unlocks);
                    _unitOfWork.Commit();
                }

                return Unit.Value;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<Unit> Handle(UnlockCharterCommand request, CancellationToken cancellationToken)
        {
            return await UnlockResource(request.CompanyId, ResourceType.Charter, request.ResourceId, request.ApplicationSessionId);
        }

        public async Task<Unit> Handle(UnlockFxDealCommand request, CancellationToken cancellationToken)
        {
            return await UnlockResource(request.CompanyId, ResourceType.FxDeal, request.ResourceId, request.ApplicationSessionId);
        }

        public async Task<Unit> Handle(UnlockUserAccountCommand request, CancellationToken cancellationToken)
        {
            return await UnlockResource(request.CompanyId, ResourceType.UserAccount, request.ResourceId, request.ApplicationSessionId);
        }

        public async Task<Unit> Handle(UnlockUserProfileCommand request, CancellationToken cancellationToken)
        {
            return await UnlockResource(request.CompanyId, ResourceType.UserProfile, request.ResourceId, request.ApplicationSessionId);
        }

        public async Task<Unit> Handle(UnlockCostMatrixCommand request, CancellationToken cancellationToken)
        {
            return await UnlockResource(request.CompanyId, ResourceType.CostMatrix, request.ResourceId, request.ApplicationSessionId);
        }

        public async Task<Unit> Handle(UnlockCashDocumentCommand request, CancellationToken cancellationToken)
        {
            return await UnlockResource(request.CompanyId, ResourceType.CashDocument, request.ResourceId, request.ApplicationSessionId);
        }

        public async Task<Unit> Handle(UnlockAccountingDocumentCommand request, CancellationToken cancellationToken)
        {
            var unlocks = new List<UnlockDto>();
            unlocks.Add(new UnlockDto()
            {
                CompanyId = request.CompanyId,
                ResourceType = ResourceType.AccountingDocument,
                ResourceId = request.ResourceId,
                ApplicationSessionId = request.ApplicationSessionId
            });

            var accountingDocumentInformation = await _lockRepository.GetAccountingDocumentInformation(request.ResourceId, request.CompanyId, null);
            if (accountingDocumentInformation != null && accountingDocumentInformation.InvoiceId != null)
            {
                unlocks.Add(new UnlockDto()
                {
                    CompanyId = request.CompanyId,
                    ResourceType = ResourceType.Invoice,
                    ResourceId = accountingDocumentInformation.InvoiceId.Value,
                    ApplicationSessionId = request.ApplicationSessionId
                });
                var invoiceLines = await _lockRepository.GetInvoiceInformation(accountingDocumentInformation.InvoiceId.Value, request.CompanyId, null);
                var sectionIds = invoiceLines.Select(il => il.SectionId).Distinct();
                foreach (var sectionId in sectionIds)
                {
                    unlocks.Add(new UnlockDto()
                    {
                        CompanyId = request.CompanyId,
                        ResourceType = ResourceType.Contract,
                        ResourceId = sectionId,
                        ApplicationSessionId = request.ApplicationSessionId
                    });
                }
            }

            _unitOfWork.BeginTransaction();
            try
            {
                if (unlocks.Any())
                {
                    await _lockRepository.UnlockAsync(unlocks);
                    _unitOfWork.Commit();
                }

                return Unit.Value;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<Unit> Handle(UnlockInvoiceCommand request, CancellationToken cancellationToken)
        {
            var unlocks = new List<UnlockDto>();
            unlocks.Add(new UnlockDto()
            {
                CompanyId = request.CompanyId,
                ResourceType = ResourceType.Invoice,
                ResourceId = request.ResourceId,
                ApplicationSessionId = request.ApplicationSessionId
            });
            var invoiceLines = await _lockRepository.GetInvoiceInformation(request.ResourceId, request.CompanyId, null);
            var sectionIds = invoiceLines.Select(il => il.SectionId).Distinct();

            foreach (var sectionId in sectionIds)
            {
                unlocks.Add(new UnlockDto()
                {
                    CompanyId = request.CompanyId,
                    ResourceType = ResourceType.Contract,
                    ResourceId = sectionId,
                    ApplicationSessionId = request.ApplicationSessionId
                });
            }

            _unitOfWork.BeginTransaction();
            try
            {
                if (unlocks.Any())
                {
                    await _lockRepository.UnlockAsync(unlocks);
                    _unitOfWork.Commit();
                }

                return Unit.Value;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        private async Task<Unit> UnlockResource(string companyId, string resourceType, long resourceId, string applicationSessionId)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var userName = _identityService.GetUserName();
                await _lockRepository.UnlockAsync(new List<UnlockDto>() { new UnlockDto() { CompanyId = companyId, ResourceType = resourceType, ResourceId = resourceId, ApplicationSessionId = applicationSessionId } });
                _unitOfWork.Commit();

                return Unit.Value;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        private async Task<LockDto> GenerateLockRowIfNotLocked(string companyId, long resourceId, string resourceCode, string resouceType, LockFunctionalContext lockFunctionalContext, string userName, string applicationSessionId)
        {
            var lockState = await _lockQueries.GetLockStateAsync(companyId, resourceId, applicationSessionId, resouceType);
            if (lockState.IsLocked)
            {
                throw new AtlasBusinessException(LockMessage.GenerateLockMessage(lockState));
            }

            var lockRow = new LockDto()
            {
                ApplicationSessionId = applicationSessionId,
                CompanyId = companyId,
                FunctionalContext = lockFunctionalContext,
                LockAcquisitionDateTime = DateTime.UtcNow,
                LockOwner = userName,
                ResourceId = resourceId,
                ResourceCode = resourceCode != null ? resourceCode : ResourceCodeNotFound,
                ResourceType = resouceType
            };
            return lockRow;
        }

        private async Task<LockDto> GenerateCharterLockRowIfNotLocked(string companyId, long resourceId, LockFunctionalContext lockFunctionalContext, string userName, string applicationSessionId)
        {
            var charterInformation = await _lockRepository.GetCharterInformationAsync(companyId, resourceId);
            var resourceCode = charterInformation != null ? charterInformation.CharterCode : ResourceCodeNotFound;
            return await GenerateLockRowIfNotLocked(companyId, resourceId, resourceCode, ResourceType.Charter, lockFunctionalContext, userName, applicationSessionId);
        }

        private async Task<LockDto> GenerateFxDealLockRowIfNotLocked(string companyId, long resourceId, LockFunctionalContext lockFunctionalContext, string userName, string applicationSessionId)
        {
            var fxDealInformation = await _lockRepository.GetFxDealInformationAsync(companyId, resourceId);
            var resourceCode = fxDealInformation != null ? fxDealInformation.Reference : ResourceCodeNotFound;
            return await GenerateLockRowIfNotLocked(companyId, resourceId, resourceCode, ResourceType.FxDeal, lockFunctionalContext, userName, applicationSessionId);
        }

        private async Task<LockDto> GenerateUserAccountLockRowIfNotLocked(string companyId, long resourceId, LockFunctionalContext lockFunctionalContext, string userName, string applicationSessionId)
        {
            var userAccountInformation = await _lockRepository.GetUserAccountInformation(resourceId);
            var resourceCode = userAccountInformation != null ? userAccountInformation.SamAccountName : ResourceCodeNotFound;
            return await GenerateLockRowIfNotLocked(companyId, resourceId, resourceCode, ResourceType.UserAccount, lockFunctionalContext, userName, applicationSessionId);
        }

        private async Task<LockDto> GenerateUserProfileLockRowIfNotLocked(string companyId, long resourceId, LockFunctionalContext lockFunctionalContext, string userName, string applicationSessionId)
        {
            var userProfileInformation = await _lockRepository.GetUserProfileInformation(resourceId);
            var resourceCode = userProfileInformation != null ? userProfileInformation.Name : ResourceCodeNotFound;
            return await GenerateLockRowIfNotLocked(companyId, resourceId, resourceCode, ResourceType.UserProfile, lockFunctionalContext, userName, applicationSessionId);
        }

        private async Task<LockDto> GenerateCostMatrixLockRowIfNotLocked(string companyId, long resourceId, LockFunctionalContext lockFunctionalContext, string userName, string applicationSessionId)
        {
            var costMatrixInformation = await _lockRepository.GetCostMatrixInformation(resourceId);
            var resourceCode = costMatrixInformation != null ? costMatrixInformation.Name : ResourceCodeNotFound;
            return await GenerateLockRowIfNotLocked(companyId, resourceId, resourceCode, ResourceType.CostMatrix, lockFunctionalContext, userName, applicationSessionId);
        }

        private async Task<LockDto> GenerateCashDocumentLockRowIfNotLocked(string companyId, long resourceId, LockFunctionalContext lockFunctionalContext, string userName, string applicationSessionId)
        {
            var cashDocumentInformation = await _lockRepository.GetCashDocumentInformation(resourceId);
            var resourceCode = cashDocumentInformation != null ? cashDocumentInformation.DocumentReference : ResourceCodeNotFound;
            return await GenerateLockRowIfNotLocked(companyId, resourceId, resourceCode, ResourceType.CashDocument, lockFunctionalContext, userName, applicationSessionId);
        }

        private async Task<List<LockDto>> GenerateAccountingDocumentLockRowIfNotLocked(string companyId, long resourceId, LockFunctionalContext lockFunctionalContext, string userName, string applicationSessionId)
        {
            var locks = new List<LockDto>();
            var accountingDocumentInformation = await _lockRepository.GetAccountingDocumentInformation(resourceId, companyId, null);
            var resourceCode = accountingDocumentInformation != null ? accountingDocumentInformation.DocumentReference : ResourceCodeNotFound;
            var lockAccountingDocument = await GenerateLockRowIfNotLocked(companyId, resourceId, resourceCode, ResourceType.AccountingDocument, lockFunctionalContext, userName, applicationSessionId);
            locks.Add(lockAccountingDocument);
            if (accountingDocumentInformation != null && accountingDocumentInformation.InvoiceId != null)
            {
                var locksInvoice = await GenerateInvoiceLockRowIfNotLocked(companyId, accountingDocumentInformation.InvoiceId.Value, LockFunctionalContext.AccountingDocumentEdition, userName, applicationSessionId);
                locks.AddRange(locksInvoice);
            }

            return locks;
        }

        private async Task<List<LockDto>> GenerateInvoiceLockRowIfNotLocked(string companyId, long resourceId, LockFunctionalContext lockFunctionalContext, string userName, string applicationSessionId)
        {
            var locks = new List<LockDto>();
            var invoiceLinesInformation = await _lockRepository.GetInvoiceInformation(resourceId, companyId, null);
            var resourceCode = invoiceLinesInformation != null && invoiceLinesInformation.Any() ? invoiceLinesInformation.First().DocumentReference : ResourceCodeNotFound;
            var lockState = await _lockQueries.GetLockStateAsync(companyId, resourceId, applicationSessionId, ResourceType.Invoice);
            if (lockState.IsLocked)
            {
                throw new AtlasBusinessException(LockMessage.GenerateLockMessage(lockState));
            }
            else
            {
                locks.Add(new LockDto()
                {
                    ApplicationSessionId = applicationSessionId,
                    CompanyId = companyId,
                    FunctionalContext = lockFunctionalContext,
                    LockAcquisitionDateTime = DateTime.UtcNow,
                    LockOwner = userName,
                    ResourceId = resourceId,
                    ResourceCode = resourceCode,
                    ResourceType = ResourceType.Invoice
                });
            }

            if (invoiceLinesInformation != null)
            {
                foreach (var invoiceLineInformation in invoiceLinesInformation)
                {
                    var contractLockState = await _lockQueries.GetLockStateAsync(companyId, invoiceLineInformation.SectionId, applicationSessionId, ResourceType.Contract);
                    if (contractLockState.IsLocked)
                    {
                        throw new AtlasBusinessException(LockMessage.GenerateLockMessage(contractLockState));
                    }
                    else
                    {
                        locks.Add(new LockDto()
                        {
                            ApplicationSessionId = applicationSessionId,
                            CompanyId = companyId,
                            FunctionalContext = lockFunctionalContext,
                            LockAcquisitionDateTime = DateTime.UtcNow,
                            LockOwner = userName,
                            ResourceId = invoiceLineInformation.SectionId,
                            ResourceCode = invoiceLineInformation.SectionCode != null ? invoiceLineInformation.SectionCode : ResourceCodeNotFound,
                            ResourceType = ResourceType.Contract
                        });
                    }
                }
            }

            return locks;
        }

        private async Task<LockDto> GenerateContractLockRowIfNotLocked(string companyId, long resourceId, LockFunctionalContext lockFunctionalContext, string userName, string applicationSessionId)
        {
            var sectionInformation = await _lockRepository.GetSectionInformationAsync(companyId, resourceId);
            var resourceCode = sectionInformation != null ? sectionInformation.SectionCode : ResourceCodeNotFound;
            return await GenerateLockRowIfNotLocked(companyId, resourceId, resourceCode, ResourceType.Contract, lockFunctionalContext, userName, applicationSessionId);
        }

        public async Task<Unit> Handle(DeleteLocksCommand request, CancellationToken cancellationToken)
        {
            if (request.LockIds == null)
            {
                throw new ArgumentNullException(nameof(request.LockIds));
            }

            _unitOfWork.BeginTransaction();

            try
            {
                foreach (var lockId in request.LockIds)
                {
                    await _lockRepository.DeleteLockAsync(lockId);
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

        public async Task<Unit> Handle(RefreshLockOwnershipCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                if (request.ResourcesInformation != null && request.ResourcesInformation.Any())
                {
                    foreach (var resource in request.ResourcesInformation)
                    {
                        await RefreshLockOwnership(request.Company, request.ApplicationSessionId, resource.ResourceType, resource.ResourceCode, resource.ResourceId);
                    }
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

        private async Task RefreshLockOwnership(string company, string applicationSessionId, string resourceType, string resourceCode, long resourceId)
        {
            var lockState = await _lockQueries.GetLockStateAsync(company, resourceId, applicationSessionId, resourceType);
            if (IsLockeByAnotherUserOrDifferentSession(lockState))
            {
                lockState.ResourceType = resourceType;
                lockState.ResourceCode = resourceCode;
                throw new AtlasLockRefreshException(LockMessage.GenerateLockMessage(lockState));
            }
            else if (NoLockRowFound(lockState))
            {
                lockState.ResourceType = resourceType;
                lockState.ResourceCode = resourceCode;
                throw new AtlasLockRefreshException(LockMessage.GenerateLockMessage(lockState));
            }

            await _lockRepository.RefreshLockOwnershipAsync(company, resourceType, resourceId);
            if (resourceType == ResourceType.Contract)
            {
                var relatives = await _lockRepository.GetContractRelativesAsync(company, resourceId);
                foreach (var relative in relatives)
                {
                    await _lockRepository.RefreshLockOwnershipAsync(company, resourceType, relative);
                }
            }
            else if (resourceType == ResourceType.Invoice)
            {
                await RefreshInvoiceContracts(company, resourceId);
            }
            else if (resourceType == ResourceType.AccountingDocument)
            {
                var accountingDocument = await _lockRepository.GetAccountingDocumentInformation(resourceId, company, null);
                if (accountingDocument != null && accountingDocument.InvoiceId != null)
                {
                    await _lockRepository.RefreshLockOwnershipAsync(company, ResourceType.Invoice, accountingDocument.InvoiceId.Value);
                    await RefreshInvoiceContracts(company, accountingDocument.InvoiceId.Value);
                }
            }
        }

        private async Task RefreshInvoiceContracts(string company, long invoiceId)
        {
            var contracts = await _lockRepository.GetInvoiceInformation(invoiceId, company, null);
            var sectionIds = contracts.Select(x => x.SectionId).Distinct();
            foreach (var sectionId in sectionIds)
            {
                await _lockRepository.RefreshLockOwnershipAsync(company, ResourceType.Contract, sectionId);
            }
        }

        private static bool NoLockRowFound(LockStateResponseDto lockState)
        {
            return !lockState.IsLocked && lockState.ApplicationSessionId == null;
        }

        private static bool IsLockeByAnotherUserOrDifferentSession(LockStateResponseDto lockState)
        {
            return lockState.IsLocked;
        }

        public async Task<Unit> Handle(CleanSessionCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                await _lockRepository.CleanSessionAsync(request.ApplicationSessionId);

                _unitOfWork.Commit();
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }

            return Unit.Value;
        }
    }
}
