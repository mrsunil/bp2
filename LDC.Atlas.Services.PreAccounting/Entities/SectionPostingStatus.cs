namespace LDC.Atlas.Services.PreAccounting.Entities
{
    public class SectionPostingStatus
    {
        public int PostingStatusId { get; set; }

        public long AccountingId { get; set; }
    }

    public class AccountingDocumentCreationStatus
    {
        public long AccountingId { get; set; }

        public PostingStatus PostingStatusId { get; set; }
    }
}
