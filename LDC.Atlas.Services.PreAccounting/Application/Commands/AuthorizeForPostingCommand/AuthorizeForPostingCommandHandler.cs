using LDC.Atlas.Application.Core.Entities;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.Services;
using LDC.Atlas.MasterData.Common;
using LDC.Atlas.Services.PreAccounting.Application.Queries;
using LDC.Atlas.Services.PreAccounting.Application.Queries.Dto;
using LDC.Atlas.Services.PreAccounting.Entities;
using LDC.Atlas.Services.PreAccounting.Repositories;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Application.Commands
{
    public partial class AuthorizeForPostingCommandHandler : IRequestHandler<AuthorizeForPostingCommand, Unit>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IIdentityService _identityService;
        private readonly ILogger _logger;
        private readonly IAuthorizationService _authorizationService;
        private readonly IAccountingDocumentQueries _accountingQueries;
        private readonly IAccountingDocumentRepository _accountingDocumentRepository;
        private readonly ISystemDateTimeService _systemDateTimeService;
        private readonly IProcessMessageService _processMessageService;
        private readonly IForeignExchangeRateService _foreignExchangeRateService;

        public AuthorizeForPostingCommandHandler(
          ILogger<AuthorizeForPostingCommandHandler> logger,
          IUnitOfWork unitOfWork,
          IIdentityService identityService,
          IAuthorizationService authorizationService,
          IAccountingDocumentQueries accountingQueries,
          ISystemDateTimeService systemDateTimeService,
          IProcessMessageService processMessageService,
          IAccountingDocumentRepository accountingDocumentRepository,
          IForeignExchangeRateService foreignExchangeRateService)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _authorizationService = authorizationService ?? throw new ArgumentNullException(nameof(authorizationService));
            _systemDateTimeService = systemDateTimeService ?? throw new ArgumentNullException(nameof(systemDateTimeService));
            _processMessageService = processMessageService ?? throw new ArgumentNullException(nameof(processMessageService));
            _accountingQueries = accountingQueries;
            _accountingDocumentRepository = accountingDocumentRepository;
            _foreignExchangeRateService = foreignExchangeRateService;
        }

        public async Task<Unit> Handle(AuthorizeForPostingCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                // TODO: validation = Only document within following status can be updated: PostingStatus.MappingError, PostingStatus.Held, PostingStatus.Incomplete
                var listOfDocId = request.AccountingDocuments.Select(d => d.AccountingId).ToList();

                bool postOpClosedPolicy = await CommonRules.CheckPrivileges(_authorizationService, _identityService);

                await AuthorizeForPosting(listOfDocId, request.Company, postOpClosedPolicy);

                _unitOfWork.Commit();

                _logger.LogInformation($"Authorize for posting documents {string.Join(",", listOfDocId)}.");
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }

            return Unit.Value;
        }

        private async Task AuthorizeForPosting(List<long> listOfDocId, string company, bool postOpClosedPolicy)
        {
            List<AccountingDocument> accountDocumentsDto = (await _accountingDocumentRepository.GetAccountingDocumentsByAccountingIdsAsync(listOfDocId, company)).ToList();

            var companyDate = await _systemDateTimeService.GetCompanyDate(company);

            foreach (AccountingDocument accountingDocumentDto in accountDocumentsDto)
            {
                await CommonRules.CalculateFunctionalAndStatutoryCurrencyAccountingLine(_foreignExchangeRateService, accountingDocumentDto);

                AccountingSetupDto accountingSetup = await _accountingQueries.GetAccountingSetup((int)accountingDocumentDto.TransactionDocumentTypeId, company);

                accountingDocumentDto.StatusId = await CommonRules.ReturnAccountingDocumentStatus(_accountingQueries, accountingDocumentDto, companyDate, company, accountingSetup);

                await _accountingDocumentRepository.UpdateAccountingDocumentStatutoryAndFunctionalCurrencyAmounts(company, accountingDocumentDto);
            }

            var listOfAuthorizedDocument = accountDocumentsDto.Where(x => x.StatusId == PostingStatus.Authorised).ToList();

            foreach (AccountingDocument accountingDocument in listOfAuthorizedDocument)
            {
                await EnqueuePostingProcessorMessage(accountingDocument.AccountingId, company, postOpClosedPolicy);
            }
        }

        private async Task EnqueuePostingProcessorMessage(long docId, string company, bool postOpClosedPolicy)
        {
            var content = new JObject();
            content.Add(new JProperty("docId", docId));
            content.Add(new JProperty("postOpClosedPolicy", postOpClosedPolicy));

            await _processMessageService.SendMessage(new ProcessMessage
            {
                ProcessTypeId = (long)ProcessType.AtlasPostingProcessor,
                CompanyId = company,
                Content = content.ToString()
            });
        }
    }
}