using LDC.Atlas.DataAccess.DapperMapper;

namespace LDC.Atlas.Services.Execution.Entities
{
    public class TransactionRecord
    {
        [Column(Name = "TransactionId")]
        public long TransactionID { get; set; }

        [Column(Name = "DocumentId")]
        public long DocumentID { get; set; }
    }
}
