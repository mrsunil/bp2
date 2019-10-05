namespace LDC.Atlas.Services.Execution.Entities
{
    public class TransactionDocumentRateOfExchange
    {
        public long TransactionDocumentId { get; set; }

        public decimal? RoeDocumentCurrency { get; set; }

        public string RoeDocumentCurrencyType { get; set; }

        public decimal? RoeFunctionalCurrency { get; set; }

        public string RoeFunctionalCurrencyType { get; set; }

        public decimal? RoeStatutoryCurrency { get; set; }

        public string RoeStatutoryCurrencyType { get; set; }
    }
}