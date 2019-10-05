using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Application.Queries.Dto
{
    public class CostAssignedToSectionDto
    {
        public int DataVersionId { get; set; }

        public int CostId { get; set; }

        public string SectionId { get; set; }

        public bool InvoiceStatus { get; set; }

        public int InvoicePercent { get; set; }

        public int InvoiceDate { get; set; }

        public int NetAccrual { get; set; }

        public string CurrencyCode { get; set; }
    }
}
