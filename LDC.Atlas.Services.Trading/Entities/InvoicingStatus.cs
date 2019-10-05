namespace LDC.Atlas.Services.Trading.Entities
{
    public enum InvoicingStatus
    {
        Uninvoiced = 1,
        FinalInvoiceRequired = 2,
        Finalized = 3,
    }

    public enum CurrentTradeOption
    {
        NoAction = 0,
        AdjustContract = 1,
        CreateAllocatedResidualSplit = 2,
        CreateUnallocatedResidualSplit = 3,
    }

    public enum AllocateTradeOption
    {
        NoAction = 0,
        AdjustAllocation = 1,
        LeaveStatus = 2,
        CreateUnallocatedResidualSplit = 3,
    }
}
