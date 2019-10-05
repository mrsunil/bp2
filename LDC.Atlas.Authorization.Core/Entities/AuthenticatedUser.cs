using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace LDC.Atlas.Authorization.Core.Entities
{
    public class AuthenticatedUser
    {
        private ICollection<UserPermission> _permissions;

        public long UserId { get; set; }

        public string UserPrincipalName { get; set; }

        public string SamAccountName { get; set; }

        public string Email { get; set; }

        public ICollection<UserPermission> Permissions
        {
            get => _permissions ?? (_permissions = new Collection<UserPermission>());
        }
    }

    public class UserPermission
    {
        public string CompanyId { get; set; }

        public int ProfileId { get; set; }

        public string ProfileName { get; set; }

        public bool IsTrader { get; set; }

        public bool IsCharterManager { get; set; }

        public bool AllDepartments { get; set; }

        public IEnumerable<Department> Departments { get; set; }
    }

    public class Department
    {
        public int DepartmentId { get; set; }

        public string CompanyId { get; set; }
    }
}
