using LDC.Atlas.Application.Core.Entities;
using LDC.Atlas.Services.AccountingInterface.Entities;
using MediatR;
using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.AccountingInterface.Application.Commands
{
    public class ProcessInterfaceDataChangeLogsRequest : IRequest
    {
        public long DocumentId { get; set; }

        public DocumentType DocumentTypeId { get; set; }

        public long TransactionDocumentId { get; set; }

        public string CompanyId { get; set; }

        public BusinessApplicationType BusinessApplicationType { get; set; }

        public string DocumentReference { get; set; }

        public string ESBMessage { get; set; }

        public string AcknowledgementId { get; set; }

        public DateTime? DocumentDate { get; set; }

        public string UUID { get; set; }

        public string JournalNumber { get; set; }

        public DateTime? TimeStamp { get; set; }

        public DateTime? TransactionDate { get; set; }
    }

    public class UpdateInterfaceStatusCommand : IRequest
    {
        public IEnumerable<AccountingInterfaceError> AccountingInterfaceError { get; set; }

        public string AccountingInterfaceStatus { get; set; }

        internal string Company { get; set; } // internal to avoid the exposure in Swagger
    }
}
