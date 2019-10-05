using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.UserIdentity.Application.Queries.Dto
{
    public class UserDto
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

        public Guid? ApplicationId { get; set; }

        public bool IsApplicationUser { get; set; }

        public bool IsDisabled { get; set; }

        public DateTime? LastConnectionDateTime { get; set; }

        public string ManagerSamAccountName { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public IEnumerable<UserPermissionDto> Permissions { get; set; }

        public string CompanyRole { get; set; }
    }
}
