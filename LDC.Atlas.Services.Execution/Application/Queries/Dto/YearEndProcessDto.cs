using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Application.Queries.Dto
{
    public class YearEndProcessDto
    {
        public string AccountNumber { get; set; }

        public string MainAccountTitle { get; set; }

        public string CurrencyCode { get; set; }

        public long ValueInFunctionalCurrency { get; set; }

        public long ValueInStatutoryCurrency { get; set; }

        public int DepartmentId { get; set; }

    }
}
