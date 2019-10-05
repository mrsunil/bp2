namespace LDC.Atlas.Services.PreAccounting.Entities
{
    public class AccountingDocumentStatus
    {
        public long AccountingId { get; set; }

        public PostingStatus StatusId { get; set; }

        public DocumentType DocumentType { get; set; }

        public string ErrorMessage { get; set; }
    }
}
