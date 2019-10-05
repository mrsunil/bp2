using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Entities
{
    public class YearEndProcessExistance
    {
        public bool Exists { get; set; }

        public bool IsLocked { get; set; }
    }
}
