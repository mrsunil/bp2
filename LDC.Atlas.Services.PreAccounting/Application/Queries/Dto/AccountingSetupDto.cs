using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.PreAccounting.Application.Queries.Dto
{
    public class AccountingSetupDto
    {
        public string CashReceived { get; set; }

        public string CashPaid { get; set; }

        public string PurchaseInvoice { get; set; }

        public string SalesInvoice { get; set; }

        public string WashoutInvoiceGains { get; set; }

        public string WashoutInvoiceLoss { get; set; }

        /// <summary>
        /// Cost type code of the "ledger" lines which are not costs
        /// </summary>
        public string FXReval { get; set; }

        /// <summary>
        /// Nominal account id to use for the non-cost ledger lines
        /// </summary>
        public string FXRevalaccount { get; set; }

        public DateTime LastMonthClosed { get; set; }

        public DateTime LastMonthClosedForOperation { get; set; }

        public int NumberOfOpenPeriod { get; set; }

        public IEnumerable<NominalCostTypeInfoDto> NominalCostTypeInfo { get; set; }

        public int OpenPeriodCounter { get; set; }

        public string SalesLedgerControlClientDebtors { get; set; }

        public string PurchaseLedgerControlClientCreditors { get; set; }

        public string DocumentReference { get; set; }

        public int MaximumNumberofOpenFinancialYears { get; set; }
        public int LastMonthofFinancialYear { get; set; }
        public int LastFinancialYearClosed { get; set; }

        public string CancellationLoss { get; set; }

        public string CancellationGain { get; set; }
    }
}
