using System;

namespace LDC.Atlas.Services.Execution.Application.Queries.Dto
{
    public class CashMatchingDto
    {
        public override string ToString()
        {
            return DocumentReference + ' ' + Amount + ' ' + CurrencyCode;
        }

        public int DocumentMatchingId { get; set; }

        public string AssociatedAccountCode { get; set; }

        public int DataVersionId { get; set; }

        public string PhysicalContractCode { get; set; }

        public string ContractSectionCode { get; set; }

        public string PaymentTermCode { get; set; }

        public decimal Quantity { get; set; }

        public string AccountReference { get; set; }

        public string ClientReference { get; set; }

        public int CommodityId { get; set; }

        public string DocumentNarrativeCode { get; set; }

        public int AccountLineTypeId { get; set; }

        public string CharterCode { get; set; }

        public string CostTypeCode { get; set; }

        public decimal Amount { get; set; }

        public string DepartmentCode { get; set; }

        public int DepartmentId { get; set; }

        public string SecondaryDocumentReference { get; set; }

        public string NominalAccountCode { get; set; }

        public string CounterpartyCode { get; set; }

        public DateTime ValueDate { get; set; }

        public string ExpenseCode { get; set; }

        public string DocumentType { get; set; }

        public decimal AmountToBePaid { get; set; }

        /* Added or re ordered the properties required as per new DB Model for cash module */
        public long TransactionDocumentId { get; set; }

        public string DocumentReference { get; set; }

        public short TransactionDocumentTypeId { get; set; }

        public string CurrencyCode { get; set; }

        public DateTime DocumentDate { get; set; }

        public bool AuthorizedForPosting { get; set; }

        public string TotalAmount { get; set; }

        public long CounterPartyId { get; set; }

        public long PaymentTermId { get; set; }

        public string MatchFlagCode { get; set; }

        public long MatchFlagId { get; set; }

        public decimal? Rate { get; set; }

        public bool IsChecked { get; set; }

        public string ExternalReference { get; set; }

        public string Narrative { get; set; }

        public long? CharterId { get; set; }

        public int TransactionDirectionID { get; set; }

        public string RoeType { get; set; }

        public string CurrencyCodeFrom { get; set; }

        public string CurrencyCodeTo { get; set; }

        public DateTime? InvoiceGLDate { get; set; }

        public long? SourceJournalLineId { get; set; }

        public long? SourceInvoiceId { get; set; }

        public long? SourceCashLineId { get; set; }

        public DateTime PostedDate { get; set; }
    }
}
