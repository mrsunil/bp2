using LDC.Atlas.Application.Core.Entities;
using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.AccountingInterface.Entities;
using LDC.Atlas.Services.AccountingInterface.Repositories;
using LDC.Atlas.Audit.Common;
using LDC.Atlas.Audit.Common.Entities;
using LDC.Atlas.Audit.Common.Queries.Dto;
using LDC.Atlas.Services.AccountingInterface.Services;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using System;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;
using System.Xml;
using static LDC.Atlas.Services.AccountingInterface.Infrastructure.Policies.AuthorizationPolicyExtension;

namespace LDC.Atlas.Services.AccountingInterface.Application.Commands
{
    public class AccountingInterfaceCommandsHandler :
        IRequestHandler<ProcessInterfaceDataChangeLogsRequest>,
        IRequestHandler<ProcessESBResponse, ProcessESBResult>,
        IRequestHandler<UpdateInterfaceStatusCommand>
    {
        private readonly ILogger<AccountingInterfaceCommandsHandler> _logger;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAccountingInterfaceRepository _accountingInterfaceRepository;
        private readonly IESBService _esbService;
        private readonly ISystemDateTimeService _systemDateTimeService;
        private readonly IIdentityService _identityService;
        private readonly IAuthorizationService _authorizationService;
        private readonly IInterfaceEventLogService _interfaceEventLogService;

        private ProcessESBResult processESBResult = new ProcessESBResult();

        public AccountingInterfaceCommandsHandler(
            ILogger<AccountingInterfaceCommandsHandler> logger,
            IUnitOfWork unitOfWork,
            IAccountingInterfaceRepository accountingInterfaceRepository,
            IESBService esbService,
            ISystemDateTimeService systemDateTimeService,
            IIdentityService identityService,
            IAuthorizationService authorizationService,
            IInterfaceEventLogService interfaceEventLogService)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _accountingInterfaceRepository = accountingInterfaceRepository ?? throw new ArgumentNullException(nameof(accountingInterfaceRepository));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _esbService = esbService ?? throw new ArgumentNullException(nameof(esbService));
            _systemDateTimeService = systemDateTimeService ?? throw new ArgumentNullException(nameof(systemDateTimeService));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _authorizationService = authorizationService ?? throw new ArgumentNullException(nameof(authorizationService));
            _interfaceEventLogService = interfaceEventLogService ?? throw new ArgumentNullException(nameof(interfaceEventLogService));
        }

        public async Task<Unit> Handle(ProcessInterfaceDataChangeLogsRequest request, CancellationToken cancellationToken)
        {
            int tAorJLTypeId = 0;
            // There should be no record in DB the first time.
            var docStatus = await _accountingInterfaceRepository.GetDocumentStatus((int)BusinessApplicationType.AX, request.CompanyId, null, request.TransactionDocumentId, request.DocumentId);
            var docReference = await _accountingInterfaceRepository.GetDocumentReferenceByAccountingId(request.DocumentId, (int)request.DocumentTypeId, request.CompanyId);

            if (docStatus == InterfaceStatus.None || docStatus == InterfaceStatus.TransmitError)
            {
                long eventId;
                if (request.DocumentTypeId == DocumentType.ManualTemporaryAdjustment)
                {
                    tAorJLTypeId = await _accountingInterfaceRepository.GetTATypeIdAsync(request.TransactionDocumentId, request.DocumentTypeId, request.CompanyId);
                }

                if (request.DocumentTypeId == DocumentType.RegularJournal)
                {
                    tAorJLTypeId = await _accountingInterfaceRepository.GetJLTypeIdAsync(request.TransactionDocumentId, request.DocumentTypeId, request.CompanyId);
                }

                EventSubType eventSubType = await GetEventSubType(request.DocumentTypeId, tAorJLTypeId);

                _unitOfWork.BeginTransaction();
                var eventdata = new Event((int)eventSubType, request.DocumentId, docReference, (int)InterfaceStatus.ReadyToTransmit, request.CompanyId, null);

                try
                {
                    eventId = await _interfaceEventLogService.CreateEventAsync(eventdata);
                    // Insert Record into InterfaceStatus
                    await ProcessStatusUpdate(request, InterfaceStatus.InterfaceReady, "Ready To be Interfaced");

                    _unitOfWork.Commit();
                }
                catch
                {
                    _unitOfWork.Rollback();
                    throw;
                }

                var companyDate = await _systemDateTimeService.GetCompanyDate(request.CompanyId);

                _logger.LogInformation("Accounting Document with DocumentId {Atlas_DocumentId} having status {Atlas_InterfaceStatus} is sent to Accounting System at {Atlas_DateTime}", request.DocumentId, docStatus.ToString(), companyDate);

                var accountingInterfaceXMLMessage = await _accountingInterfaceRepository.GetESBMessageAsync(request.DocumentId, request.CompanyId);
                var eventHistory = new EventHistory(eventId, "Message Generated", accountingInterfaceXMLMessage, null, null);
                _unitOfWork.BeginTransaction();
                try
                {
                    await _interfaceEventLogService.CreateEventHistoryAsync(eventHistory, request.CompanyId);
                    _unitOfWork.Commit();
                }
                catch
                {
                    _unitOfWork.Rollback();
                    throw;
                }

                await SendBusinessObjectToInterface(request, accountingInterfaceXMLMessage, tAorJLTypeId, eventId, false);
            }
            else
            {
                _logger.LogWarning("Invalid Document ({Atlas_DocumentReference}) status {Atlas_InterfaceStatus}.", request.DocumentReference, docStatus.ToString());
            }

            return Unit.Value;
        }

        private async Task SendBusinessObjectToInterface(ProcessInterfaceDataChangeLogsRequest request, string accountingInterfaceXMLMessage,int tAorJLType, long eventId, bool isResendRequest)
        {
            bool messageCheck = true;
            if (!string.IsNullOrWhiteSpace(accountingInterfaceXMLMessage))
            {
                messageCheck = false;
                // Call ESB service and send the XML message to accounting system
                var xmlDoc = new XmlDocument();
                xmlDoc.LoadXml(accountingInterfaceXMLMessage);
                await ProcessAccountingInterfaceRequest(request, xmlDoc.OuterXml, tAorJLType, eventId, isResendRequest);
            }
            else
            {
                _logger.LogWarning("Accounting interface XML message is invalid.");
                var eventHistory = new EventHistory(eventId, "Error- Message generated", accountingInterfaceXMLMessage, null, null);
                var updateEventStatus = new Event(eventId, (long)InterfaceStatus.TransmitError, "Accounting interface XML message is invalid.");
                _unitOfWork.BeginTransaction();
                try
                {
                    await _interfaceEventLogService.UpdateEventStatusAsync(updateEventStatus, request.CompanyId);
                    await _interfaceEventLogService.CreateEventHistoryAsync(eventHistory, request.CompanyId);
                    await ProcessStatusUpdate(request, InterfaceStatus.TransmitError, "Accounting interface XML message is invalid.");
                    _unitOfWork.Commit();
                }
                catch
                {
                    _unitOfWork.Rollback();
                    if (!isResendRequest)
                    {
                        if (messageCheck)
                        {
                            throw new AtlasBusinessException("CSV File is empty.");
                        }
                        else
                        {
                            throw;
                        }
                    }
                }
            }
        }

        private async Task ProcessStatusUpdate(ProcessInterfaceDataChangeLogsRequest request, InterfaceStatus status, string message)
        {
            await _accountingInterfaceRepository.InsertOrUpdateInterfaceStatusAsync(request, status);

            await _accountingInterfaceRepository.InsertInterfaceLogsAsync(request, status, message);
        }

        private async Task ProcessAccountingInterfaceRequest(ProcessInterfaceDataChangeLogsRequest request, string accountingInterfaceXMLMessage, int tAorJLTypeId, long eventId, bool isResendRequest)
        {
            try
            {
                // Esb call inside its own try/catch
                request.UUID = await _esbService.CallESBClient(accountingInterfaceXMLMessage, request.DocumentTypeId, tAorJLTypeId);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);

                _unitOfWork.BeginTransaction();
                try
                {
                    var updateEventStatus = new Event(eventId, (long)InterfaceStatus.TransmitError, e.Message);
                    var eventHistory = new EventHistory(eventId, "Sending the message to ESB", null, ResultCode.Error.ToString(), e.Message);
                    await _interfaceEventLogService.UpdateEventStatusAsync(updateEventStatus, request.CompanyId);
                    await _interfaceEventLogService.CreateEventHistoryAsync(eventHistory, request.CompanyId);
                    await ProcessStatusUpdate(request, InterfaceStatus.TransmitError, e.Message);

                    _unitOfWork.Commit();
                }
                catch
                {
                    _unitOfWork.Rollback();
                    throw;
                }

                if (!isResendRequest)
                {
                    throw;
                }
            }

            _unitOfWork.BeginTransaction();
            try
            {
                if (request.UUID != null)
                {
                    var updateEventStatus = new Event(eventId, (long)InterfaceStatus.StandBy, request.UUID);
                    var eventHistory = new EventHistory(eventId, "Sending the message to ESB", null, ResultCode.Ok.ToString(), request.UUID);
                    await _interfaceEventLogService.UpdateEventStatusAsync(updateEventStatus, request.CompanyId);
                    await _interfaceEventLogService.CreateEventHistoryAsync(eventHistory, request.CompanyId);
                    await ProcessStatusUpdate(request, InterfaceStatus.StandBy, accountingInterfaceXMLMessage);
                }
                else
                {
                    var updateEventStatus = new Event(eventId, (long)InterfaceStatus.TransmitError, accountingInterfaceXMLMessage);
                    var eventHistory = new EventHistory(eventId, "Sending the message to ESB", null, ResultCode.Error.ToString(), accountingInterfaceXMLMessage);
                    await _interfaceEventLogService.UpdateEventStatusAsync(updateEventStatus, request.CompanyId);
                    await _interfaceEventLogService.CreateEventHistoryAsync(eventHistory, request.CompanyId);
                    await ProcessStatusUpdate(request, InterfaceStatus.TransmitError, accountingInterfaceXMLMessage);
                }

                _unitOfWork.Commit();
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        private async Task<ProcessESBResult> ValidateESBResponse(ProcessESBResponse esbRequest)
        {
            var docStatus = await _accountingInterfaceRepository.GetDocumentStatus(Convert.ToInt32(BusinessApplicationType.AX, CultureInfo.InvariantCulture), esbRequest.CompanyId, esbRequest.DocumentReference);

            if (docStatus != InterfaceStatus.None)
            {
                if (docStatus == InterfaceStatus.Completed)
                {
                    string message = "The document " + esbRequest.DocumentReference + " is in status 'Booked'";
                    processESBResult.Error = message;
                    processESBResult.IsSuccess = false;
                }
                else
                {
                    processESBResult.IsSuccess = true;
                }
            }
            else
            {
                string message = "Invalid Document Reference";
                processESBResult.Error = message;
                processESBResult.IsSuccess = false;
            }

            return processESBResult;
        }

        public async Task<ProcessESBResult> Handle(ProcessESBResponse esbRequest, CancellationToken cancellationToken)
        {
            CultureInfo cultureInfo = Thread.CurrentThread.CurrentCulture;
            TextInfo textInfo = cultureInfo.TextInfo;
            var companyDate = await _systemDateTimeService.GetCompanyDate(esbRequest.CompanyId);
            long sourceId = await _interfaceEventLogService.GetAccountingIdandCashIdbyDocumentReference(esbRequest.CompanyId, esbRequest.DocumentReference, (int)BusinessApplicationType.AX, (int)esbRequest.BusinessObjectType);
            var eventDto = new EventDto(sourceId, esbRequest.DocumentReference, (int)esbRequest.BusinessObjectType, esbRequest.CompanyId);
            var eventStatus = await _interfaceEventLogService.FindEventAsync(eventDto);
            if (eventStatus != null)
            {
                var eventHistoryData = new EventHistory(eventStatus.EventId, "Callback message received from ESB", esbRequest.ESBMessage, null, null);
                await _interfaceEventLogService.CreateEventHistoryAsync(eventHistoryData, esbRequest.CompanyId);
                _unitOfWork.BeginTransaction();
                try
                {
                    var responseToESB = await ValidateESBResponse(esbRequest);
                    if (responseToESB.IsSuccess)
                    {
                        var processInterfaceData = new ProcessInterfaceDataChangeLogsRequest();
                        processInterfaceData.DocumentReference = esbRequest.DocumentReference;
                        processInterfaceData.CompanyId = esbRequest.CompanyId;
                        processInterfaceData.BusinessApplicationType = BusinessApplicationType.AX;
                        processInterfaceData.ESBMessage = esbRequest.ESBMessage;
                        processInterfaceData.AcknowledgementId = esbRequest.AckBusinessDocId;
                        processInterfaceData.TransactionDate = esbRequest.TransactionDate.GetValueOrDefault() == default(DateTime) ? null : esbRequest.TransactionDate;
                        processInterfaceData.TimeStamp = esbRequest.TimeStamp;
                        processInterfaceData.JournalNumber = esbRequest.JournalNumber;
                        InterfaceStatus status;
                        if (Enum.TryParse(textInfo.ToTitleCase(esbRequest.ResponseStatus.ToLowerInvariant()), out status))
                        {
                            switch (status)
                            {
                                case InterfaceStatus.Completed:
                                    await ProcessEventUpdate(eventStatus.EventId, InterfaceStatus.Completed, "ESB callback Message integration", esbRequest.ESBMessage, ResultCode.Ok.ToString(), null, esbRequest.CompanyId);
                                    await ProcessStatusUpdate(processInterfaceData, InterfaceStatus.Completed, esbRequest.ResponseMessage);
                                    break;
                                case InterfaceStatus.Error:
                                    await ProcessEventUpdate(eventStatus.EventId, InterfaceStatus.Error, "ESB callback Message integration", esbRequest.ESBMessage, ResultCode.Error.ToString(), esbRequest.ResponseMessage, esbRequest.CompanyId);
                                    await ProcessStatusUpdate(processInterfaceData, InterfaceStatus.Error, esbRequest.ResponseMessage);
                                    break;
                                case InterfaceStatus.Rejected:
                                    await ProcessEventUpdate(eventStatus.EventId, InterfaceStatus.Rejected, "ESB callback Message integration", esbRequest.ESBMessage, ResultCode.Error.ToString(), esbRequest.ResponseMessage, esbRequest.CompanyId);
                                    await ProcessStatusUpdate(processInterfaceData, InterfaceStatus.Rejected, esbRequest.ResponseMessage);
                                    break;
                            }
                        }
                    }

                    _unitOfWork.Commit();
                    _logger.LogInformation("Document with DocumentId {Atlas_AccountingDocumentReference} received status {Atlas_AccountingStatus} from Accounting System at {Atlas_DateTime}", esbRequest.DocumentReference, esbRequest.ResponseStatus, companyDate);
                    return responseToESB;
                }
                catch
                {
                    _unitOfWork.Rollback();
                    throw;
                }
            }
            else
            {
                processESBResult.Error = "Invalid Document Reference";
                processESBResult.IsSuccess = false;
                return processESBResult;
            }
        }

        private async Task<AuthorizationResult> CheckPrivileges(InterfaceStatus status)
        {
            switch (status)
            {
                case InterfaceStatus.InterfaceReady:
                    return AuthorizationResult.Success();

                // NEED TO BE IMPLEMENTED.
                // As this point, we don't know if we have a 'Resend' action from the 'functional' or 'technical' tab

                //var resendNotPostedResult = _authorizationService.AuthorizeAsync(_identityService.GetUser(), null, Policies.ResendNotPostedAccountingInterfacePolicy);
                //var resendErrorResult = _authorizationService.AuthorizeAsync(_identityService.GetUser(), null, Policies.ResendErrorAccountingInterfacePolicy);

                case InterfaceStatus.NotInterfaced:
                    return await _authorizationService.AuthorizeAsync(_identityService.GetUser(), null, Policies.TagErrorAccountingInterfacePolicy);

                default:
                    return AuthorizationResult.Failed();
            }
        }

        public async Task<Unit> Handle(UpdateInterfaceStatusCommand request, CancellationToken cancellationToken)
        {
            foreach (var item in request.AccountingInterfaceError)
            {
                bool isResendRequest = true;
                int tAorJLTypeId = 0;
                if (item.TransactionDocumentTypeId == DocumentType.ManualTemporaryAdjustment)
                {
                    tAorJLTypeId = await _accountingInterfaceRepository.GetTATypeIdAsync(item.TransactionDocumentId, item.TransactionDocumentTypeId, request.Company);
                }
                BusinessObjectType businessObjectType = await GetBusinessObjectType(item.TransactionDocumentTypeId, tAorJLTypeId);
                var eventDto = new EventDto(item.AccountingId, item.DocumentReference, (int)businessObjectType, request.Company);
                var eventStatus = await _interfaceEventLogService.FindEventAsync(eventDto);
                if (eventStatus != null)
                {
                    var processInterfaceData = new ProcessInterfaceDataChangeLogsRequest
                    {
                        DocumentTypeId = item.TransactionDocumentTypeId,
                        CompanyId = request.Company,
                        BusinessApplicationType = BusinessApplicationType.AX,
                        TransactionDocumentId = item.TransactionDocumentId,
                        DocumentId = item.AccountingId,
                    };
                    if (Enum.TryParse(request.AccountingInterfaceStatus, out InterfaceStatus status))
                    {
                        AuthorizationResult res = await this.CheckPrivileges(status);

                        if (res.Succeeded)
                        {
                            switch (status)
                            {
                                case InterfaceStatus.NotInterfaced:
                                    _unitOfWork.BeginTransaction();
                                    try
                                    {
                                        await ProcessEventUpdate(eventStatus.EventId, InterfaceStatus.NotInterfaced, "Rejected from Error Management Screen", processInterfaceData.ESBMessage, ResultCode.Cancel.ToString(), null, processInterfaceData.CompanyId);
                                        await ProcessStatusUpdate(processInterfaceData, InterfaceStatus.NotInterfaced, "Rejected from Error Management Screen");
                                        _unitOfWork.Commit();
                                    }
                                    catch
                                    {
                                        _unitOfWork.Rollback();
                                        throw;
                                    }
                                    break;
                                case InterfaceStatus.TransmitError:
                                case InterfaceStatus.InterfaceReady:
                                    // Made changes to process the document directly instead of queueing into Process.Queue
                                    // Processing it instead of queueing since we received bug which states document status after resend is not updated immediately
                                    var companyDate = await _systemDateTimeService.GetCompanyDate(processInterfaceData.CompanyId);
                                    if (processInterfaceData.DocumentTypeId == DocumentType.ManualTemporaryAdjustment)
                                    {
                                        tAorJLTypeId = await _accountingInterfaceRepository.GetTATypeIdAsync(processInterfaceData.TransactionDocumentId, processInterfaceData.DocumentTypeId, processInterfaceData.CompanyId);
                                    }
                                    if (processInterfaceData.DocumentTypeId == DocumentType.RegularJournal)
                                    {
                                        tAorJLTypeId = await _accountingInterfaceRepository.GetJLTypeIdAsync(processInterfaceData.TransactionDocumentId, processInterfaceData.DocumentTypeId, processInterfaceData.CompanyId);
                                    }

                                    _unitOfWork.BeginTransaction();
                                    try
                                    {
                                        await ProcessEventUpdate(eventStatus.EventId, InterfaceStatus.InterfaceReady, "Resend from Error Management Screen", processInterfaceData.ESBMessage, null, null, processInterfaceData.CompanyId);
                                        await ProcessStatusUpdate(processInterfaceData, InterfaceStatus.InterfaceReady, "Resend from Error Management Screen");
                                        _unitOfWork.Commit();
                                    }
                                    catch
                                    {
                                        _unitOfWork.Rollback();
                                        throw;
                                    }

                                    _logger.LogInformation("Accounting Document with DocumentId {Atlas_DocumentId} having status {Atlas_Status} is sent to Accounting System at {Atlas_DateTime}", processInterfaceData.DocumentId, InterfaceStatus.ReadyToTransmit, companyDate);
                                    var accountingInterfaceXMLMessage = await _accountingInterfaceRepository.GetESBMessageAsync(processInterfaceData.DocumentId, processInterfaceData.CompanyId);
                                    // send the business object to Interface
                                    await SendBusinessObjectToInterface(processInterfaceData, accountingInterfaceXMLMessage, tAorJLTypeId, eventStatus.EventId, isResendRequest);
                                    break;
                            }
                        }
                        else
                        {
                            throw new AtlasSecurityException("One or more privileges are required to perform this action.");
                        }
                    }

                    _logger.LogInformation("Accounting Error with id {Atlas_DocumentReference} updated.", item.DocumentReference);
                }
            }

                return Unit.Value;
        }

        private async Task<EventSubType> GetEventSubType(DocumentType documentTypeId, int tAorJLTypeId)
        {
            if (documentTypeId == DocumentType.ManualTemporaryAdjustment)
            {
                if (tAorJLTypeId == (int)TAType.ManualTemporaryAdjustment || tAorJLTypeId == (int)TAType.MonthEndTemporaryAdjustment)
                {
                    return EventSubType.SendingAccrual;
                }

                if (tAorJLTypeId == (int)TAType.ManualMarkToMarket || tAorJLTypeId == (int)TAType.FxDealMonthTemporaryAdjustment)
                {
                    return EventSubType.SendingMTM;
                }
            }
            else
            {
                switch (documentTypeId)
                {
                    case DocumentType.PurchaseInvoice:
                    case DocumentType.SalesInvoice:
                    case DocumentType.CreditNote:
                    case DocumentType.DebitNote:
                        return EventSubType.SendingInvoice;
                    case DocumentType.CashPay:
                    case DocumentType.CashReceipt:
                    case DocumentType.MatchingCash:
                        return EventSubType.SendingCash;
                    case DocumentType.RegularJournal:
                        return EventSubType.SendingJournal;
                    case DocumentType.FxDealJournal:
                        return EventSubType.SendingDerivative;
                }
            }

            return 0;
        }

        private async Task ProcessEventUpdate(long eventId, InterfaceStatus status, string action, string message, string resultCode, string resultMessage, string companyId)
        {
            var eventHistoryData = new EventHistory(eventId, action, null, resultCode, resultMessage);
            await _interfaceEventLogService.CreateEventHistoryAsync(eventHistoryData, companyId);
            if (status == InterfaceStatus.Completed)
            {
                resultMessage = status.ToString();
            }

            var eventData = new Event(eventId, (long)status, resultMessage);
            await _interfaceEventLogService.UpdateEventStatusAsync(eventData, companyId);
        }

        private async Task<BusinessObjectType> GetBusinessObjectType(DocumentType transactionDocumentType, int tAorJLTypeId)
        {
            if (transactionDocumentType == DocumentType.ManualTemporaryAdjustment)
            {
                if (tAorJLTypeId == (int)TAType.ManualTemporaryAdjustment || tAorJLTypeId == (int)TAType.MonthEndTemporaryAdjustment)
                {
                    return BusinessObjectType.Accruals;
                }

                if (tAorJLTypeId == (int)TAType.ManualMarkToMarket || tAorJLTypeId == (int)TAType.FxDealMonthTemporaryAdjustment)
                {
                    return BusinessObjectType.MTM;
                }
            }
            else
            {
                switch (transactionDocumentType)
                {
                    case DocumentType.PurchaseInvoice:
                    case DocumentType.SalesInvoice:
                    case DocumentType.CreditNote:
                    case DocumentType.DebitNote:
                        return BusinessObjectType.CommercialInvoice;
                    case DocumentType.CashPay:
                    case DocumentType.CashReceipt:
                    case DocumentType.MatchingCash:
                        return BusinessObjectType.AccPayment;
                    case DocumentType.RegularJournal:
                        return BusinessObjectType.JournalEntry;
                    case DocumentType.FxDealJournal:
                        return BusinessObjectType.Derivative;
                }
            }

            return 0;
        }
    }
}
