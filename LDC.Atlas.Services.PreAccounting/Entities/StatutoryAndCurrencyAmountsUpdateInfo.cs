using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Entities
{
    public class StatutoryAndCurrencyAmountsUpdateInfo
    {
        public StatutoryAndCurrencyAmountsUpdateInfo()
        {
            AccountingLinesAmountsToUpdate = new List<AccountingLineAmountsToUpdate>();
            CashLinesAmountsToUpdate = new List<CashLineAmountsToUpdate>();
            CashCostsAmountsToUpdate = new List<CashCostAmountsToUpdate>();
            InvoiceLinesAmountsToUpdate = new List<InvoiceLineAmountsToUpdate>();
            InvoiceAmountsToUpdate = new List<InvoiceAmountsToUpdate>();
            DocumentMatchingToUpdate = new List<DocumentMatchingToUpdate>();
            JournalLinesAmountsToUpdate = new List<JournalLineAmountsToUpdate>();
        }

        public List<CashLineAmountsToUpdate> CashLinesAmountsToUpdate { get; set; }

        public List<CashCostAmountsToUpdate> CashCostsAmountsToUpdate { get; set; }

        public List<InvoiceLineAmountsToUpdate> InvoiceLinesAmountsToUpdate { get; set; }

        public List<InvoiceAmountsToUpdate> InvoiceAmountsToUpdate { get; set; }

        public List<JournalLineAmountsToUpdate> JournalLinesAmountsToUpdate { get; set; }

        public List<AccountingLineAmountsToUpdate> AccountingLinesAmountsToUpdate { get; set; }

        public List<DocumentMatchingToUpdate> DocumentMatchingToUpdate { get; set; }
    }

    public class CashLineAmountsToUpdate
    {
        public long CashLineId { get; set; }

        public decimal AmountInStatutoryCurrency { get; set; }

        public decimal AmountInFunctionalCurrency { get; set; }

        public override string ToString()
        {
            return $"Cash line id {CashLineId} StatutCCYAmount: {AmountInStatutoryCurrency} FctCCYAmount: {AmountInFunctionalCurrency}";
        }
    }
    public class CashCostAmountsToUpdate
    {
        public long CashAdditionCostId { get; set; }

        public decimal AmountInStatutoryCurrency { get; set; }

        public decimal AmountInFunctionalCurrency { get; set; }

        public override string ToString()
        {
            return $"Cash cost id {CashAdditionCostId} StatutCCYAmount: {AmountInStatutoryCurrency} FctCCYAmount: {AmountInFunctionalCurrency}";
        }
    }

    public class InvoiceLineAmountsToUpdate
    {
        public long InvoiceLineId { get; set; }

        public decimal AmountInStatutoryCurrency { get; set; }

        public decimal AmountInFunctionalCurrency { get; set; }

        public override string ToString()
        {
            return $"invoice line id {InvoiceLineId} StatutCCYAmount: {AmountInStatutoryCurrency} FctCCYAmount: {AmountInFunctionalCurrency}";
        }
    }
    public class InvoiceAmountsToUpdate
    {
        public long InvoiceId { get; set; }

        public decimal AmountInStatutoryCurrency { get; set; }

        public decimal AmountInFunctionalCurrency { get; set; }

        public override string ToString()
        {
            return $"invoice id {InvoiceId} StatutCCYAmount: {AmountInStatutoryCurrency} FctCCYAmount: {AmountInFunctionalCurrency}";
        }
    }
    public class JournalLineAmountsToUpdate
    {
        public long JournalLineId { get; set; }

        public long AccountingLineId { get; set; }

        public decimal AmountInStatutoryCurrency { get; set; }

        public decimal AmountInFunctionalCurrency { get; set; }

        public override string ToString()
        {
            return $"Journal line id {JournalLineId} StatutCCYAmount: {AmountInStatutoryCurrency} FctCCYAmount: {AmountInFunctionalCurrency}";
        }
    }

    public class AccountingLineAmountsToUpdate
    {
        public long AccountingLineId { get; set; }

        public decimal AmountInStatutoryCurrency { get; set; }

        public decimal AmountInFunctionalCurrency { get; set; }

        public override string ToString()
        {
            return $"Acc line id {AccountingLineId} StatutCCYAmount: {AmountInStatutoryCurrency} FctCCYAmount: {AmountInFunctionalCurrency}";
        }
    }

    public class DocumentMatchingToUpdate
    {
        public long DocumentMatchingId { get; set; }

        public decimal AmountInStatutoryCurrency { get; set; }

        public decimal AmountInFunctionalCurrency { get; set; }

        public override string ToString()
        {
            return $"Document matching id {DocumentMatchingId} StatutCCYAmount: {AmountInStatutoryCurrency} FctCCYAmount: {AmountInFunctionalCurrency}";
        }
    }
}
