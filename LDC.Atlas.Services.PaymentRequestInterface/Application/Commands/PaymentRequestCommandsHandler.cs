using LDC.Atlas.Application.Core.Entities;
using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.Audit.Common;
using LDC.Atlas.Audit.Common.Entities;
using LDC.Atlas.Audit.Common.Queries.Dto;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.PaymentRequestInterface.Entities;
using LDC.Atlas.Services.PaymentRequestInterface.Repositories;
using LDC.Atlas.Services.PaymentRequestInterface.Services;
using MediatR;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;
using System.Xml;

namespace LDC.Atlas.Services.PaymentRequestInterface.Application.Commands
{
    public class PaymentRequestCommandsHandler :
        IRequestHandler<ProcessInterfaceDataChangeLogsRequest>,
        IRequestHandler<ProcessESBResponse, ProcessESBResult>,
        IRequestHandler<UpdateInterfaceStatusCommand>
    {
        private readonly ILogger<PaymentRequestCommandsHandler> _logger;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPaymentRequestRepository _paymentRequestRepository;
        private readonly IPaymentRequestService _paymentRequestService;
        private readonly ISystemDateTimeService _systemDateTimeService;
        private readonly IProcessMessageService _processMessageService;
        private ProcessESBResult processESBResult = new ProcessESBResult();
        private readonly IInterfaceEventLogService _interfaceEventLogService;

        public PaymentRequestCommandsHandler(
            ILogger<PaymentRequestCommandsHandler> logger,
            IUnitOfWork unitOfWork,
            IPaymentRequestRepository paymentRequestRepository,
            IPaymentRequestService paymentRequestService,
            IProcessMessageService processMessageService,
            ISystemDateTimeService systemDateTimeService,
            IInterfaceEventLogService interfaceEventLogService)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _paymentRequestRepository = paymentRequestRepository ?? throw new ArgumentNullException(nameof(paymentRequestRepository));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _paymentRequestService = paymentRequestService ?? throw new ArgumentNullException(nameof(paymentRequestService));
            _processMessageService = processMessageService ?? throw new ArgumentNullException(nameof(processMessageService));
            _systemDateTimeService = systemDateTimeService ?? throw new ArgumentNullException(nameof(systemDateTimeService));
            _interfaceEventLogService = interfaceEventLogService ?? throw new ArgumentNullException(nameof(interfaceEventLogService));
        }

        public async Task<Unit> Handle(ProcessInterfaceDataChangeLogsRequest request, CancellationToken cancellationToken)
        {

            var paymentRequestStatus = await _paymentRequestRepository.GetPaymentRequestStatus((int)BusinessApplicationType.TRAX, request.CompanyId, null, request.TransactionDocumentId);
            if (paymentRequestStatus == null || ((InterfaceStatus)paymentRequestStatus.DocumentStatus == InterfaceStatus.None || (InterfaceStatus)paymentRequestStatus.DocumentStatus == InterfaceStatus.TransmitError))
            {
                long eventId;
                _unitOfWork.BeginTransaction();
                var eventdata = new Event((int)EventSubType.PaymentRequest, request.CashId, request.CashDocumentRef, (int)InterfaceStatus.ReadyToTransmit, request.CompanyId, null);
                try
                {
                   eventId = await _interfaceEventLogService.CreateEventAsync(eventdata);
                    // Insert record into InterfaceStatus
                    await ProcessStatusUpdate(request, InterfaceStatus.ReadyToTransmit, "Ready To Transmit");

                    _unitOfWork.Commit();
                }
                catch
                {
                    _unitOfWork.Rollback();
                    throw;
                }

                var companyDate = await _systemDateTimeService.GetCompanyDate(request.CompanyId);

                _logger.LogInformation("Cash with DocumentId {Atlas_PaymentRequestCashDocumentId} having status {Atlas_PaymentRequestStatus} is sent to Treasury System at {Atlas_DateTime}", request.CashDocumentRef, InterfaceStatus.ReadyToTransmit, companyDate);

                var paymentRequestMessage = await _paymentRequestRepository.GetTRAXMessageAsync(request.CashId, request.CompanyId);
                var eventHistory = new EventHistory(eventId, "Message Generated", paymentRequestMessage, null, null);
                _unitOfWork.BeginTransaction();
                try
                {
                    await _interfaceEventLogService.CreateEventHistoryAsync(eventHistory,request.CompanyId);
                    _unitOfWork.Commit();
                }
                catch
                {
                    _unitOfWork.Rollback();
                    throw;
                }

                var legalEntityCode = await _paymentRequestRepository.GetLegalEntityCodeAsync(request.CompanyId, request.BusinessApplicationType);

                await SendBusinessObjectToInterface(request, paymentRequestMessage, legalEntityCode, eventId);
            }
            else
            {
                _logger.LogWarning("Invalid Document ({Atlas_DocumentReference}) status {Atlas_InterfaceStatus}.", request.DocumentReference, ((InterfaceStatus)paymentRequestStatus.DocumentStatus).ToString());
            }

            return Unit.Value;
        }

        private async Task SendBusinessObjectToInterface(ProcessInterfaceDataChangeLogsRequest request, string paymentRequestMessage, string legalEntityCode, long eventId)
        {
            bool messageCheck = true;
            if (!string.IsNullOrWhiteSpace(paymentRequestMessage))
            {
                messageCheck = false;
                // Call ESB service and send the message to Trax system
                await ProcessTraxRequest(request, paymentRequestMessage, legalEntityCode, eventId);
            }
            else
            {
                var eventHistory = new EventHistory(eventId, "Error- Message generated", paymentRequestMessage, null, null);
                var updateEventStatus = new Event(eventId, (long)InterfaceStatus.TransmitError, "CSV Format is invalid.");
                _unitOfWork.BeginTransaction();
                try
                {
                    await _interfaceEventLogService.UpdateEventStatusAsync(updateEventStatus, request.CompanyId);
                    await _interfaceEventLogService.CreateEventHistoryAsync(eventHistory, request.CompanyId);
                    await ProcessStatusUpdate(request, InterfaceStatus.TransmitError, "CSV Format is invalid.");
                    _unitOfWork.Commit();
                }
                catch
                {
                    _unitOfWork.Rollback();
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

        private async Task ProcessTraxRequest(ProcessInterfaceDataChangeLogsRequest request, string paymentRequestMessage, string legalEntityCode, long eventId)
        {
            try
            {
                // Esb call inside its own try/catch
                request.UUID = await _paymentRequestService.CallESBClient(request, paymentRequestMessage, legalEntityCode);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);

                    var updateEventStatus = new Event(eventId, (long)InterfaceStatus.TransmitError, e.Message);
                    var eventHistory = new EventHistory(eventId, "Sending the message to ESB", null, ResultCode.Error.ToString(), e.Message);
                    await _interfaceEventLogService.UpdateEventStatusAsync(updateEventStatus, request.CompanyId);
                    await _interfaceEventLogService.CreateEventHistoryAsync(eventHistory, request.CompanyId);
                    await ProcessStatusUpdate(request, InterfaceStatus.TransmitError, e.Message);

                throw;
            }

            _unitOfWork.BeginTransaction();
            try
            {
                var updateEventStatus = new Event(eventId, (long)InterfaceStatus.StandBy, request.UUID);
                var eventHistory = new EventHistory(eventId, "Sending the message to ESB", null, ResultCode.Ok.ToString(), request.UUID);
                await _interfaceEventLogService.UpdateEventStatusAsync(updateEventStatus, request.CompanyId);
                await _interfaceEventLogService.CreateEventHistoryAsync(eventHistory, request.CompanyId);
                await ProcessStatusUpdate(request, InterfaceStatus.StandBy, paymentRequestMessage);

                _unitOfWork.Commit();
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        private async Task ProcessStatusUpdate(ProcessInterfaceDataChangeLogsRequest request, InterfaceStatus status, string message)
        {
            await _paymentRequestRepository.InsertOrUpdateInterfaceStatusAsync(request, status);

            await _paymentRequestRepository.InsertInterfaceLogsAsync(request, status, message);
        }

        private async Task<ProcessESBResult> ValidateEsbResponse(ProcessESBResponse esbResponse, PaymentRequestStatus paymentRequestStatus)
        {
            if (paymentRequestStatus != null)
            {
                var interfaceStatus = (InterfaceStatus)paymentRequestStatus.DocumentStatus;
                if (!(interfaceStatus == InterfaceStatus.StandBy || interfaceStatus == InterfaceStatus.ReadyToTransmit || interfaceStatus == InterfaceStatus.Interfaced))
                {
                    string message = "The payment request " + esbResponse.DocumentReference + " is not in status 'ready to transmit' or 'stand by' or 'interfaced' (current status: " + interfaceStatus + " )";
                    processESBResult.Error = message;
                    processESBResult.IsSuccess = false;
                }
                else if (paymentRequestStatus.CounterParty != esbResponse.Counterparty)
                {
                    string message = "The Counterparty should be the same code as in the original payment order.";
                    processESBResult.Error = message;
                    processESBResult.IsSuccess = false;
                }
                else
                {
                    processESBResult.IsSuccess = true;
                    if (!string.IsNullOrEmpty(paymentRequestStatus.UUID))
                    {
                        processESBResult.UUID = paymentRequestStatus.UUID;
                    }
                }
            }
            else
            {
                string message = "Invalid Cash Document Reference";
                processESBResult.Error = message;
                processESBResult.IsSuccess = false;
            }

            return processESBResult;
        }

        public async Task<ProcessESBResult> Handle(ProcessESBResponse esbRequest, CancellationToken cancellationToken)
        {
            var eventHistoryData = new EventHistory();
            var eventData = new Event();
            CultureInfo cultureInfo = Thread.CurrentThread.CurrentCulture;
            TextInfo textInfo = cultureInfo.TextInfo;
            var companyDate = await _systemDateTimeService.GetCompanyDate(esbRequest.CompanyId);
            long sourceId = await _interfaceEventLogService.GetAccountingIdandCashIdbyDocumentReference(esbRequest.CompanyId, esbRequest.DocumentReference, (int)BusinessApplicationType.TRAX, (int)esbRequest.BusinessObjectType);
            var eventDto = new EventDto(sourceId, esbRequest.DocumentReference, (int)esbRequest.BusinessObjectType, esbRequest.CompanyId);
            var eventStatus = await _interfaceEventLogService.FindEventAsync(eventDto);
            eventHistoryData = new EventHistory(eventStatus.EventId, "Callback message received from ESB", esbRequest.ESBMessage, null, null);
            await _interfaceEventLogService.CreateEventHistoryAsync(eventHistoryData, esbRequest.CompanyId);
            var paymentRequestStatus = await _paymentRequestRepository.GetPaymentRequestStatus((int)BusinessApplicationType.TRAX, esbRequest.CompanyId, esbRequest.DocumentReference);
            _unitOfWork.BeginTransaction();

            try
            {
                var responseToESB = await ValidateEsbResponse(esbRequest, paymentRequestStatus);
                if (responseToESB.IsSuccess)
                {
                    var processInterfaceData = new ProcessInterfaceDataChangeLogsRequest();
                    processInterfaceData.CashDocumentRef = esbRequest.DocumentReference;
                    processInterfaceData.CompanyId = esbRequest.CompanyId;
                    processInterfaceData.BusinessApplicationType = Convert.ToInt32(BusinessApplicationType.TRAX, CultureInfo.InvariantCulture);
                    processInterfaceData.ESBMessage = esbRequest.ESBMessage;
                    processInterfaceData.AcknowledgementId = esbRequest.AckBusinessDocId;
                    processInterfaceData.DocumentDate = esbRequest.ValueDate;

                    InterfaceStatus status;
                    if (Enum.TryParse(textInfo.ToTitleCase(esbRequest.ResponseStatus.ToLower(CultureInfo.InvariantCulture)), out status))
                    {
                        switch (status)
                        {
                            case InterfaceStatus.Signed:
                                await ProcessEventUpdate(eventStatus.EventId, InterfaceStatus.Signed, "ESB callback Message integration", esbRequest.ESBMessage, ResultCode.Ok.ToString(), null, esbRequest.CompanyId);
                                await ProcessStatusUpdate(processInterfaceData, InterfaceStatus.Signed, esbRequest.ESBMessage);
                                await EnqueueMessage(paymentRequestStatus.TransactionDocumentId.ToString(CultureInfo.InvariantCulture), esbRequest.CompanyId);
                                break;
                            case InterfaceStatus.Error:
                                await ProcessEventUpdate(eventStatus.EventId, InterfaceStatus.Error, "ESB callback Message integration", esbRequest.ESBMessage, ResultCode.Error.ToString(), esbRequest.ResponseMessage, esbRequest.CompanyId);
                                await ProcessStatusUpdate(processInterfaceData, InterfaceStatus.Error, esbRequest.ResponseMessage);
                                break;
                            case InterfaceStatus.Included:
                                await ProcessEventUpdate(eventStatus.EventId, InterfaceStatus.Included, "ESB callback Message integration", esbRequest.ESBMessage, ResultCode.Ok.ToString(), null, esbRequest.CompanyId);
                                await ProcessStatusUpdate(processInterfaceData, InterfaceStatus.Interfaced, esbRequest.ResponseMessage);
                                break;
                            case InterfaceStatus.Rejected:
                                await ProcessEventUpdate(eventStatus.EventId, InterfaceStatus.Rejected, "ESB callback Message integration", esbRequest.ESBMessage, ResultCode.Error.ToString(), esbRequest.ResponseMessage, esbRequest.CompanyId);
                                await ProcessStatusUpdate(processInterfaceData, InterfaceStatus.Rejected, esbRequest.ResponseMessage);
                                break;
                        }
                    }
                }

                _unitOfWork.Commit();
                _logger.LogInformation("Cash with DocumentId {Atlas_PaymentRequestCashDocumentId} recieved status {Atlas_PaymentRequestStatus} from Treasury System at {Atlas_DateTime}", esbRequest.DocumentReference, esbRequest.ResponseStatus, companyDate);
                return responseToESB;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        private async Task EnqueueMessage(string contextInfo, string company)
        {
            ProcessMessage message = new ProcessMessage​
            {
                ProcessTypeId = (int)ProcessType.AtlasAccountingDocumentProcessor,
                CompanyId = company,
                Content = new JObject(new JProperty("docId", contextInfo)).ToString(),
            };

            await _processMessageService.SendMessage(message);
        }

        private async Task ProcessEventUpdate(long eventId, InterfaceStatus status, string action, string message, string resultCode, string resultMessage, string companyId)
        {
            var eventHistoryData = new EventHistory(eventId, action, null, resultCode, resultMessage);
            await _interfaceEventLogService.CreateEventHistoryAsync(eventHistoryData, companyId);
            if (status == InterfaceStatus.Signed || status == InterfaceStatus.Included)
            {
                resultMessage = status.ToString();
            }

            var eventData = new Event(eventId, (long)status, resultMessage);
            await _interfaceEventLogService.UpdateEventStatusAsync(eventData, companyId);
        }

        public async Task<Unit> Handle(UpdateInterfaceStatusCommand request, CancellationToken cancellationToken)
        {
            bool isResendRequest = true;
            var eventDto = new EventDto(request.PaymentInterfaceError.CashId, request.PaymentInterfaceError.DocumentReference, (int)BusinessObjectType.PaymentOrder, request.Company);
            var eventStatus = await _interfaceEventLogService.FindEventAsync(eventDto);
            if (eventStatus != null)
            {
                var processInterfaceData = new ProcessInterfaceDataChangeLogsRequest
                {
                    CompanyId = request.Company,
                    TransactionDocumentId = request.PaymentInterfaceError.TransactionDocumentId,
                    CashId = request.PaymentInterfaceError.CashId,
                    DocumentReference = request.PaymentInterfaceError.DocumentReference,
                    BusinessApplicationType = (int)BusinessApplicationType.TRAX,
                };
                if (Enum.TryParse(request.PaymentInterfaceStatus, out InterfaceStatus status))
                {
                    if (status == InterfaceStatus.ReadyToTransmit)
                    {
                        // Made changes to process the document directly instead of queueing into Process.Queue
                        // Processing it instead of queueing since we received bug which states document status after resend is not updated immediately

                        var companyDate = await _systemDateTimeService.GetCompanyDate(processInterfaceData.CompanyId);
                        _unitOfWork.BeginTransaction();
                        try
                        {
                            await ProcessEventUpdate(eventStatus.EventId, InterfaceStatus.ReadyToTransmit, "Resend from Interface Monitoring Screen", processInterfaceData.ESBMessage, null, null, processInterfaceData.CompanyId);
                            await ProcessStatusUpdate(processInterfaceData, InterfaceStatus.ReadyToTransmit, "Resend from Interface Monitoring Screen");
                            _unitOfWork.Commit();
                        }
                        catch
                        {
                            _unitOfWork.Rollback();
                            throw;
                        }

                        _logger.LogInformation("Cash with DocumentId {Atlas_PaymentRequestCashDocumentId} having status {Atlas_PaymentRequestStatus} is sent to Treasury System at {Atlas_DateTime}", processInterfaceData.CashDocumentRef, InterfaceStatus.ReadyToTransmit, companyDate);

                        var paymentRequestMessage = await _paymentRequestRepository.GetTRAXMessageAsync(processInterfaceData.CashId, processInterfaceData.CompanyId);
                        var eventHistory = new EventHistory(eventStatus.EventId, "Message Generated", paymentRequestMessage, null, null);
                        _unitOfWork.BeginTransaction();
                        try
                        {
                            await _interfaceEventLogService.CreateEventHistoryAsync(eventHistory, processInterfaceData.CompanyId);
                            _unitOfWork.Commit();
                        }
                        catch
                        {
                            _unitOfWork.Rollback();
                            throw;
                        }

                        var legalEntityCode = await _paymentRequestRepository.GetLegalEntityCodeAsync(processInterfaceData.CompanyId, processInterfaceData.BusinessApplicationType);
                        // send the business object to Interface
                        await SendBusinessObjectToInterface(processInterfaceData, paymentRequestMessage, legalEntityCode, eventStatus.EventId);
                    }
                }

                _logger.LogInformation("Accounting Error with id {Atlas_DocumentReference} updated.", processInterfaceData.DocumentReference);

            }

            return Unit.Value;
        }
    }
}
