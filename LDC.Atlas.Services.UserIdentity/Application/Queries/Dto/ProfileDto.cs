using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.UserIdentity.Application.Queries.Dto
{
    public class ProfileDto
    {
        public int ProfileId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public bool IsDisabled { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public int NumberOfUsers { get; set; }

        public IEnumerable<ProfilePrivilegeDto> Privileges { get; set; }
    }

    public class ProfileSummaryDto
    {
        public int ProfileId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public bool IsDisabled { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public int NumberOfUsers { get; set; }
    }

    public class ProfilePrivilegeDto
    {
        public int PrivilegeId { get; set; }

        public string Name { get; set; }

        public int Level { get; set; }

        public int Permission { get; set; }
    }
}
