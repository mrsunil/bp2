using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Execution.Entities
{
    public class ManualDocumentUnmatchingRecord
    {
        public string JournalId { get; set; }

        public string DocumentReference { get; set; }
    }

    public class ManualDocumentMatchingRecord
    {
        internal string Company { get; set; }

        public string JournalId { get; set; }

        public long? MatchFlagId { get; set; }

        public int CounterpartyId { get; set; }

        public string MatchFlagCode { get; set; }

        public string CounterpartyCode { get; set; }

        public string CurrencyCode { get; set; }

        public DateTime PaymentDocumentDate { get; set; }

        public string FunctionalCurrency { get; set; }

        public string StatutoryCurrency { get; set; }

        public long? TransactionDocumentId { get; set; }

        public string ReversalRevalJournalCode { get; set; }

        public ICollection<DocumentMatching> DocumentMatchings { get; set; }

        public IEnumerable<ManualDocumentMatching> ManualDocumentMatchings { get; set; }
    }

    public enum RoeType
    {
        M,
        D,
    }

    public enum TransactionDirection
    {
        Pay = 1,
        Recieve = 2,
    }

    public class ManualDocumentMatching
    {
        public long? JournalId { get; set; }

        public long TransactionDocumentId { get; set; }

        public short TransactionDocumentTypeId { get; set; }

        public string AccountReference { get; set; }

        public long CounterpartyId { get; set; }

        public string ClientName { get; set; }

        public string DocumentReference { get; set; }

        public string SecDocumentReference { get; set; }

        public int DepartmentId { get; set; }

        public string DepartmentCode { get; set; }

        public string CurrencyCode { get; set; }

        public long? MatchFlagId { get; set; }

        public long MarkingId { get; set; }

        public DateTime DocumentDate { get; set; }

        public DateTime? ValueDate { get; set; }

        public string CostType { get; set; }

        public string ExpenseCode { get; set; }

        public string Narrative { get; set; }

        public string DocumentType { get; set; }

        public decimal Credit { get; set; }

        public decimal Debit { get; set; }

        public bool IsMatched { get; set; }

        public decimal Balance { get; set; }

        public decimal Amount { get; set; }

        public decimal TotalAmount { get; set; }

        public decimal TotalCredit { get; set; }

        public decimal TotalDebit { get; set; }

        public bool IsChecked { get; set; }

        public decimal? StatutoryCcyAmount { get; set; }

        public decimal? FunctionalCcyAmount { get; set; }

        public string CurrencyRoeType { get; set; }

        public decimal? Rate { get; set; }

        public string IsCreditOrDebit { get; set; }

        public long MatchingStatusId { get; set; }

        public bool IsPrematch { get; set; }

        public DateTime? PaymentDocumentDate { get; set; }

        public decimal DocumentAmount { get; set; }
    }
}
