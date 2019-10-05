namespace LDC.Atlas.Services.Execution.Application.Queries.Dto
{
    public class CashSetupDto
    {
        public string PaymentCostTypeCode { get; set; }

        public string ReceiptCostTypeCode { get; set; }

        public int ToTransmitToTreasury { get; set; }

        public int AuthorizedForPosting { get; set; }

        public long NominalAccountId { get; set; }

        public string NominalAccountCode { get; set; }

        public string CurrencyCode { get; set; }
    }
}
