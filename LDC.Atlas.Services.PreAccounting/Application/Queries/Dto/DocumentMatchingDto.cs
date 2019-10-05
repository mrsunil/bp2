using System;

namespace LDC.Atlas.Services.PreAccounting.Application.Queries.Dto
{
    public class DocumentMatchingDto
    {
        public int TransactionDocumentId { get; set; }

        public string AccountReference { get; set; }

        public int CounterpartyId { get; set; }

        public string ClientName { get; set; }

        public string DocumentReference { get; set; }

        public string SecDocumentReference { get; set; }

        public int DepartmentId { get; set; }

        public string DepartmentCode { get; set; }

        public int TransactionDirection { get; set; }

        public decimal DocumentAmount { get; set; }

        public string CurrencyCode { get; set; }

        public string MatchFlagId { get; set; }

        public int MarkingId { get; set; }

        public DateTime DocumentDate { get; set; }

        public DateTime ValueDate { get; set; }

        public string CostType { get; set; }

        public long TransactionDocumentTypeId { get; set; }

        public string ExpenseCode { get; set; }

        public string Narrative { get; set; }

        public string DocumentType { get; set; }

        public decimal Credit { get; set; }

        public decimal Debit { get; set; }

        public bool IsMatched { get; set; }

        public decimal Balance { get; set; }

        public decimal Amount { get; set; }

        public decimal TotalCredit { get; set; }

        public decimal TotalDebit { get; set; }

        public bool IsChecked { get; set; }

        public decimal StatutoryCcyAmount { get; set; }

        public decimal FunctionalCcyAmount { get; set; }

        public string CurrencyRoeType { get; set; }

        public decimal Rate { get; set; }

        public string CostTypeCode { get; set; }

        public string AccountNumber { get; set; }

        public string AlternativeAccount { get; set; }

        /// <summary>
        /// Gets or sets iD of the line of the journal entry in Preaccounting.ManualJournalLine this accounting line
        /// is linked to.
        /// This field is exclusive with SourceInvoiceId and SourceCashLineId
        /// </summary>
        public long? SourceJournalLineId { get; set; }

        /// <summary>
        /// Gets or sets iD of the invoice record this accounting line is referring
        /// Only relevant for "C" / "V" lines
        /// This field is exclusive with SourceJournalLineId and SourceCashLineId
        /// </summary>
        public long? SourceInvoiceId { get; set; }

        /// <summary>
        /// Gets or sets iD of the cash record line this accounting line is linked with.
        /// Only relevant for "C" / "V" lines
        /// This field is exclusive with SourceJournalLineId and SourceInvoiceId
        /// </summary>
        public long? SourceCashLineId { get; set; }

        /// <summary>
        /// Gets or sets iD of the line of the journal entry in Preaccounting.ManualJournalLine this accounting line
        /// is linked to.
        /// This field is exclusive with MatchedInvoiceId and MatchedCashLineId
        /// </summary>
        public long? MatchedJournalLineId { get; set; }

        /// <summary>
        /// Gets or sets iD of the invoice record this accounting line is referring
        /// Only relevant for "C" / "V" lines
        /// This field is exclusive with MatchedJournalLineId and MatchedCashLineId
        /// </summary>
        public long? MatchedInvoiceId { get; set; }

        /// <summary>
        /// Gets or sets iD of the cash record line this accounting line is linked with.
        /// Only relevant for "C" / "V" lines
        /// This field is exclusive with MatchedJournalLineId and MatchedInvoiceId
        /// </summary>
        public long? MatchedCashLineId { get; set; }
    }
}
