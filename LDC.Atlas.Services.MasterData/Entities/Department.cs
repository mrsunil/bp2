using System;

namespace LDC.Atlas.Services.MasterData.Entities
{
    public class Department
    {
        public long DepartmentId { get; set; }

        public string DepartmentCode { get; set; }

        public string DisplayName => DepartmentCode;

        public string Description { get; set; }

        public string CompanyCode { get; set; }

        public long CountryId { get; set; }

        public string AltCode { get; set; }

        public string AddInformation1 { get; set; }

        public string AddInformation2 { get; set; }

        public string AddInformation3 { get; set; }

        public string TraxPortfolio { get; set; }

        public string FOCode { get; set; }

        public string SpecDept { get; set; }

        public bool IsDeactivated { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public long ProfitCenterId { get; set; }

        public int CompanyId { get; set; }
    }
}
