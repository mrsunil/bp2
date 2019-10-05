using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace LDC.Atlas.Application.Core.Entities
{
    public class User
    {
        public long UserId { get; set; }

        public string DisplayName { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        public string FavoriteLanguage { get; set; }

        public string Location { get; set; }

        public string UserPrincipalName { get; set; }

        public string SamAccountName { get; set; }

        public string AzureObjectIdentifier { get; set; }

        public Guid ApplicationId { get; set; }

        public bool IsApplicationUser { get; set; }

        public bool IsDisabled { get; set; }

        public DateTime? LastConnectionDateTime { get; set; }

        public ICollection<UserPermission> Permissions { get; } = new Collection<UserPermission>();
    }

    public class UserPermission
    {
        public string CompanyId { get; set; }

        public int ProfileId { get; set; }

        public string ProfileName { get; set; }

        public bool IsTrader { get; set; }

        public bool IsCharterManager { get; set; }

        public bool AllDepartments { get; set; }

        public ICollection<Department> Departments { get; } = new Collection<Department>();
    }

    public class Department
    {
        public long DepartmentId { get; set; }

        public string CompanyId { get; set; }
    }

    public class UserPrivilege
    {
        public string CompanyId { get; set; }

        public int ProfileId { get; set; }

        public string ProfileName { get; set; }

        public string PrivilegeName { get; set; }

        public int Permission { get; set; }
    }
}
