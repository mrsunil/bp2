using System;

namespace LDC.Atlas.Execution.Common.Queries.Dto
{
    public class AccountingSetupDto
    {
        public DateTime LastMonthClosed { get; set; }

        public DateTime LastMonthClosedForOperation { get; set; }

        public int NumberOfOpenPeriod { get; set; }
    }
}
