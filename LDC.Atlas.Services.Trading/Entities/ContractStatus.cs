namespace LDC.Atlas.Services.Trading.Entities
{
#pragma warning disable CA1717 // Only FlagsAttribute enums should have plural names
    public enum ContractStatus
#pragma warning restore CA1717 // Only FlagsAttribute enums should have plural names
    {
        Unapproved = 0,
        Approved = 1,
        Invoiced = 2,
        PartiallyInvoiced = 3,
        ToBeInvoiced = 4,
        Closed = 5,
        Cancelled = 6,
        Deleted = 7,
        Open = 8,
        Unknown = 10,
    }
}
