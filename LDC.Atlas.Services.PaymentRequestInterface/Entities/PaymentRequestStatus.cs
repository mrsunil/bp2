using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PaymentRequestInterface.Entities
{
    public class PaymentRequestStatus
    {
        public int DocumentStatus { get; set; }

        public string UUID { get; set; }

        public string CounterParty { get; set; }

        public string TransactionDocumentId { get; set; }
    }
}
