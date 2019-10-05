using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.UserIdentity.Entities
{
    public class UserIAG
    {
        public string UserId { get; set; }

        public string ManagerSamAccountName { get; set; }

        public string CompanyRole { get; set; }

        public bool DifferentADManager { get; set; }

        public bool DifferentADCompanyRole { get; set; }

        public bool? IsDisabled { get; set; }
    }
}
