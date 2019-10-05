using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Entities
{
    public class RevaluationInformation
    {
        public long RevaluationId { get; internal set; }
        public long TransactionDocumentId { get; internal set; }
        public string DocumentReference { get; internal set; }
        public int CurrentDocumentReferenceNumber { get; internal set; }
    }
}
