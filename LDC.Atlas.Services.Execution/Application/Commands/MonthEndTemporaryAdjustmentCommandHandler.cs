using AutoMapper;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.Services;
using LDC.Atlas.Services.Execution.Application.Queries;
using LDC.Atlas.Services.Execution.Application.Queries.Dto;
using LDC.Atlas.Services.Execution.Entities;
using LDC.Atlas.Services.Execution.Infrastructure.Policies;
using LDC.Atlas.Services.Trading.Repositories;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Application.Commands
{
    public class MonthEndTemporaryAdjustmentCommandHandler :
         IRequestHandler<MonthEndTemporaryAdjustmentListCommand, MonthEndTAResponse>
    {
        private readonly ILogger<MonthEndTemporaryAdjustmentCommandHandler> _logger;
        private readonly IIdentityService _identityService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMonthEndTemporaryAdjustmentRepository _monthEndTemporaryAdjustmentRepository;
        private readonly IAccountingSetUpQueries _accountingSetUpQueries;
        private readonly IMapper _mapper;
        private readonly IAuthorizationService _authorizationService;
        private readonly IProcessMessageService _processMessageService;
        private readonly IMonthEndTemporaryAdjustmetQueries _monthEndTemporaryAdjustmetQueries;

        public MonthEndTemporaryAdjustmentCommandHandler(
            ILogger<MonthEndTemporaryAdjustmentCommandHandler> logger,
            IIdentityService identityService,
            IUnitOfWork unitOfWork,
            IMonthEndTemporaryAdjustmentRepository monthEndTemporaryAdjustmentRepository,
            IAuthorizationService authorizationService,
            IMapper mapper,
            IAccountingSetUpQueries accountingSetUpQueries,
            IProcessMessageService processMessageService,
            IMonthEndTemporaryAdjustmetQueries monthEndTemporaryAdjustmetQueries)
        {
            _monthEndTemporaryAdjustmentRepository = monthEndTemporaryAdjustmentRepository ?? throw new ArgumentNullException(nameof(monthEndTemporaryAdjustmentRepository));
            _monthEndTemporaryAdjustmetQueries = monthEndTemporaryAdjustmetQueries ?? throw new ArgumentNullException(nameof(monthEndTemporaryAdjustmetQueries));
            _authorizationService = authorizationService ?? throw new ArgumentNullException(nameof(authorizationService));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper;
            _accountingSetUpQueries = accountingSetUpQueries;
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _processMessageService = processMessageService;
        }

        public async Task<MonthEndTAResponse> Handle(MonthEndTemporaryAdjustmentListCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                List<MonthEndTemporaryAdjustmentReport> monthEndTemporaryAdjustmentData = new List<MonthEndTemporaryAdjustmentReport>();
                if (request.ReportType == 3)
                {
                    monthEndTemporaryAdjustmentData= await GetFxDealMonthEndTemporaryAdjustment(request.Company, request.DataVersionId);
                }
                else
                {
                    monthEndTemporaryAdjustmentData = await GetMonthEndTemporaryAdjustment(request.Company, (int)MonthEndType.Postings, request.ReportType, request.DataVersionId, request.AccountingPeriod, request.DocumentDate);
                }

                var accountingSetUp = await _accountingSetUpQueries.GetAccountingSetup(request.Company);
                if (accountingSetUp != null)
                {
                    request.AccountingPeriod = CalculateAccountPeriod(accountingSetUp, request.DocumentDate);
                }
                else
                {
                    throw new Exception("Unable to create document header and lines");
                }

                var response = await _monthEndTemporaryAdjustmentRepository.SaveMonthEndReport(monthEndTemporaryAdjustmentData, request.Company, request.DataVersionId, request.ReportType, request.DocumentDate, request.AccountingPeriod);

                List<Atlas.Application.Core.Entities.ProcessMessage> postingProcessMessage = new List<Atlas.Application.Core.Entities.ProcessMessage>();

                var authorizationResult = await _authorizationService.AuthorizeAsync(_identityService.GetUser(), Policies.PostOpClosedPolicy);

                foreach (var documentId in response.TransactionDocumentId)
                {
                    var content = new JObject();
                    content.Add(new JProperty("docId", documentId));
                    content.Add(new JProperty("postOpClosedPolicy", authorizationResult.Succeeded));

                    Atlas.Application.Core.Entities.ProcessMessage message = new Atlas.Application.Core.Entities.ProcessMessage​
                    {
                        ProcessTypeId = (int)Atlas.Application.Core.Entities.ProcessType.AtlasAccountingDocumentProcessor,
                        CompanyId = request.Company,
                        Content = content.ToString(),
                    };
                    postingProcessMessage.Add(message);
                }

                await _processMessageService.SendBulkMessage(postingProcessMessage);

                _unitOfWork.Commit();

                _logger.LogInformation("autoreversal have been created:", response);

                return response;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

       private async Task<List<MonthEndTemporaryAdjustmentReport>> GetMonthEndTemporaryAdjustment(string company, short type, int? reportType, int? dataVersionId, DateTime? accountingPeriod, DateTime documentDate)
        {
            List<MonthEndTemporaryAdjustmentReport> monthEndTemporaryAdjustmentData = new List<MonthEndTemporaryAdjustmentReport>();
            var monthEndTemporaryAdjustments = await _monthEndTemporaryAdjustmetQueries.GetMonthEndTemporaryAdjustmentReportAsync(company, (int)MonthEndType.Postings, reportType, dataVersionId, null, null);
            if (monthEndTemporaryAdjustments != null && monthEndTemporaryAdjustments.Any())
            {
                monthEndTemporaryAdjustmentData = monthEndTemporaryAdjustments.ToList();

                monthEndTemporaryAdjustmentData.ForEach(x =>
                {
                    x.AccruedAmount = (reportType == 1) ?
                    (x.AccountLineTypeId != 3 ? Math.Round(-1 * (x.FullValue - x.InvoicedAmount), 2) : Math.Round(x.FullValue - x.InvoicedAmount, 2))
                    : ((x.IsOriginal == 0) ? Math.Round(x.FullValue - x.InvoicedAmount, 2) : Math.Round(-1 * (x.FullValue - x.InvoicedAmount), 2));

                    x.CurrencyCode = !string.IsNullOrWhiteSpace(x.CurrencyCode) ? x.CurrencyCode.Substring(0, 3) : x.CurrencyCode;
                    x.Quantity = Math.Round(x.Quantity, 2);
                });
            }

              return monthEndTemporaryAdjustmentData;

        }

        private async Task<List<MonthEndTemporaryAdjustmentReport>> GetFxDealMonthEndTemporaryAdjustment(string company, int? dataVersionId)
        {
            List<FxDealMonthEndTemporaryAdjustmentReport> monthEndTemporaryAdjustmentData = new List<FxDealMonthEndTemporaryAdjustmentReport>();
            var monthEndTemporaryAdjustments = await _monthEndTemporaryAdjustmetQueries.GetFxDealDetailsGenerateMonthEndAsync(company, dataVersionId, null, null);
            List<MonthEndTemporaryAdjustmentReport> monthEndTemporaryAdjustmentData1 = new List<MonthEndTemporaryAdjustmentReport>();
            MonthEndTemporaryAdjustmentReport monthEnd = new MonthEndTemporaryAdjustmentReport();
            if (monthEndTemporaryAdjustments != null)
            {
                foreach (var fxDealdata in monthEndTemporaryAdjustments)
                {
                    var firstRowData = fxDealdata;
                    monthEndTemporaryAdjustmentData.Add(new FxDealMonthEndTemporaryAdjustmentReport()
                    {
                        VariationMargin = (-1) * firstRowData.VariationMargin,
                        AccrualNumber = firstRowData.AccrualNumber,
                        CurrencyCode = firstRowData.CurrencyCode,
                        FxDealId = firstRowData.FxDealId,
                        NominalAccountId = firstRowData.Line1NominalAccountId,
                    });
                    monthEndTemporaryAdjustmentData.Add(new FxDealMonthEndTemporaryAdjustmentReport()
                    {
                        VariationMargin = firstRowData.VariationMargin,
                        AccrualNumber = firstRowData.AccrualNumber,
                        CurrencyCode = firstRowData.CurrencyCode,
                        FxDealId = firstRowData.FxDealId,
                        NominalAccountId = firstRowData.Line2NominalAccountId,
                    });
                }

                foreach (var monthEnddata in monthEndTemporaryAdjustmentData)
                {
                    monthEnd = new MonthEndTemporaryAdjustmentReport();
                    monthEnd.AccrualNumber = monthEnddata.AccrualNumber;
                    monthEnd.CurrencyCode = monthEnddata.CurrencyCode;
                    monthEnd.AccruedAmount = monthEnddata.VariationMargin;
                    monthEnd.NominalAccountId = monthEnddata.NominalAccountId;
                    monthEnd.FxDealId = monthEnddata.FxDealId;
                    monthEnd.AccountLineTypeId = (int)AccountingDocumentLineType.Ledger;
                    monthEndTemporaryAdjustmentData1.Add(monthEnd);
                    monthEnd = null;
                }
            }

            return monthEndTemporaryAdjustmentData1;
        }

        private DateTime CalculateAccountPeriod(AccountingSetupDto accountingSetup, DateTime documentDate)
        {
            bool isPostOpClosedPrivilege = false;

            isPostOpClosedPrivilege = CheckPrivileges().Result;

            if (IsLastMonthForOperationOpen(accountingSetup.LastMonthClosedForOperation, documentDate))
            {
                return documentDate;
            }
            else
            {
                if (isPostOpClosedPrivilege)
                {
                    if (IsLastMonthForAccountingOpen(accountingSetup.LastMonthClosed, documentDate, accountingSetup.NumberOfOpenPeriod))
                    {
                        return documentDate;
                    }
                    else
                    {
                        if (IsLastMonthForAccountingOpen(accountingSetup.LastMonthClosed, accountingSetup.LastMonthClosedForOperation, accountingSetup.NumberOfOpenPeriod))
                        {
                            return accountingSetup.LastMonthClosedForOperation;
                        }

                        return accountingSetup.LastMonthClosedForOperation.AddMonths(1);
                    }
                }

                return accountingSetup.LastMonthClosedForOperation.AddMonths(1);
            }
        }

        private bool IsLastMonthForOperationOpen(DateTime lastMonthForOperation, DateTime documentDate)
        {
            if ((lastMonthForOperation.Year == documentDate.Year && lastMonthForOperation.Month < documentDate.Month) || lastMonthForOperation.Year < documentDate.Year)
            {
                return true;
            }

            return false;
        }

        private bool IsLastMonthForAccountingOpen(DateTime lastMonthForAccounting, DateTime documentDate, int numberOfOpenPeriod)
        {
            int[] openMonthsForAccounting = new int[numberOfOpenPeriod];
            for (int i = 1; i <= numberOfOpenPeriod; i++)
            {
                openMonthsForAccounting[i - 1] = 0;

                if (lastMonthForAccounting.Month + i > 12)
                {
                    if (lastMonthForAccounting.Year + 1 == documentDate.Year)
                    {
                        openMonthsForAccounting[i - 1] = lastMonthForAccounting.Month + i - 12;
                    }
                }
                else
                {
                    if (lastMonthForAccounting.Year == documentDate.Year)
                    {
                        openMonthsForAccounting[i - 1] = lastMonthForAccounting.Month + i;
                    }
                }
            }

            if (openMonthsForAccounting.Contains(documentDate.Month))
            {
                return true;
            }

            return false;
        }

        private async Task<bool> CheckPrivileges()
        {
            var authorizationResult = await _authorizationService.AuthorizeAsync(_identityService.GetUser(), Policies.PostOpClosedPolicy);

            return authorizationResult.Succeeded;
        }
    }
}
