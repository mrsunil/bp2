using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.UserIdentity.Entities
{
    public class User
    {
        public int UserId { get; set; }

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

        public string ManagerSamAccountName { get; set; }

        public DateTime CreateDate { get; set; }

        public string CreatedBy { get; set; }

        public DateTime ModifyDate { get; set; }

        public string ModifiedBy { get; set; }

        public IEnumerable<UserPermission> Permissions { get; set; }

        public string CompanyRole { get; set; }
    }
}
