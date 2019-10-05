using LDC.Atlas.DataAccess.DapperMapper;

namespace LDC.Atlas.Services.PreAccounting
{
    public class TransactionRecord
    {
        [Column(Name = "I_Transaction")]
        public long TransactionID { get; set; }

        [Column(Name = "I_Document")]
        public long DocumentID { get; set; }
    }
}
