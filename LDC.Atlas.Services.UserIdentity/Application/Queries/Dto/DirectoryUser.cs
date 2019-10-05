using System.Linq;

namespace LDC.Atlas.Services.UserIdentity.Application.Queries.Dto
{
    public class DirectoryUser
    {
        private string samAccountName;

        public string UserId { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string EmailAddress { get; set; }

        public string PhoneNumber { get; set; }

        public string PreferredLanguage { get; set; }

        public string Location { get; set; }

        public string DisplayName { get; set; }

        public string UserPrincipalName { get; set; }

        public string SamAccountName
        {
            get
            {
                if (string.IsNullOrWhiteSpace(samAccountName))
                {
                    var name = EmailAddress ?? UserPrincipalName;
                    samAccountName = name.Split('@').First();
                }

                return samAccountName;
            }
            set => samAccountName = value;
        }

        public string ManagerSamAccountName { get; internal set; }

        public string CompanyRole { get; internal set; }
    }
}
