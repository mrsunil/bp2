using MediatR;
using System;

namespace LDC.Atlas.Execution.Common.Entities
{
    public class TransactionCreationResponse
    {
        public long TransactionDocumentId { get; set; }

        public string DocumentReference { get; set; }
    }

    public class TransactionDocument : IRequest<TransactionCreationResponse>
    {
        public string Company { get; set; }

        public int TransactionDocumentTypeId { get; set; }

        public long TransactionDocumentId { get; set; }

        public DateTime DocumentDate { get; set; }

        public string CurrencyCode { get; set; }

        public bool AuthorizedForPosting { get; set; }

        public long? PhysicalDocumentId { get; set; }

        public bool ToInterface { get; set; }
    }
}
