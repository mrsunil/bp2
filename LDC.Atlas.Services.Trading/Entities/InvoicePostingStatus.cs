namespace LDC.Atlas.Services.Trading.Entities
{
    public enum InvoicePostingStatus
    {
        Incomplete = 1,
        Held = 2,
        MappingError = 3,
        Authorized = 4,
        Posted = 5,
        Deleted = 6,
    }    
}