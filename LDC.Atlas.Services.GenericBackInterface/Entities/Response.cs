using LDC.Atlas.Application.Core.Entities;
using System;

namespace LDC.Atlas.Services.GenericBackInterface.Entities
{
    public class Response
    {
        public string ResponseStatus { get; set; }

        public string AckBusinessDocId { get; set; }

        public string ResponseMessage { get; set; }

        public BusinessApplicationType BusinessApplicationType { get; set; }

        public string DocumentReference { get; set; }

        public string CompanyId { get; set; }

        public string ESBMessage { get; set; }

        public string AcknowledgementId { get; set; }

        public string UserId { get; set; }

        public DateTime TimeStamp { get; set; }

        public DateTime ValueDate { get; set; }

        public string Counterparty { get; set; }

        public string JournalNumber { get; set; }

        public string UUID { get; set; }

        public string AckBusinessEntity { get; set; }

        public DateTime TransactionDate { get; set; }

        public BusinessObjectType BusinessObjectType { get; set; }
    }
}
