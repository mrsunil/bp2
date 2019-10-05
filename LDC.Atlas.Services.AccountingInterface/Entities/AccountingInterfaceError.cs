using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.AccountingInterface.Entities
{
    public class AccountingInterfaceError
    {
        public string DocumentReference { get; set; }

        public long TransactionDocumentId { get; set; }

        public long AccountingId { get; set; }

        public DocumentType TransactionDocumentTypeId { get; set; }
    }
}
