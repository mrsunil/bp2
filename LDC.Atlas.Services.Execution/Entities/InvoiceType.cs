namespace LDC.Atlas.Services.Execution.Entities
{
    public enum InvoiceType
    {
        CommercialPurchase = 1,
        CommercialSale = 2,
        Cost = 3,
        CostReceivable = 4,
        CostCreditNote = 5,
        CostDebitNote = 6,
        //GoodsCost = 4,
        Washout = 7,
        Reversal = 9,        
        GoodsCostPurchase = 10,
        GoodsCostSales = 11,
        Cancelled = 12
    }
}
