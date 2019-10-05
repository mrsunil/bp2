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
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Application.Commands
{
    public class YearEndProcessListCommandHandler :
         IRequestHandler<YearEndProcessListCommand, List<YearEndProcessReportResponse>>
    {
        private readonly ILogger<YearEndProcessListCommandHandler> _logger;
        private readonly IIdentityService _identityService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IYearEndProcessRepository _yearEndProcessRepository;
        private readonly IAccountingSetUpQueries _accountingSetUpQueries;
        private readonly IMapper _mapper;
        private readonly IAuthorizationService _authorizationService;
        private readonly IProcessMessageService _processMessageService;
        private readonly IYearEndProcessQueries _yearEndProcessQueries;

        public YearEndProcessListCommandHandler(
            ILogger<YearEndProcessListCommandHandler> logger,
            IIdentityService identityService,
            IUnitOfWork unitOfWork,
             IYearEndProcessRepository yearEndProcessRepository,
            IAuthorizationService authorizationService,
            IMapper mapper,
            IAccountingSetUpQueries accountingSetUpQueries,
            IProcessMessageService processMessageService,
            IYearEndProcessQueries yearEndProcessQueries)
        {
            _yearEndProcessRepository = yearEndProcessRepository ?? throw new ArgumentNullException(nameof(yearEndProcessRepository));
            _yearEndProcessQueries = yearEndProcessQueries ?? throw new ArgumentNullException(nameof(yearEndProcessQueries));
            _authorizationService = authorizationService ?? throw new ArgumentNullException(nameof(authorizationService));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper;
            _accountingSetUpQueries = accountingSetUpQueries;
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _processMessageService = processMessageService;
        }

        public async Task<List<YearEndProcessReportResponse>> Handle(YearEndProcessListCommand request, CancellationToken cancellationToken)
        {
            List<YearEndProcessReportResponse> yearEndProcessReportResponse = new List<YearEndProcessReportResponse>();
            _unitOfWork.BeginTransaction();

            try
            {
                var status = false;
                string documentReference = string.Empty;

                var yearEndProcessExist = await _yearEndProcessRepository.CheckYearEndProcessExistence(request.Company, request.Year);
                if (yearEndProcessExist.Exists && !yearEndProcessExist.IsLocked)
                {
                    status = await _yearEndProcessRepository.ReverseYearEndDocument(request.Company, request.Year);
                }

                var pnlbookingResponse = await _yearEndProcessRepository.CreateAccountingDocumentForYearEndPAndLBookings(request.Company, request.Year, request.BSReserveAccountId);
                foreach (var item in pnlbookingResponse)
                {
                    documentReference = documentReference + "," + item.DocumentReference;
                    documentReference = documentReference.Trim(',');
                }

                YearEndProcessReportResponse yearEndProcessReportResponsePnL = new YearEndProcessReportResponse();
                yearEndProcessReportResponsePnL.ReportName = "P&L Booking";
                yearEndProcessReportResponsePnL.YearEndProcessResponses = pnlbookingResponse;

                var balanceSheetBankAndLedgerResponse = await _yearEndProcessRepository.CreateAccountingDocumentForYearEndBalanceSheetBankAndLedger(request.Company, request.Year);
                foreach (var item in balanceSheetBankAndLedgerResponse)
                {
                    documentReference = documentReference + "," + item.DocumentReference;
                    documentReference = documentReference.Trim(',');
                }

                YearEndProcessReportResponse yearEndProcessReportResponseBankAndLedger = new YearEndProcessReportResponse();
                yearEndProcessReportResponseBankAndLedger.ReportName = "Balance Sheet Bank & Ledger";
                yearEndProcessReportResponseBankAndLedger.YearEndProcessResponses = balanceSheetBankAndLedgerResponse;

                var balanceSheetCustomerAndVendorResponse = await _yearEndProcessRepository.CreateAccountingDocumentForYearEndBalanceSheetCustomerAndVendor(request.Company, request.Year);
                foreach (var item in balanceSheetCustomerAndVendorResponse)
                {
                    documentReference = documentReference + "," + item.DocumentReference;
                    documentReference = documentReference.Trim(',');
                }

                YearEndProcessReportResponse yearEndProcessReportResponseCustomerAndVendor = new YearEndProcessReportResponse();
                yearEndProcessReportResponseCustomerAndVendor.ReportName = "Balance Sheet Customer & Vendor";
                yearEndProcessReportResponseCustomerAndVendor.YearEndProcessResponses = balanceSheetCustomerAndVendorResponse;

                yearEndProcessReportResponse.Add(yearEndProcessReportResponsePnL);
                yearEndProcessReportResponse.Add(yearEndProcessReportResponseBankAndLedger);
                yearEndProcessReportResponse.Add(yearEndProcessReportResponseCustomerAndVendor);

                if (pnlbookingResponse[0].IsSuccess && balanceSheetBankAndLedgerResponse[0].IsSuccess && balanceSheetCustomerAndVendorResponse[0].IsSuccess)
                {
                    status = true;
                }

                if (request.IsFinalRun)
                {
                    await _yearEndProcessRepository.UpdateYearEndSetup(request.Company, request.Year);
                }

                _unitOfWork.Commit();

                return yearEndProcessReportResponse;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }
    }
}
