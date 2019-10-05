using LDC.Atlas.Document.Common.Entities;

namespace LDC.Atlas.Document.Common.Utils
{
    public static class PhysicalDocumentTypeExtension
    {
        public static string GetApplicationTableName(this PhysicalDocumentType physicalDocumentType)
        {
            switch (physicalDocumentType)
            {
                case PhysicalDocumentType.ContractAdvice:
                    return "Section";
                case PhysicalDocumentType.InvoiceGoodsInvoice:
                case PhysicalDocumentType.InvoiceCostsInvoice:
                case PhysicalDocumentType.InvoiceGoodsCostInvoice:
                case PhysicalDocumentType.InvoiceWashout:
                case PhysicalDocumentType.InvoiceString:
                case PhysicalDocumentType.InvoiceCircle:
                case PhysicalDocumentType.InvoiceProvisional:
                case PhysicalDocumentType.InvoiceFinal:
                case PhysicalDocumentType.InvoicePrepayment:
                case PhysicalDocumentType.InvoiceCancellation:
                    return "Invoice";
                case PhysicalDocumentType.CashSimpleCash:
                case PhysicalDocumentType.CashPickByTransaction:
                case PhysicalDocumentType.CashDifferentClient:
                case PhysicalDocumentType.CashDifferentCurrency:
                    return "Cash";
                case PhysicalDocumentType.ManualCreationJournalEntry:
                case PhysicalDocumentType.ManualCreationManualccrual:
                case PhysicalDocumentType.ManualCreationManualMTM:
                case PhysicalDocumentType.MonthEndAccruals:
                case PhysicalDocumentType.MonthEndMTMFX:
                case PhysicalDocumentType.MonthEndMTMFnO:
                case PhysicalDocumentType.MonthEndMTMPhysicals:
                case PhysicalDocumentType.MonthEndMTMInventory:
                case PhysicalDocumentType.MonthEndInventoryValidation:
                default:
                    throw new System.Exception($"Unknown document type: {physicalDocumentType}");
            }
        }
    }
}
