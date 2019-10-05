namespace LDC.Atlas.Application.Core.Entities
{
    public enum ProcessType
    {
        AtlasPostingProcessor = 0,
        AtlasAuditProcessor = 1,
        AtlasPaymentRequestInterfaceProcessor = 2,
        AtlasAccountingDocumentProcessor = 3,
        AtlasAccountingInterfaceProcessor = 4,
        AtlasRecalculationProcessor = 5
    }
}