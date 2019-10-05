using System.Collections.Generic;

namespace LDC.Atlas.Services.UserIdentity.Application.Queries.Dto
{
    public class UserPrivilegeDto
    {
        public string CompanyId { get; set; }

        public int ProfileId { get; set; }

        public string ProfileName { get; set; }

        public string PrivilegeName { get; set; }

        public int Permission { get; set; }
    }

    public class UserCompanyPrivilegesDto
    {
        public string CompanyId { get; set; }

        public IEnumerable<UserCompanyPrivilegeDto> Privileges { get; set; }
    }

    public class UserCompanyPrivilegeDto
    {
        public int ProfileId { get; set; }

        public string PrivilegeName { get; set; }

        public int Permission { get; set; }
    }
}
