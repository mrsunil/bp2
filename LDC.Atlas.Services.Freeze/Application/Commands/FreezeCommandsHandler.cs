using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.MasterData.Common;
using LDC.Atlas.Services.Freeze.Entities;
using LDC.Atlas.Services.Freeze.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Freeze.Application.Commands
{
    public class FreezeCommandsHandler :
        IRequestHandler<CreateFreezeCommand, (int, IEnumerable<MonthEnd>)>,
        IRequestHandler<DeleteFreezeCommand>,
        IRequestHandler<RecalculateFreezeCommand>,
        IRequestHandler<CreateGlobalFreezeCommand, CreateGlobalFreezeResult>,
        IRequestHandler<PurgeFreezesCommand>
    {
        private readonly ILogger<FreezeCommandsHandler> _logger;
        private readonly IIdentityService _identityService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFreezeRepository _freezeRepository;
        private readonly IPreAccountingRepository _preAccountingRepository;
        private readonly IMasterDataService _masterDataService;
        private readonly ISystemDateTimeService _systemDateTimeService;

        public FreezeCommandsHandler(
            ILogger<FreezeCommandsHandler> logger,
            IIdentityService identityService,
            IUnitOfWork unitOfWork,
            IFreezeRepository freezeRepository,
            IPreAccountingRepository preAccountingRepository,
            IMasterDataService masterDataService,
            ISystemDateTimeService systemDateTimeService)
        {
            _freezeRepository = freezeRepository ?? throw new ArgumentNullException(nameof(freezeRepository));
            _preAccountingRepository = preAccountingRepository ?? throw new ArgumentNullException(nameof(preAccountingRepository));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _masterDataService = masterDataService ?? throw new ArgumentNullException(nameof(masterDataService));
            _systemDateTimeService = systemDateTimeService ?? throw new ArgumentNullException(nameof(systemDateTimeService));
        }

        public async Task<(int, IEnumerable<MonthEnd>)> Handle(CreateFreezeCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var companyDate = await _systemDateTimeService.GetCompanyDate(request.Company);

                var freezeDate = request.FreezeDate ??
                   (request.DataVersionTypeId == DataVersionType.Monthly ? companyDate.AddMonths(-1) : companyDate.AddDays(-1));

                var existingFreezes = await _freezeRepository.GetFreezeAsync(request.Company, freezeDate, request.DataVersionTypeId);
                if (existingFreezes != null)
                {
                    var accountingSetup = await _preAccountingRepository.GetAccountingSetup(request.Company);

                    if (accountingSetup != null && accountingSetup.IsInClosedMonth(freezeDate))
                    {
                        throw new AtlasBusinessException("The freeze you try to create is for a closed month.");
                    }
                }

                (int dataVersionId, IEnumerable<MonthEnd> monthEnd) = await CreateFreeze(request.Company, request.DataVersionTypeId, freezeDate, companyDate);

                _unitOfWork.Commit();

                _logger.LogInformation("New freeze created with id {Atlas_DataVersionId} for company {Atlas_CompanyId} and date {Atlas_FreezeDate}.", dataVersionId, request.Company, freezeDate);

                return (dataVersionId, monthEnd);
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<Unit> Handle(DeleteFreezeCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var freeze = await _freezeRepository.GetFreezeAsync(request.DataVersionId);

                if (freeze == null)
                {
                    throw new NotFoundException("Freeze", request.DataVersionId);
                }

                if (freeze.CompanyId != request.Company)
                {
                    throw new AtlasSecurityException($"The freeze you try to delete is not associated with the {request.Company} company.");
                }

                var accountingSetup = await _preAccountingRepository.GetAccountingSetup(request.Company);

                if (accountingSetup != null && accountingSetup.IsInClosedMonth(freeze.FreezeDate))
                {
                    throw new AtlasBusinessException($"The freeze you try to delete is for a closed month");
                }

                await _freezeRepository.DeleteFreezeAsync(request.DataVersionId);

                _unitOfWork.Commit();

                _logger.LogInformation("Freeze with id {Atlas_DataVersionId} deleted.", request.DataVersionId);
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }

            return Unit.Value;
        }

        public async Task<Unit> Handle(RecalculateFreezeCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var freeze = await _freezeRepository.GetFreezeAsync(request.DataVersionId);

                if (freeze == null)
                {
                    throw new NotFoundException("Freeze", request.DataVersionId);
                }

                if (freeze.CompanyId != request.Company)
                {
                    throw new AtlasSecurityException($"The freeze you try to recalculate is not associated with the {request.Company} company.");
                }

                var accountingSetup = await _preAccountingRepository.GetAccountingSetup(request.Company);

                if (accountingSetup != null && accountingSetup.IsInClosedMonth(freeze.FreezeDate))
                {
                    throw new AtlasBusinessException($"The freeze you try to recalculate is for a closed month");
                }

                await _freezeRepository.RecalculateFreezeAsync(request.DataVersionId, request.UserId, request.RecalculateAccEntries);

                _unitOfWork.Commit();

                _logger.LogInformation("Freeze with id {Atlas_DataVersionId} recalculated.", request.DataVersionId);
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }

            return Unit.Value;
        }

        public async Task<CreateGlobalFreezeResult> Handle(CreateGlobalFreezeCommand request, CancellationToken cancellationToken)
        {
            var companies = await _masterDataService.GetCompaniesAsync();

            var result = new CreateGlobalFreezeResult();

            foreach (var company in companies)
            {
                _unitOfWork.BeginTransaction();

                try
                {
                    var companyDate = await _systemDateTimeService.GetCompanyDate(company.CompanyId);

                    var freezeDate = request.FreezeDate ??
                        (request.DataVersionTypeId == DataVersionType.Monthly ? companyDate.AddMonths(-1) : companyDate.AddDays(-1));

                    (int dataVersionId, var monthEnd) = await CreateFreeze(company.CompanyId, request.DataVersionTypeId, freezeDate, companyDate);

                    _unitOfWork.Commit();

                    _logger.LogInformation("New freeze created with id {Atlas_DataVersionId} for company {Atlas_CompanyId} and date {Atlas_FreezeDate}.", dataVersionId, company.CompanyId, freezeDate);

                    result.Freezes.Add(new CreateGlobalFreezeResultDto { CompanyId = company.CompanyId, DataVersionId = dataVersionId });
                }
                catch (Exception)
                {
                    _unitOfWork.Rollback();
                    throw;
                }
            }

            return result;
        }

        public async Task<Unit> Handle(PurgeFreezesCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                await _freezeRepository.PurgeFreezesAsync(request.Company);

                _unitOfWork.Commit();

                _logger.LogInformation("Freezes purged for company {CompanyId}.", request.Company);
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }

            return Unit.Value;
        }

        private async Task<(int, IEnumerable<MonthEnd>)> CreateFreeze(string companyId, DataVersionType dataVersionType, DateTime freezeDate, DateTime companyDate)
        {
            // adding this try-catch block to handle SQL 500 exception and display proper error message on the Freeze UI.
            try
            {
                 IEnumerable<MonthEnd> monthEndFreeze= null;

                if (!IsFreezeDateValid(dataVersionType, freezeDate, companyDate))
                {
                    throw new AtlasBusinessException("Invalid freeze date.");
                }

                var freeze = await _freezeRepository.GetFreezeAsync(companyId, freezeDate, dataVersionType);

                if (freeze != null)
                {
                     monthEndFreeze = await _freezeRepository.IsMonthEndFreeze(freeze.DataVersionId);

                    foreach (var getMonthEnd in monthEndFreeze)
                    {
                        var isMonthEndFreezed = getMonthEnd.IsMonthEnd;
                        var isTAReversed = getMonthEnd.IsReversed;
                        if (isMonthEndFreezed)
                        {
                            if (!isTAReversed)
                            {
                                throw new AtlasBusinessException($"A freeze database already exists, please reverse all the month end TA documents linked to this freeze to proceed.");
                            }
                        }
                    }

                    _logger.LogInformation("Freeze with id {Atlas_DataVersionId} for date {Atlas_FreezeDate} is going to be overridden.", freeze.DataVersionId, freezeDate);
                    return (freeze.DataVersionId, monthEndFreeze);
                   }

                var duplicatedFreezes = await _freezeRepository.GetDuplicatedFreezeAsync(companyId, freezeDate, dataVersionType);
                if (duplicatedFreezes)
                {
                    throw new AtlasBusinessException("A freeze is already in creation for this date. Please retry later.");
                }

                var dataVersionId = await _freezeRepository.CreateFreezeAsync(companyId, freezeDate, dataVersionType);

                _logger.LogInformation("New freeze created with id {Atlas_DataVersionId}.", dataVersionId);

                return (dataVersionId, monthEndFreeze);
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        private static bool IsFreezeDateValid(DataVersionType dataVersionType, DateTime freezeDate, DateTime companyDate)
        {
            switch (dataVersionType)
            {
                case DataVersionType.Daily:
                    return freezeDate <= companyDate;
                case DataVersionType.Monthly:
                    return freezeDate < new DateTime(companyDate.Year, companyDate.Month, 1);
                default:
                    return false;
            }
        }
    }
}
