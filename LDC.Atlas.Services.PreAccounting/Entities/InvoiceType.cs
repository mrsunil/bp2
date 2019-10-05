namespace LDC.Atlas.Services.PreAccounting.Entities
{
    public enum InvoiceType
    {
        CommercialPurchase = 1,
        CommercialSale = 2,
        CostPay = 3,
        CostReceive = 4,
        CostCredit = 5,
        CostDebit = 6,
        WashoutCredit = 7,
        WashoutDebit = 8,
        Reversal = 9,
        GoodsCostPurchase = 10,
        GoodsCostSales = 11,
        CancelledCredit = 12,
        CancelledDebit = 13
    }

    public enum ContractType
    {
        CommercialPurchase = 0,
        CommercialSale = 1
    }

    public enum CostDirectionType
    {
        Pay = 1,
        Receive = 2
    }

    public enum InvoiceFunction
    {
        Commercial = 1,
        Cost = 2,
        Washout = 3,
        Reversal = 4,
        GoodsAndCost = 5,
        Cancelled = 6
    }
}
