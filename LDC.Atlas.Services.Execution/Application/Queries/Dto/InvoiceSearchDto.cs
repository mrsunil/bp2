using System;

namespace LDC.Atlas.Services.Execution.Application.Queries.Dto
{
    public class InvoiceSearchDto
    {
        public int Type { get; set; }

        public string FilterParameter { get; set; }

        public DateTime? PeriodFrom { get; set; }

        public DateTime? PeriodTo { get; set; }
    }
}
