using LDC.Atlas.DataAccess.DapperMapper;

namespace LDC.Atlas.Services.Controlling.Entities
{
    public class Accrual
    {
        public string DepartmentCode { get; set; }

        [Column(Name = "DeptDescription")]
        public string DepartmentDescription { get; set; }

        public string ContractLabel { get; set; }

        public string CostType { get; set; }

        public string Quantity { get; set; }

        public string Currency { get; set; }

        [Column(Name = "ContractValue")]
        public string FullValue { get; set; }

        public string InvoicedValue { get; set; }

        [Column(Name = "AccrualAmount")]
        public string AccrueAmount { get; set; }

        public string AssociatedClient { get; set; }

        [Column(Name = "R_Charter")]
        public string CharterReference { get; set; }
    }
}
