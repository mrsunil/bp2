using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Lock.Application.Queries.Dto
{
    public class UserAccountInformation
    {
        public long UserId { get; set; }

        public string DisplayName { get; set; }

        public string Location { get; set; }

        public string Email { get; set; }

        public string SamAccountName { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }
    }
}
