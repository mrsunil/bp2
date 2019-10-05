using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Lock.Application.Queries.Dto
{
    public class AccountingDocumentInformation
    {
        public long AccountingId { get; set; }

        public long? TransactionDocumentId { get; set; }

        public string DocumentReference { get; set; }

        public long? InvoiceId { get; set; }
    }
}
