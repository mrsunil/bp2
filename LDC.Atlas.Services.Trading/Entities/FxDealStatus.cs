namespace LDC.Atlas.Services.Trading.Entities
{
#pragma warning disable CA1717 // Only FlagsAttribute enums should have plural names
    public enum FxDealStatus
#pragma warning restore CA1717 // Only FlagsAttribute enums should have plural names
    {
        None = 0,
        Open = 1,
        Linked = 2,
        Settled = 3,
        Deleted = 4
    }
}
