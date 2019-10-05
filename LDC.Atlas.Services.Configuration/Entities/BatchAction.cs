namespace LDC.Atlas.Services.Configuration.Entities
{
    public enum BatchAction
    {
        None = 0,
        CleanupAudit = 1,
        CleanupProcessMessages = 2,
        CleanupSsrsPredicate = 3,
        CreateDailyFreeze = 4,
        CreateMonthlyFreeze = 5,
        PostingProcess = 6,
        SettleFxDeal = 7,
        SyncADStatusProcess = 8
    }
}
