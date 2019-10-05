using System;

namespace LDC.Atlas.Services.Freeze.Entities
{
    public class AccountingSetup
    {
        public string CashReceived { get; set; }

        public string CashPaid { get; set; }

        public string PurchaseInvoice { get; set; }

        public string SalesInvoice { get; set; }

        public string WashoutInvoiceGains { get; set; }

        public string WashoutInvoiceLoss { get; set; }

        public string FXReval { get; set; }

        public DateTime LastMonthClosed { get; set; }

        public DateTime LastMonthClosedForOperation { get; set; }

        public int NumberOfOpenPeriod { get; set; }

        public int OpenPeriodCounter { get; set; }

        public bool IsInClosedMonth(DateTime date)
        {
            return (date.Year == LastMonthClosed.Year && date.Month <= LastMonthClosed.Month)
                        || date.Year < LastMonthClosed.Year;
        }
    }
}
