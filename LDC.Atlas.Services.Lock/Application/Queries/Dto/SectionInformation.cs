using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Lock.Application.Queries.Dto
{
    public class SectionInformation
    {
        public long SectionId { get; set; }

        public string SectionCode { get; set; }

        public int? AllocatedTo { get; set; }
    }
}
