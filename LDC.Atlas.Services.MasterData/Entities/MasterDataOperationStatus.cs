namespace LDC.Atlas.Services.MasterData.Entities
{
    public enum MasterDataOperationStatus
    {
        None = 0,
        Success = 1,
        UnknownError = 2,
        ForeignKeyViolation = 3,
        RessourceNotFound = 4
    }
}
