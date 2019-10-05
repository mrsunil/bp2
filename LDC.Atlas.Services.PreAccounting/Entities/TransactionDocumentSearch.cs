using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Entities
{
    public class TransactionDocumentSearch
    {
        public int DataVersionId { get; set; }

        public long AccountingId { get; set; }

        public string DocRef { get; set; }

        public string AccRef { get; set; }

        public string Currency { get; set; }

        public DateTime AccPeriod { get; set; }

        public decimal Amount { get; set; }

        public string ContractNumber { get; set; }

        public string Department { get; set; }

        public DateTime DocDate { get; set; }

        public string Status { get; set; }

        public string AssociatedAcc { get; set; }

        public DateTime AuthorizedOn { get; set; }

        public string AuthorizedAt { get; set; }

        public string AuthorizedBy { get; set; }
    }
}
