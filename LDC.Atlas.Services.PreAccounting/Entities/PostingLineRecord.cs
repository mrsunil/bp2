using System;

namespace LDC.Atlas.Services.PreAccounting.Entities
{
    public class PostingLineRecord
    {
        public string CounterpartyCode { get; set; }

        public decimal? NominalAccount { get; set; }

        public string CurrencyCode { get; set; }

        public decimal? Credit { get; set; }

        public decimal? Debit { get; set; }

        public long TransactionID { get; set; }

        public string MatchFlag { get; set; }

        public long? InvoiceLinesID { get; set; }

        public DateTime? AcknowledgementDate { get; set; }

        public string Status { get; set; }
    }
}
