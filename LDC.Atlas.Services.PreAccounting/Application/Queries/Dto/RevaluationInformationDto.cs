using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.PreAccounting.Application.Queries.Dto
{
    public class InformationForCreatingCashByPickingRevalDto
    {
        public long? CashByPickingTransactionDocumentId { get; set; }

        public string CashByPickingMatchFlagCode { get; set; }

        public long? DiffClientMatchFlagId { get; set; }

        public string DiffClientMatchFlagCode { get; set; }

        public string CashByPickingMatchingCurrencyCode { get; set; }

        public long? CashByPickingMatchFlagId { get; set; }

        public DateTime CashByPickingValueDate { get; set; }

        public DateTime CashByPickingDocumentDate { get; set; }
    }

    public class RevaluationInformationDto
    {
        /// <summary>
        /// ID of the counterparty associated to the revaluation to create.
        /// As a reminder, the reval is linked to a matchflag which itself, is linked to a counterparty
        /// </summary>
        public long CounterpartyId { get; set; }

        public string CounterpartyCode { get; set; }

        public long MatchFlagId { get; set; }

        public string CurrencyCode { get; set; }

        public string MatchingCurrency { get; set; }

        public DateTime PaymentDocumentDate { get; set; }

        public string CostTypeCode { get; set; }

        public string AccountNumber { get; set; }

        public string AlternativeAccount { get; set; }

        public int CostTypeId { get; set; }

        public string MatchedDocumentReference { get; set; }

        public IEnumerable<DocumentMatchingDto> ExistingDocumentMatchingInfo { get; set; }

        public IEnumerable<InputInfoLinesForRevaluation> DocumentMatchingForMatchedDocuments { get; set; }

        public string OtherDocumentReference { get; set; }

        public string CashByPickingReference { get; set; } // should be referenced only when the JL is created on cash by picking

        public long? DepartmentId { get; set; }

        public long? DifferentClientMatchFlagId { get; set; }
    }

    public class ManualDocumentMatchingDto
    {
        public int TransactionDocumentId { get; set; }

        public long OtherCounterpartyId { get; set; }

        public int AccountingLineType { get; set; }

        public DateTime InvoiceGLDate { get; set; }

        public string AccountReference { get; set; }

        public long? CounterpartyId { get; set; }

        public string ClientName { get; set; }

        public string DocumentReference { get; set; }

        public string SecDocumentReference { get; set; }

        public int DepartmentId { get; set; }

        public string DepartmentCode { get; set; }

        public string CurrencyCode { get; set; }

        public string MatchFlagId { get; set; }

        public string FunctionalCurrencyCode { get; set; }

        public string StatutoryCurrencyCode { get; set; }

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

        public decimal? StatutoryCcyAmount { get; set; }

        public decimal? FunctionalCcyAmount { get; set; }

        public string CurrencyRoeType { get; set; }

        public decimal Rate { get; set; }

        public int TransactionDirection { get; set; }

        public decimal DocumentAmount { get; set; }

        public DateTime PaymentDocumentDate { get; set; }

        public int TransactionDocumentTypeId { get; set; }

        public long RevaluationDocumentId { get; set; }

        public string MatchingCurrency { get; set; }

        public decimal MatchingAmount { get; set; }
    }

    public class InputInfoLinesForRevaluation
    {
        public int DepartmentId { get; set; }

        public decimal Amount { get; set; }

        public decimal? StatutoryCcyAmount { get; set; }

        public decimal? FunctionalCcyAmount { get; set; }

        public int TransactionDocumentTypeId { get; set; }

        public int AccountingLineTypeId { get; set; }

        public DocumentType DocumentType { get; set; }

        public string DocumentReference { get; set; }
    }

    public class RevaluationDto
    {
        public long? TransactionDocumentId { get; set; }

        public long RevaluationDocumentId { get; set; }

        public string MatchingCurrency { get; set; }

        public long OtherCounterpartyId { get; set; }

        public decimal MatchingAmount { get; set; }

        public long? CashTypeId { get; set; }

        public string AccountReference { get; set; }

        public int CounterpartyId { get; set; }

        public string ClientName { get; set; }

        public string DocumentReference { get; set; }

        public string SecDocumentReference { get; set; }

        public int DepartmentId { get; set; }

        public DateTime? PaymentDocumentDate { get; set; }

        public string DepartmentCode { get; set; }

        public string CurrencyCode { get; set; }

        public long MatchFlagId { get; set; }

        public int MarkingId { get; set; }

        public DateTime DocumentDate { get; set; }

        public DateTime GLDate { get; set; }

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

        public decimal? StatutoryCcyAmount { get; set; }

        public decimal? FunctionalCcyAmount { get; set; }

        public string CurrencyRoeType { get; set; }

        public decimal Rate { get; set; }

        public int TransactionDirection { get; set; }

        public decimal DocumentAmount { get; set; }

        public int TransactionDocumentTypeId { get; set; }
    }
}
