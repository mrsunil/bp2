export enum CharterClosureStatus {

    // 1 -> Fully Invoiced, 2-> Quantity = 0 / ShippingStatus = Cancelled
    // 3-> Invoice not finalized, 4 -> Unposted Invoices, 5 -> No BL Date/UNrelized Trade
    // 6 -> Uninvoiced Costs, 7-> Uncashmatched Costs & Not posted Invoices
    // sectionCloseValidStatus = [1, 2, 3, 4, 5, 6, 7];
    FullyInvoiced = 1,
    ZeroQuantity = 2,
    CancelledShipping = 3,
    InvoiceNotFinalized = 4,
    UnpostedInvoice = 5,
    NoBlDateUnrelizedTrade = 6,
    UninvoicedCosts = 7,
    UncashmatchedCosts = 8
}
