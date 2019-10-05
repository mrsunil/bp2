using System;

namespace LDC.Atlas.Services.PreAccounting.Entities
{
    public class Revaluation
    {
        public long RevaluationId { get; set; }

        public long TransactionDocumentId { get; set; }

        public DateTime? PaymentDocumentDate { get; set; }

        public long MatchFlagId { get; set; }

        public int JLTypeId { get; set; }

        public long? DifferentClientMatchFlagId { get; set; }

        public DateTime? GLDate { get; set; }

        public string CurrencyCode { get; set; }

        public string CompanyId { get; set; }
    }
}
