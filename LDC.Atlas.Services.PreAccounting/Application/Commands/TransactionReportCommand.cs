using LDC.Atlas.Services.PreAccounting.Entities;
using System;

namespace LDC.Atlas.Services.PreAccounting.Application.Commands
{
    public class TransactionReportCommand
    {
        public DateTime? FromDate { get; set; }

        public DateTime? ToDate { get; set; }

        public BalancesType? BalanceType { get; set; }

        public ReportStyleType? ReportStyleType { get; set; }

        public MatchingsType? MatchingType { get; set; }

        public UnmatchedType? UnmatchedType { get; set; }

        public bool? FunctionalCurrency { get; set; }

        public bool BroughtForward { get; set; }

        public bool? AccuralsIncluded { get; set; }

        public NominalAccountType? AccountType { get; set; }

        public DateTime? DocumentFromDate { get; set; }

        public DateTime? DocumentToDate { get; set; }
    }
}
