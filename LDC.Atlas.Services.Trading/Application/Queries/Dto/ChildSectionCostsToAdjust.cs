using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Queries.Dto
{
    public class ChildSectionCostsToAdjust
    {
        public long CostId { get; set; }

        public long SectionId { get; set; }

        public string CostTypeCode { get; set; }

        public string ContractReference { get; set; }

        public string QuantityCode { get; set; }

        public decimal Quantity { get; set; }

        public int CostDirectionId { get; set; }

        public decimal Rate { get; set; }

        public decimal InvoicePercent { get; set; }

        public int InvoicingStatusId { get; set; }
    }
}
