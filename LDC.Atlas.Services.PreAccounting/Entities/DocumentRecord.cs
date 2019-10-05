namespace LDC.Atlas.Services.PreAccounting.Entities
{
    public class DocumentRecord
    {
        public long DocumentID { get; set; }

        public DocumentType DocumentType { get; set; }

        public long InvoiceID { get; set; }
    }
}
