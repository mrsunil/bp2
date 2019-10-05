using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Lock.Application.Queries.Dto
{
    public class IsLockedDto
    {
        public bool IsLocked { get; set; }

        public string Message { get; set; }
    }
}
