using LDC.Atlas.DataAccess.DapperMapper;

namespace LDC.Atlas.Services.Execution.Entities
{
    public class DocumentRecord
    {
        [Column(Name = "DocumentId")]
        public long DocumentID { get; set; }

        public DocumentType DocumentType { get; set; }

        [Column(Name = "InvoiceId")]
        public long InvoiceID { get; set; }
    }
}
