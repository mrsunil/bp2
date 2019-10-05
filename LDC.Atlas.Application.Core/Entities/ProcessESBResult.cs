using System;
using System.Collections.Generic;
using System.Text;

namespace LDC.Atlas.Application.Core.Entities
{
    public class ProcessESBResult
    {
        public bool IsSuccess { get; set; }

        public string Error { get; set; }

        public string UUID { get; set; }
    }
}
