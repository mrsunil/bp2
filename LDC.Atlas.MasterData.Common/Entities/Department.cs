using System;

namespace LDC.Atlas.MasterData.Common.Entities
{
    public class Department
    {
        public long DepartmentId { get; set; }

        public string DepartmentCode { get; set; }

        public string DisplayName => DepartmentCode;

        public string Description { get; set; }

        public bool IsDeactivated { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public long ProfitCenterId { get; set; }
    }
}
