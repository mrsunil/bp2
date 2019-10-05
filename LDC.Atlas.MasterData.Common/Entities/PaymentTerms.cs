using LDC.Atlas.DataAccess.DapperMapper;

namespace LDC.Atlas.MasterData.Common.Entities
{
    public class PaymentTerms
    {
        [Column(Name = "PaymentTermCode")]
        public string PaymentTermsCode { get; set; }

        [Column(Name = "Description")]
        public string PaymentTermsDescription { get; set; }

        public decimal CreditDays { get; set; }

        public string CreditAgainst { get; set; }

        [Column(Name = "PaymentTermId")]
        public long PaymentTermsId { get; set; }

        public string DisplayName => PaymentTermsCode;
    }
}
