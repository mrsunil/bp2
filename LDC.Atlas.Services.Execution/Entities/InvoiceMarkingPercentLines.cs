using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Entities
{
    public class InvoiceMarkingPercentLines
    {
        public long? InvoiceLineId { get; set; }

        public decimal InvoicePercent { get; set; }
    }
}
