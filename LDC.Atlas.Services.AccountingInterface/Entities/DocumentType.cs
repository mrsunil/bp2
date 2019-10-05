namespace LDC.Atlas.Services.AccountingInterface.Entities
{
    public enum DocumentType
    {
        PurchaseInvoice = 1,
        SalesInvoice = 2,
        CreditNote = 3,
        DebitNote = 4,
        CashPay = 5,
        CashReceipt = 6,
        ManualTemporaryAdjustment = 7,
        MatchingCash = 8,
        RegularJournal = 9,
        FxDealJournal = 10
    }

    public enum JLType
    {
        ManualRegularJournal = 1,
        Revaluation = 2,
        CounterPartyTransfer = 3,
    }

    public enum TAType
    {
        ManualTemporaryAdjustment = 1,
        MonthEndTemporaryAdjustment = 2,
        ManualMarkToMarket = 3,
        FxDealMonthTemporaryAdjustment = 4,
    }
}
