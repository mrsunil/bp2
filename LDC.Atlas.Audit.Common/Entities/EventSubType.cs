namespace LDC.Atlas.Audit.Common.Entities
{
    public enum EventSubType
    {
        SendingInvoice = 1,
        SendingJournal = 2,
        SendingAccrual = 3,
        SendingCash = 4,
        PaymentRequest = 5,
        FreezeCreation = 6,
        SendingDerivative = 7,
        SendingMTM = 8,
    }
}
