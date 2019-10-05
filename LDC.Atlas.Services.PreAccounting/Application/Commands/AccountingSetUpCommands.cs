using MediatR;
using System;

namespace LDC.Atlas.Services.PreAccounting.Application.Commands
{
    public class UpdateAccountingSetUpCommand : IRequest
    {
        public DateTime LastMonthClosed { get; set; }

        public DateTime LastMonthClosedForOperation { get; set; }

        public int NumberOfOpenPeriod { get; set; }

        public string CompanyId { get; set; }

       public int OpenPeriodCounter { get; set; }
       public int MaximumNumberofOpenFinancialYears { get; set; }
       public int LastMonthofFinancialYear { get; set; }
       public int LastFinancialYearClosed { get; set; }
    }
}
