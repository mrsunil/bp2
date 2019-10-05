using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Entities
{
    public class DefaultAccountingSetup
    {
        public long? AccountingSetupId { get; set; }

        public long? CashReceivedCostTypeId { get; set; }

        public long? CashPaidCostTypeId { get; set; }

        public long? PurchaseInvoiceCostTypeId { get; set; }

        public long? SalesInvoiceCostTypeId { get; set; }

        public long? WashoutInvoiceGainsCostTypeId { get; set; }

        public long? WashoutInvoiceLossCostTypeId { get; set; }

        public long? FXRevalCostTypeId { get; set; }

        public long? DefaultBankAccountId { get; set; }

        public long? SalesLedgerControlClientDebtorsId { get; set; }

        public long? PurchaseLedgerControlClientCreditorsId { get; set; }

        public long? FXRevalaccountId { get; set; }

        public long? SuspenseAccountforWashoutSuspenseId { get; set; }

        public long? RealisedPhysicalsPayableId { get; set; }

        public long? RealisedPhysicalsReceivableId { get; set; }

        public long? VatAccountInputsId { get; set; }

        public long? VatAccountOutputsId { get; set; }

        public long? FxAccountGainId { get; set; }

        public long? FxAccountLossId { get; set; }

        public long? DealNominalAccountId { get; set; }

        public long? SettlementNominalAccountId { get; set; }

        public long? PLClearanceYepAccountId { get; set; }

        public long? BalanceSheetClearanceYepAccountId { get; set; }

        public long? BSReserveYepAccountId { get; set; }

        public long? YepCostTypeId { get; set; }

        public long? CancellationGainCostTypeId { get; set; }

        public long? CancellationLossCostTypeId { get; set; }

        public long? YepDepartmentId { get; set; }
    }
}
