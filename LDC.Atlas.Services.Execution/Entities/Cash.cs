using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Execution.Entities
{
    public class Cash
    {
        public long CashId { get; set; }

        public long TransactionDocumentId { get; set; }

        public int DataVersionId { get; set; }

        /// <summary>
        /// This does not contain the cash type, at the time this is used for creating a
        /// cash, but contains instead a direction
        /// </summary>
        public int? CashTypeId { get; set; }

        public long? NominalBankAccountCode { get; set; }

        public string BankAccountCode { get; set; }

        public string OwnerName { get; set; }

        public string CounterpartyDocumentReference { get; set; }

        public long? CounterPartyId { get; set; }

        public DateTime? ValueDate { get; set; }

        public decimal? Amount { get; set; }

        public long? CharterId { get; set; }

        public long? NominalAccountId { get; set; }

        public long? DepartmentId { get; set; }

        public long DocumentId { get; set; }

        public long? CostTypeId { get; set; }

        public string Narrative { get; set; }

        public bool ToTransmitToTreasury { get; set; }

        public string CompanyId { get; set; }

        public bool? UrgentPayment { get; set; }

        public long? MatchingCashId { get; set; }

        public string MatchingCurrency { get; set; }

        public decimal? MatchingAmount { get; set; }

        public decimal? MatchingRate { get; set; }

        public string MatchingRateType { get; set; }

        public CashDocumentType CashDocumentType { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public string CounterPartyCode { get; set; }

        public string NominalAccountCode { get; set; }

        public ICollection<CashAdditionalCost> AdditionalCostDetails { get; set; }

        public string CostTypeCode { get; set; }

        public long? CostDirectionId { get; set; }

        /* TransactionDocument properties */

        public string DocumentReference { get; set; }

        public int? TraxStatus{ get; set; }

        public int Year { get; set; }

        public long YearNumber { get; set; }

        public long TransactionDocumentTypeId { get; set; }

        public DateTime DocumentDate { get; set; }

        public string CurrencyCode { get; set; }

        public bool AuthorizedForPosting { get; set; }

        public long? PhysicalDocumentId { get; set; }

        public int? MatchingStatusId { get; set; }

        public DateTime AuthorizedDate { get; set; }

        /* End TransactionDocument properties */

        public long ChildCashTypeId { get; set; }

        public ICollection<DocumentMatching> DocumentMatchings { get; set; }

        public long? MatchFlagId { get; set; }

        public bool IsPrematch { get; set; }

        public string MatchedDocumentReference { get; set; }

        public int MatchedYeanNumber { get; set; }

        public long? MatchedTransactionDocumentId { get; set; }

        public string PaymentCounterpartyCode { get; set; }

        public long? MatchFlagIdInvoiceInserted { get; set; }

        public long? MatchFlagIdCashInserted { get; set; }

        public long? JLTransactionDocumentId { get; set; }

        public string FunctionalCurrencyCode { get; set; }

        public string StatutoryCurrencyCode { get; set; }

        public decimal? FunctionalToStatutoryCurrenyRate { get; set; }

        public string FunctionalToStatutoryCurrencyRoeType { get; set; }

        public string CashCurrencyCode { get; set; }

        public string CashCurrencyRoeType { get; set; }

        public decimal? CashCurrencyRate { get; set; }

        public long? MatchingCounterpartyId { get; set; }

        public long? PaymentCounterpartyId { get; set; }

        public long? CounterPartyTransferId { get; set; }

        public string C2CCode { get; set; }

        public bool NominalAlternativeAccount { get; set; }

        public bool CostAlternativeCode { get; set; }

        public string DepartmentAlternativeCode { get; set; }

        public string TaxInterfaceCode { get; set; }

        public long? PaymentCashId { get; set; }

        public ICollection<CashLine> CashLines { get; set; }

        public Cash Clone()
        {
            return (Cash)this.MemberwiseClone();
        }
    }

    public class CashDocumentReference
    {
        public string Label { get; set; }

        public int TransactionTypeYearCounter { get; set; }

        public long TransactionDocumentTypeId { get; set; }

        public int YearNumber { get; set; }
    }

    public class CashMatching
    {
        public string DocumentReference { get; set; }

        public decimal Amount { get; set; }
    }

    public class DocumentMatching
    {
        public override string ToString()
        {
            return "DocMatch for " + MatchedAmount + " on "
                + (SourceCashLineId != null ? " cashline " + SourceCashLineId : "")
                + (SourceJournalLineId != null ? " journalline " + SourceJournalLineId : "")
                + (SourceInvoiceId != null ? " invoice " + SourceInvoiceId : "");
        }

        public long DocumentMatchingId { get; set; }

        public string AssociatedAccountCode { get; set; }

        public long? LineId { get; set; }

        public long? PaymentTermId { get; set; }

        public long? CounterPartyId { get; set; }

        public string PhysicalContractCode { get; set; }

        public string ContractSectionCode { get; set; }

        public decimal CompanyCurrency { get; set; }

        public long PostingLineId { get; set; }

        public decimal RepartingCurrency { get; set; }

        public decimal Quantity { get; set; }

        public decimal VATTurnover { get; set; }

        public string AccountReference { get; set; }

        public long? CommodityId { get; set; }

        public string VATCode { get; set; }

        public string ClientReference { get; set; }

        public int? DocumentNarrativeId { get; set; }

        public short AccountLineTypeId { get; set; }

        public long? CharterId { get; set; }

        public long? CostTypeId { get; set; }

        public string CostTypeCode { get; set; }

        public decimal? Amount { get; set; }

        public decimal SigningFactor { get; set; }

        public long? DepartmentId { get; set; }

        public string DocumentReference { get; set; }

        public string SecondaryDocumentReference { get; set; }

        public string CurrencyCode { get; set; }

        public DateTime DocumentDate { get; set; }

        public DateTime? ValueDate { get; set; }

        public short? TransactionDocumentTypeId { get; set; }

        public long? TransactionDocumentId { get; set; }

        public decimal MatchedAmount { get; set; }

        /// <summary>
        /// unused
        /// </summary>
        public int MatchingStatusId { get; set; }

        public bool IsCash { get; set; }

        public decimal AmountToBePaid { get; set; }

        public string IsCreditOrDebit { get; set; }

        public decimal Credit { get; set; }

        public decimal Debit { get; set; }

        public long MarkingId { get; set; }

        public decimal DocumentAmount { get; set; }

        public int? TransactionDirectionId { get; set; }

        public decimal? StatutoryCcyAmount { get; set; }

        public DateTime PaymentDocumentDate { get; set; }

        public decimal? FunctionalCcyAmount { get; set; }

        public decimal? AmountInFunctionalCurrency { get; set; }

        public decimal? AmountInStatutoryCurrency { get; set; }

        public decimal? CashLineAmountInFunctionalCurrency { get; set; }

        public decimal? CashLineAmountInStatutoryCurrency { get; set; }

        public decimal? AmountInUSDorOtherCurrency { get; set; }

        public long? MatchingCounterpartyId { get; set; }

        public long? PaymentCounterpartyId { get; set; }

        public string Narrative { get; set; }

        public string ExternalReference { get; set; }

        public string Marking { get; set; }

        public DateTime? InvoiceGLDate { get; set; }

        public long? SourceJournalLineId { get; set; }

        public long? SourceInvoiceId { get; set; }

        public long? SourceCashLineId { get; set; }

        public long? MatchedJournalLineId { get; set; }

        public long? MatchedInvoiceId { get; set; }

        public long? MatchedCashLineId { get; set; }

        public long? SecondaryDocumentReferenceId { get; set; }
    }

    public class DocumentMatchingSettlement
    {
        public long DocumentMatchingId { get; set; }

        public long SettleDocumentMatchingId { get; set; }

        public decimal Amount { get; set; }
    }

    public class OldNewId
    {
        public string DocumentReference { get; set; }

        public long? OldTransactionDocumentId { get; set; }
        public long? NewTransactionDocumentId { get; set; }
    }
}
