using AutoMapper;
using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.MasterData.Common;
using LDC.Atlas.MasterData.Common.Entities;
using LDC.Atlas.Services.PreAccounting.Entities;
using LDC.Atlas.Services.PreAccounting.Infrastructure.Policies;
using LDC.Atlas.Services.PreAccounting.Repositories;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using System;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Application.Commands
{
    public partial class UpdateAccountingDocumentCommandHandler : IRequestHandler<UpdateAccountingDocumentCommand, SectionPostingStatus>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IIdentityService _identityService;
        private readonly ILogger _logger;
        private readonly IMapper _mapper;
        private readonly IAuthorizationService _authorizationService;
        private readonly IMasterDataService _masterDataService;
        private readonly IAccountingDocumentRepository _accountingDocumentRepository;
        private readonly IForeignExchangeRateService _foreignExchangeRateService;

        public UpdateAccountingDocumentCommandHandler(
          ILogger<UpdateAccountingDocumentCommandHandler> logger,
          IUnitOfWork unitOfWork,
          IIdentityService identityService,
          IMapper mapper,
          IAuthorizationService authorizationService,
          IMasterDataService masterDataService,
          IAccountingDocumentRepository accountingDocumentRepository,
          IForeignExchangeRateService foreignExchangeRateService)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
            _mapper = mapper;
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _authorizationService = authorizationService ?? throw new ArgumentNullException(nameof(authorizationService));
            _masterDataService = masterDataService;
            _accountingDocumentRepository = accountingDocumentRepository;
            _foreignExchangeRateService = foreignExchangeRateService;
        }

        public async Task<SectionPostingStatus> Handle(UpdateAccountingDocumentCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                SectionPostingStatus reference;
                AccountingDocument accountingDocument = new AccountingDocument();

                accountingDocument = await MapCommandToAccountingDocument(request);
                var isJLorTADocument = (accountingDocument.TransactionDocumentTypeId == (int)DocumentType.MTA || accountingDocument.TransactionDocumentTypeId == (int)DocumentType.MJL) ? true : false;
                var isPostedType = accountingDocument.StatusId == PostingStatus.Posted ? true : false;

                var authorizationEditAccountingEntriesPolicy = await _authorizationService.AuthorizeAsync(_identityService.GetUser(), accountingDocument, Policies.EditAccountingEntriesPolicy);
                var authorizationCreateEditDocumentPolicy = await _authorizationService.AuthorizeAsync(_identityService.GetUser(), accountingDocument, Policies.CreateEditDocumentPolicy);
                var authorizationPostingManagementPolicy = await _authorizationService.AuthorizeAsync(_identityService.GetUser(), accountingDocument, Policies.PostingManagementPolicy);

                if ((authorizationEditAccountingEntriesPolicy.Succeeded && isPostedType) || ((authorizationCreateEditDocumentPolicy.Succeeded && isJLorTADocument) || (authorizationPostingManagementPolicy.Succeeded && !isJLorTADocument)))
                {
                    reference = await _accountingDocumentRepository.UpdateAccountingDocument(accountingDocument, request.Company);
                }
                else
                {
                    throw new AtlasSecurityException("One or more privileges are required to perform this action.");
                }

                _unitOfWork.Commit();

                _logger.LogInformation("Accounting Document updated", reference.PostingStatusId);
                return reference;
            }
            catch
            {
                _unitOfWork.Rollback();

                throw;
            }
        }

        private async Task<AccountingDocument> MapCommandToAccountingDocument(UpdateAccountingDocumentCommand command)
        {
            AccountingDocument accountingDocument = new AccountingDocument();
            accountingDocument.AccountingPeriod = command.AccountingPeriod;
            accountingDocument.AccountingId = command.AccountingId;
            accountingDocument.CurrencyCode = command.CurrencyCode;
            accountingDocument.DocumentDate = command.DocumentDate;
            accountingDocument.ValueDate = command.ValueDate;
            accountingDocument.ToInterface = command.ToInterface;
            accountingDocument.DmsId = command.DmsId;
            accountingDocument.TransactionDocumentTypeId = (int)command.TransactionDocumentTypeId;
            if (command.StatusId == PostingStatus.Posted)
            {
                accountingDocument.StatusId = command.StatusId;
            }
            else if (!command.IsAuthorizedControlEnabled)
            {
                accountingDocument.StatusId = PostingStatus.Incomplete;
            }

            accountingDocument.AccountingDocumentLines = command.AccountingDocumentLines;

            Company company = await _masterDataService.GetCompanyByIdAsync(command.Company);

            var fxRates = CommonRules.GetFxRateInformation(accountingDocument.DocumentDate, accountingDocument.CurrencyCode, company);

            if (fxRates.FxRateInvoiceCurrency != null)
            {
                foreach (AccountingDocumentLine accountingDocumentLine in accountingDocument.AccountingDocumentLines)
                {
                    if (accountingDocumentLine.AccountingCategoryId <= 0 && accountingDocumentLine.AccountLineTypeId >= 1)
                    {
                        if (accountingDocumentLine.AccountLineTypeId == (int)AccountLineType.C || accountingDocumentLine.AccountLineTypeId == (int)AccountLineType.V)
                        {
                            accountingDocumentLine.AccountingCategoryId = (int)AccountingCategory.C;
                        }
                        else if (accountingDocumentLine.AccountLineTypeId == (int)AccountLineType.B || accountingDocumentLine.AccountLineTypeId == (int)AccountLineType.L)
                        {
                            accountingDocumentLine.AccountingCategoryId = (int)AccountingCategory.N;
                        }
                    }

                    if (string.IsNullOrEmpty(accountingDocumentLine.Narrative) && accountingDocument.TransactionDocumentTypeId == (int)DocumentType.MTA)
                    {
                            accountingDocumentLine.Narrative = "Manual Accrual of " + accountingDocument.AccountingPeriod.ToString("MMM-yyyy", CultureInfo.InvariantCulture);
                    }

                    accountingDocumentLine.Amount = Math.Round(accountingDocumentLine.Amount, CommonRules.RoundDecimals);

                    decimal? amountInUSD = accountingDocumentLine.Amount;

                    if (accountingDocument.CurrencyCode != null && accountingDocument.CurrencyCode.ToUpperInvariant() != CommonRules.BaseCurrency)
                    {
                        amountInUSD = (await _foreignExchangeRateService.Convert(fxRates.FxRateInvoiceCurrency.FxCurrency, CommonRules.BaseCurrency, accountingDocumentLine.Amount, fxRates.FxRateInvoiceCurrency.FxDate)).ConvertedValue;
                    }

                    await CommonRules.CalculateFunctionalAndStatutoryCurrency(_foreignExchangeRateService, accountingDocumentLine, amountInUSD, fxRates, company, CommonRules.BaseCurrency, CommonRules.RoundDecimals);
                }
            }

            accountingDocument.GLDate = command.GLDate;
            return accountingDocument;
        }
    }
}