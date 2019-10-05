namespace LDC.Atlas.Services.PreAccounting.Entities
{
    /// <summary>
    /// Contains the information required to executed correctly the change of the "posting" status
    /// </summary>
    public class AccountingDocumentPostingInformation
    {
        public long AccountingDocumentId { get; set; }

        public string DocumentReference { get; set; }

        public long TransactionDocumentId { get; set; }

        public long TransactionDocumentTypeId { get; set; }

        /// <summary>
        /// Gets or sets id of the cash type ; null if the document is not a cash
        /// </summary>
        public long? DetailedCashType { get; set; }

        /// <summary>
        /// Gets or sets detailed invoice type ; null if the document is not an invoice
        /// </summary>
        public long? DetailedInvoiceType { get; set; }

        /// <summary>
        /// Gets or sets gets of sets the id of the match flag associated to the cash by picking.
        /// This is filled in only when working with a cash by picking that we want to post (otherwise, null)
        /// </summary>
        public long? CashByPickingMatchFlagId { get; set; }

        /// <summary>
        /// Gets or sets the full document details ; this is usefull mostly when posting the accruals (creation
        /// of the automatic opposite for month +1)
        /// </summary>
        public AccountingDocument FullAccountingDocument { get; set; }

        public bool ToInterface { get; set; }

        /// <summary>
        /// Gets or sets the currency code of the document
        /// </summary>
        public string CurrencyCode { get; set; }
    }
}
