using System;

namespace LDC.Atlas.Services.Execution.Application.Queries.Dto
{
    /// <summary>
    /// This class has been created to store the information for the documents to unmatch,
    /// to make the Datetime properties nullable. Doing so directly in the class  DocumentMatchingDto
    /// would have resulted in impacts which could hardly be managed
    /// </summary>
    public class MatchedDocumentInfo_ForUnmatchDto
    {
        public string DocumentReference { get; set; }

        public string SecondaryRef { get; set; }

        public int DepartmentId { get; set; }

        public string MatchFlagCode { get; set; }

        public DateTime? DocumentDate { get; set; }

        public DateTime? ValueDate { get; set; }

        public string CostType { get; set; }

        public string Narrative { get; set; }

        public decimal Amount { get; set; }

        public int CounterpartyId { get; set; }

        public string CurrencyCode { get; set; }

        public string DocumentType { get; set; }

        public int TransactionDocumentId { get; set; }

        public short TransactionDocumentTypeId { get; set; }

        public int MatchFlagId { get; set; }

        public DateTime? PaymentDocumentDate { get; set; }

        public int TransactionDirectionId { get; set; }
    }

    public class DocumentMatchingDto
    {
        public string DocumentReference { get; set; }

        public int TransactionDocumentId { get; set; }

        public short TransactionDocumentTypeId { get; set; }

        public string AccountReference { get; set; }

        public int CounterpartyId { get; set; }

        public string ClientName { get; set; }

        public string SecondaryRef { get; set; }

        public int DepartmentId { get; set; }

        public string DepartmentCode { get; set; }

        public string CurrencyCode { get; set; }

        public int MatchFlagId { get; set; }

        public int MarkingId { get; set; }

        public DateTime DocumentDate { get; set; }

        public DateTime ValueDate { get; set; }

        public string CostType { get; set; }

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

        public string MatchFlagCode { get; set; }

        public string IsCreditOrDebit { get; set; }

        public long RevalTransactionDocumentId { get; set; }

        public long LineId { get; set; }

        public long SourceInvoiceId { get; set; }

        public long SourceCashLineId { get; set; }

        public long SourceJournalLineId { get; set; }

        public string Marking { get; set; }

        public string OriginalRevaluationReference { get; set; }

        public DateTime PaymentDocumentDate { get; set; }

        public int TransactionDirectionId { get; set; }
    }
}
