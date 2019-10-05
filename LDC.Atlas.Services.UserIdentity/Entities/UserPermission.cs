using System.Collections.Generic;

namespace LDC.Atlas.Services.UserIdentity.Entities
{
    public class UserPermission
    {
        public string CompanyId { get; set; }

        public int ProfileId { get; set; }

        public bool IsTrader { get; set; }

        public bool IsCharterManager { get; set; }

        public bool AllDepartments { get; set; }

        public IEnumerable<Department> Departments { get; set; }
    }
}
