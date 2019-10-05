using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Application.Commands.Dto
{
    public class DefaultAccountingSetupDto
    {
        public long? AccountingSetupId { get; set; }

        public string CashReceived { get; set; }

        public string CashPaid { get; set; }

        public string PurchaseInvoice { get; set; }

        public string SalesInvoice { get; set; }

        public string WashoutInvoiceGains { get; set; }

        public string WashoutInvoiceLoss { get; set; }

        public string FXReval { get; set; }

        public string DefaultBankAccount { get; set; }

        public string SalesLedgerControlClientDebtors { get; set; }

        public string PurchaseLedgerControlClientCreditors { get; set; }

        public string FXRevalaccount { get; set; }

        public string SuspenseAccountforWashoutSuspense { get; set; }

        public string RealisedPhysicalsPayable { get; set; }

        public string RealisedPhysicalsReceivable { get; set; }

        public string VatAccountInputs { get; set; }

        public string VatAccountOutputs { get; set; }

        public string FXAccountGain { get; set; }

        public string FXAccountLoss { get; set; }

        public string CancellationGain { get; set; }

        public string CancellationLoss { get; set; }

        public string PlClearanceYepAccount { get; set; }

        public string BalanceSheetClearanceYepAccount { get; set; }

        public string BsReserveYepAccount { get; set; }

        public string YepCostType { get; set; }

        public string DealNominalAccount { get; set; }

        public string SettlementNominalAccount { get; set; }

        public string YepDepartment { get; set; }
    }
}
