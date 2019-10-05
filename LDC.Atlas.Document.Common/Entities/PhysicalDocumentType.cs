using System.ComponentModel.DataAnnotations;

namespace LDC.Atlas.Document.Common.Entities
{
    public enum PhysicalDocumentType
    {
        [Display(Name = "Unknown")]
        Unknown = 0,

        [Display(Name = "Contract advice")]
        ContractAdvice = 1,

        // Invoice
        [Display(Name = "Invoice")]
        InvoiceGoodsInvoice = 10,
        [Display(Name = "Invoice")]
        InvoiceCostsInvoice = 11,
        [Display(Name = "Invoice")]
        InvoiceGoodsCostInvoice = 12,
        [Display(Name = "Invoice")]
        InvoiceWashout = 13,
        [Display(Name = "Invoice")]
        InvoiceString = 14,
        [Display(Name = "Invoice")]
        InvoiceCircle = 15,
        [Display(Name = "Invoice")]
        InvoiceProvisional = 16,
        [Display(Name = "Invoice")]
        InvoiceFinal = 17,
        [Display(Name = "Invoice")]
        InvoicePrepayment = 18,
        [Display(Name = "Invoice")]
        InvoiceCancellation = 19,

        // Cash
        [Display(Name = "Payment order")]
        CashSimpleCash = 30,
        [Display(Name = "Payment order")]
        CashPickByTransaction = 31,
        [Display(Name = "Payment order")]
        CashDifferentClient = 32,
        [Display(Name = "Payment order")]
        CashDifferentCurrency = 33,

        // ManualCreation
        ManualCreationJournalEntry = 50,
        ManualCreationManualccrual = 51,
        ManualCreationManualMTM = 52,

        // MonthEnd
        MonthEndAccruals = 70,
        MonthEndMTMFX = 71,
        MonthEndMTMFnO = 72,
        MonthEndMTMPhysicals = 73,
        MonthEndMTMInventory = 74,
        MonthEndInventoryValidation = 75,

        // CustomReports
        CustomReport = 76
    }
}