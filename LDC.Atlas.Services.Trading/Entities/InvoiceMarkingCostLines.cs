using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Entities
{
    public class InvoiceMarkingCostLines
    {
        public long CostId { get; set; }

        public long? InvoiceLineId { get; set; }

        public decimal InvoicePercent { get; set; }
    }
}
