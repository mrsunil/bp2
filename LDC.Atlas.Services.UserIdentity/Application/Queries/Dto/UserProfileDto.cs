using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.UserIdentity.Application.Queries.Dto
{
    public class CompanyProfileDto
        {
            public int ProfileId { get; set; }

            public string Name { get; set; }

            public string Description { get; set; }
        }
}
