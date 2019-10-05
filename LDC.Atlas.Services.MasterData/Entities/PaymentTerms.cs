using LDC.Atlas.DataAccess.DapperMapper;
using System;

namespace LDC.Atlas.Services.MasterData.Entities
{
    public class PaymentTerms
    {
        public string MDMId { get; set; }

        public string PaymentTermCode { get; set; }

        public string Description { get; set; }

        public bool Secure { get; set; }

        public string DisplayName => PaymentTermCode;

        public decimal CreditDays { get; set; }

        public string CreditAgainst { get; set; }

        public string CreditHow { get; set; }

        public bool Lc { get; set; }

        public bool CadType { get; set; }

        public bool PrepayInv { get; set; }

        public string PVal { get; set; }

        public string SVal { get; set; }

        public bool CreditLimitCheck { get; set; }

        [Column(Name = "PaymentTermId")]
        public long PaymentTermsId { get; set; }

        public bool IsDeactivated { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }
    }
}
