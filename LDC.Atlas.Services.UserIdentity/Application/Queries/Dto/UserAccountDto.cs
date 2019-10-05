using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.UserIdentity.Application.Queries.Dto
{
    public class UserAccountDto
    {
        public string UserName { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        public string Location { get; set; }

        public string Company { get; set; }

        public bool Status { get; set; }

        public string Manager { get; set; }

        public int ProfileId { get; set; }

        public int UserId { get; set; }

        public string ProfileName { get; set; }
    }
}
