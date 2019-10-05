using LDC.Atlas.Services.PaymentRequestInterface.Entities;
using MediatR;
using System;

namespace LDC.Atlas.Services.PaymentRequestInterface.Application.Commands
{
    public class ProcessInterfaceDataChangeLogsRequest : IRequest
    {
        public string CashDocumentRef { get; set; }

        public string DocumentReference { get; set; }

        public long CashId { get; set; }

        public long TransactionDocumentId { get; set; }

        public string CompanyId { get; set; }

        public int BusinessApplicationType { get; set; }

        public string ESBMessage { get; set; }

        public string AcknowledgementId { get; set; }

        public DateTime? DocumentDate { get; set; }

        public string UUID { get; set; }
    }

    public class UpdateInterfaceStatusCommand : IRequest
    {
        public PaymentInterfaceError PaymentInterfaceError { get; set; }

        public string PaymentInterfaceStatus { get; set; }

        internal string Company { get; set; } // internal to avoid the exposure in Swagger
    }
}
