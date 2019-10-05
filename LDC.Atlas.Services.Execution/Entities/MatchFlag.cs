using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Entities
{
    public class MatchFlag
    {
        public long? CashIdOfCashByPicking { get; set; }

        public long? CounterPartyId { get; set; }

        public string CompanyId { get; set; }

        public string MatchingCurrency { get; set; }

        public string CounterPartyCode { get; set; }

        public string CurrencyCode { get; set; }

        public int? MatchingStatusId { get; set; }

        public ICollection<DocumentMatching> DocumentMatchings { get; set; }

        public long? MatchFlagId { get; set; }

        public bool IsPrematch { get; set; }

        public DateTime? PaymentDocumentDate { get; set; }
    }
}
