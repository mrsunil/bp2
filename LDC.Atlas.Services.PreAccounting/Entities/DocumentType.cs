namespace LDC.Atlas.Services.PreAccounting
{
    public enum DocumentType
    {
        PI = 1,
        SI = 2,
        CN = 3,
        DN = 4,
        CP = 5,
        CI = 6,

        /// <summary>
        /// Accruals (manual and monthly)
        /// </summary>
        MTA = 7,
        MC = 8,
        MJL = 9,
        FJ = 10,
    }

    public enum AccountLineType
    {
        C = 1,
        V = 2,
        L = 3,
        B = 4
    }

    public enum AccountingCategory
    {
        N = 1,
        C = 2,
        T = 3
    }

    public enum TransactionDirection
    {
        Paid = 1,
        Received = 2,
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
        FxDealMonthTemporaryAdjustment=4
    }

    public enum FxSettlementDocumentType
    {
        FxDeal = 1,
        FxSettlement = 2,
    }

    public enum FxDealDirection
    {
        Buy = 1,
        Sell = 2,
    }
}
