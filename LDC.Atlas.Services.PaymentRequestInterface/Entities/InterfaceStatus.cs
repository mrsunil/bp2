namespace LDC.Atlas.Services.PaymentRequestInterface.Entities
{
    public enum InterfaceStatus
    {
        None = 0,
        ReadyToTransmit = 1,
        StandBy = 2,
        TransmitError = 3,
        Interfaced = 4,
        Error = 5,
        Rejected = 6,
        Signed = 7,
        Included = 8,
    }
}
