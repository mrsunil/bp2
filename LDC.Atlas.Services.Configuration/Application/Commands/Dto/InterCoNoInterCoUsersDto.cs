using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Application.Commands.Dto
{
    public class InterCoNoInterCoUsersDto
    {
        public long UserId { get; set; }

        public string Email { get; set; }

        public bool IsDisabled { get; set; }
}
}
