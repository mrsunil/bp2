namespace LDC.Atlas.Services.Execution.Entities
{
    public enum InterfaceStatus
    {
        ReadyToTransmit = 1,
        StandBy = 2,
        TransmitError = 3,
        Interfaced = 4,
        Error = 5,
        Rejected = 6,
        Signed = 7,
        Completed = 8,
        InterfaceReady = 9,
        NotPosted = 10,
        Booked = 11,
    }
}
