namespace LDC.Atlas.Services.Trading.Entities
{
#pragma warning disable CA1717 // Only FlagsAttribute enums should have plural names
    public enum InvoiceStatus
#pragma warning restore CA1717 // Only FlagsAttribute enums should have plural names
    {
        NotInvoiced = 0,
        NotFullyInvoiced = 1,
        FullyInvoiced = 2
    }
}
