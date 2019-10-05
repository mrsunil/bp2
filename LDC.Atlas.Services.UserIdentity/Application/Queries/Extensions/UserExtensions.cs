using LDC.Atlas.Services.UserIdentity.Application.Queries.Dto;

namespace LDC.Atlas.Services.UserIdentity.Application.Queries.Extensions
{
    public static class UserExtensions
    {
        public static DirectoryUser MapToDirectoryUser(this Microsoft.Graph.User graphUser)
        {
            DirectoryUser user = new DirectoryUser
            {
                UserId = graphUser.Id,
                EmailAddress = graphUser.Mail,
                FirstName = graphUser.GivenName,
                LastName = graphUser.Surname,
                PreferredLanguage = graphUser.PreferredLanguage,
                Location = graphUser.OfficeLocation,
                PhoneNumber = graphUser.MobilePhone,
                DisplayName = graphUser.DisplayName,
                UserPrincipalName = graphUser.UserPrincipalName,
                SamAccountName = graphUser.OnPremisesSamAccountName,
                CompanyRole = graphUser.JobTitle
            };
            return user;
        }
    }
}
