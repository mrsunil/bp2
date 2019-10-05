using LDC.Atlas.Application.Core.Entities;
using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Configuration.Entities;
using LDC.Atlas.Services.Configuration.Repositories;
using LDC.Atlas.Services.Configuration.Services;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Application.Commands
{
    public class ExecuteBatchCommandHandler :
        IRequestHandler<ExecuteBatchCommand, Unit>
    {
        private readonly ILogger _logger;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICleanUpRepository _cleanUpRepository;
        private readonly IBatchGroupRepository _batchGroupRepository;
        private readonly AtlasService _atlasService;

        public ExecuteBatchCommandHandler(
            ILogger<FunctionalObjectCommandsHandler> logger,
            IUnitOfWork unitOfWork,
            ICleanUpRepository cleanUpRepository,
            IBatchGroupRepository batchGroupRepository,
            AtlasService atlasService)
        {
            _cleanUpRepository = cleanUpRepository ?? throw new ArgumentNullException(nameof(cleanUpRepository));
            _batchGroupRepository = batchGroupRepository ?? throw new ArgumentNullException(nameof(batchGroupRepository));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _atlasService = atlasService ?? throw new ArgumentNullException(nameof(atlasService));
        }

        public async Task<Unit> Handle(ExecuteBatchCommand request, CancellationToken cancellationToken)
        {
            var batchGroup = await _batchGroupRepository.GetBatchGroupById(request.GroupId);

            if (batchGroup == null)
            {
                throw new NotFoundException("BatchGroup", request.GroupId);
            }

            var batchConfig = await _batchGroupRepository.GetBatchConfig(request.GroupId, request.ActionId);

            if (batchConfig != null && !batchConfig.IsEnabled)
            {
                _logger.LogInformation("Batch action {Atlas_BatchActionId} is not enabled for group {Atlas_BatchGroupId} is disabled.", request.ActionId, request.GroupId);

                return Unit.Value;
            }

            if (!batchGroup.Companies.Any())
            {
                _logger.LogWarning("No companies configured for batch group {Atlas_BatchGroupId}.", request.GroupId);

                return Unit.Value;
            }

            var batchHistory = new BatchHistory { GroupId = request.GroupId, ActionId = request.ActionId, StartTime = DateTime.UtcNow };

            try
            {
                if (request.ActionId == (int)BatchAction.CleanupAudit)
                {
                    await CleanUpAudit(batchGroup.Companies);
                }
                else if (request.ActionId == (int)BatchAction.CleanupProcessMessages)
                {
                    await CleanUpProcessMessages(batchGroup.Companies);
                }
                else if (request.ActionId == (int)BatchAction.CleanupSsrsPredicate)
                {
                    await CleanUpSsrsPredicates(batchGroup.Companies);
                }
                else if (request.ActionId == (int)BatchAction.CreateDailyFreeze)
                {
                    await CreateFreeze(batchGroup.Companies, DataVersionType.Daily);
                }
                else if (request.ActionId == (int)BatchAction.CreateMonthlyFreeze)
                {
                    await CreateFreeze(batchGroup.Companies, DataVersionType.Monthly);
                }
                else if (request.ActionId == (int)BatchAction.PostingProcess)
                {
                    await ExecutePostingProcess(batchGroup.Companies);
                }
                else if (request.ActionId == (int)BatchAction.SettleFxDeal)
                {
                    await ExecuteFXSettlements(batchGroup.Companies);
                }
                else if (request.ActionId == (int)BatchAction.SyncADStatusProcess)
                {
                    await SyncADStatus(batchGroup.Companies);
                }

                _logger.LogInformation("Batch action {Atlas_BatchActionId} has been executed for group {Atlas_BatchGroupId}.", request.ActionId, request.GroupId);

                batchHistory.Status = BatchExecutionStatus.Completed;
                batchHistory.Message = "Batch done.";

                return Unit.Value;
            }
            catch (Exception e)
            {
                batchHistory.Status = BatchExecutionStatus.Failed;
                batchHistory.Message = e.ToString();

                throw;
            }
            finally
            {
                batchHistory.EndTime = DateTime.UtcNow;
                await _batchGroupRepository.CreateBatchHistory(batchHistory);
            }
        }

        private async Task ExecutePostingProcess(ICollection<BatchCompany> companies)
        {
            try
            {
                foreach (var company in companies.OrderBy(c => c.Order))
                {
                    _logger.LogInformation("Start batch to execute posting process for company {Atlas_CompanyId}.", company.CompanyId);

                    await _atlasService.ProcessHeldAndMappingErrorDocuments(company.CompanyId);
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error executing posting process.");
                throw;
            }
        }

        private async Task ExecuteFXSettlements(ICollection<BatchCompany> companies)
        {
            try
            {
                foreach (var company in companies.OrderBy(c => c.Order))
                {
                    try
                    {
                        _logger.LogInformation("Start batch to execute FX Deal settlement process for company {Atlas_CompanyId}.", company.CompanyId);

                        await _atlasService.SettleFxDealAndCreateFJDocuments(company.CompanyId);
                    }
                    catch (Exception e)
                    {
                        _logger.LogError(e, "Error executing FX Settlements for company {Atlas_CompanyId}.", company.CompanyId);
                        throw;
                    }
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error executing FX Settlements process.");
                throw;
            }
        }

        private async Task CreateFreeze(ICollection<BatchCompany> companies, DataVersionType dataVersionType)
        {
            try
            {
                foreach (var company in companies.OrderBy(c => c.Order))
                {
                    _logger.LogInformation("Start batch to create freeze for company {Atlas_CompanyId}.", company.CompanyId);

                    await _atlasService.CreateFreeze(company.CompanyId, dataVersionType);
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error creating freeze.");
                throw;
            }
        }

        public async Task CleanUpAudit(ICollection<BatchCompany> companies)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                foreach (var company in companies.OrderBy(c => c.Order))
                {
                    _logger.LogInformation("Start clean up Audit data for company {Atlas_CompanyId}.", company.CompanyId);

                    await _cleanUpRepository.CleanUpAudit(company.Id);

                    _logger.LogInformation("Clean up Audit data has been executed for company {Atlas_CompanyId}.", company.CompanyId);
                }

                _unitOfWork.Commit();
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task CleanUpProcessMessages(ICollection<BatchCompany> companies)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                foreach (var company in companies.OrderBy(c => c.Order))
                {
                    _logger.LogInformation("Start clean up Process messages for company {Atlas_CompanyId}.", company.CompanyId);

                    await _cleanUpRepository.CleanUpProcessMessages(company.Id);

                    _logger.LogInformation("Clean up Process messages has been executed for company {Atlas_CompanyId}.", company.CompanyId);
                }

                _unitOfWork.Commit();
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task CleanUpSsrsPredicates(ICollection<BatchCompany> companies)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                foreach (var company in companies.OrderBy(c => c.Order))
                {
                    _logger.LogInformation("Start clean up SSRS predicates for company {Atlas_CompanyId}.", company.CompanyId);

                    await _cleanUpRepository.CleanUpSSRSPredicates(company.Id);

                    _logger.LogInformation("Clean Up SSRS predicates has been executed for company {Atlas_CompanyId}.", company.CompanyId);
                }

                _unitOfWork.Commit();
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        private async Task SyncADStatus(ICollection<BatchCompany> companies)
        {
            try
            {
                    try
                    {
                        _logger.LogInformation("Start batch to sync AD status process");

                        await _atlasService.SyncAndSaveADStatusProcess();
                    }
                    catch (Exception e)
                    {
                        _logger.LogError(e, "Error syncing AD status process");
                        throw;
                    }
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error syncing AD status process.");
                throw;
            }
        }
    }
}