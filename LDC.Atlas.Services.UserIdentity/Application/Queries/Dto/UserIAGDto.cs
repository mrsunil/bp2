using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.UserIdentity.Application.Queries.Dto
{
    public class UserIAGDto
    {
        public string UserId { get; set; }

        public string ManagerSamAccountName { get; set; }

        public string CompanyRole { get; set; }
    }
}
