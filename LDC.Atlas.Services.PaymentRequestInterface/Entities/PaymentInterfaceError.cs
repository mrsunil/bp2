using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PaymentRequestInterface.Entities
{
    public class PaymentInterfaceError
    {
        public string DocumentReference { get; set; }

        public long TransactionDocumentId { get; set; }

        public long CashId { get; set; }

    }
}
