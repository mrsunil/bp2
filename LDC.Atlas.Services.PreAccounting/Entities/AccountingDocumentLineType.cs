namespace LDC.Atlas.Services.PreAccounting.Entities
{
    public enum AccountingDocumentLineType
    {
        Client = 1,
        Tax = 2,
        Nominal = 3,
        Bank = 4,
    }

    public enum AccountingDocumentLineTypeTheRealOne
    {
        Client = 1,
        Vendor = 2,
        Ledger = 3,
        Bank = 4,
    }

    public enum RoeType
    {
        M,
        D,
    }

    public enum CashDocument
    {
        One,
        Two,
    }

    public enum ReportType
    {
        Realized = 1,
        Unrealized = 2,
    }
}
