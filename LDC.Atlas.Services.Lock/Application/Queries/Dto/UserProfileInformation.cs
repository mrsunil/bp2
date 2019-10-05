using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Lock.Application.Queries.Dto
{
    public class UserProfileInformation
    {
        public long ProfileId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }
    }
}
