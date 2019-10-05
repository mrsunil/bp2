using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace LDC.Atlas.Services.UserIdentity.Entities
{
    public class Profile
    {
        private ICollection<ProfilePrivilege> _profilePrivileges;

        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public bool IsDisabled { get; set; }

        public DateTime CreateDate { get; set; }

        public string CreatedBy { get; set; }

        public DateTime ModifyDate { get; set; }

        public string ModifiedBy { get; set; }

        public ICollection<ProfilePrivilege> ProfilePrivileges
        {
            get => _profilePrivileges ?? (_profilePrivileges = new Collection<ProfilePrivilege>());
        }
    }
}
