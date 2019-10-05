using LDC.Atlas.DataAccess.DapperMapper;

namespace LDC.Atlas.Services.Controlling.Entities
{
    public class Aggregation
    {
        [Column(Name = "AccountRef")]
        public string AccountReference { get; set; }

        public string ExpenseCode { get; set; }

        [Column(Name = "Dept")]
        public string DepartmentCode { get; set; }

        [Column(Name = "Currency")]
        public string CurrencyCode { get; set; }

        public string Amount { get; set; }

        public string Quantity { get; set; }

        [Column(Name = "EntryType")]
        public string CreditDebit { get; set; }
    }
}