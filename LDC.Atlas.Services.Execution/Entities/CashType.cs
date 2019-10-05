namespace LDC.Atlas.Services.Execution.Entities
{
    public enum DirectionType
    {
        Payment = 1,
        Receipt = 2,
    }

    public enum CashSelectionType
    {
        SimpleCashPayment = 1,
        PaymentFullPartialTransaction = 2,
        PaymentDifferentCurrency = 3,
        PaymentDifferentClient = 4,
        SimpleCashReceipt = 5,
        ReceiptFullPartialTransaction = 6,
        ReceiptDifferentCurrency = 7,
    }
}
