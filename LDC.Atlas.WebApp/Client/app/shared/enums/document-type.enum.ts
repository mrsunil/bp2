export enum DocumentTypes {
    Unknown = 0,
    ContractAdvice = 1,

    // Invoice
    InvoiceGoodsInvoice = 10,
    InvoiceCostsInvoice = 11,
    InvoiceGoodsCostInvoice = 12,
    InvoiceWashout = 13,
    InvoiceString = 14,
    InvoiceCircle = 15,
    InvoiceProvisional = 16,
    InvoiceFinal = 17,
    InvoicePrepayment = 18,
    InvoiceCancellation = 19,

    // Cash
    CashSimpleCash = 30,
    CashPickByTransaction = 31,
    CashDifferentClient = 32,
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
    MonthEndInventoryValidation = 75
}
