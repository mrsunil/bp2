using System.Collections.Generic;

namespace LDC.Atlas.Services.Execution.Entities
{
    public class CashReferences
    {
        public IEnumerable<CashShortInformationForDeletion> CashTransactionDocumentIds { get; set; }

        public IEnumerable<long> ManualJournalTransactionDocumentIds { get; set; }

        public IEnumerable<long> MatchFlagIds { get; set; }
    }

    public class CashShortInformationForDeletion
    {
        public string DocumentReference { get; set; }

        public long TransactionDocumentId { get; set; }
    }
}
