namespace LDC.Atlas.Services.Trading.Application.Queries.Dto
{
    public class TradeImageColumnDto
    {
        public long TradeFieldId { get; set; }

        public string CompanyId { get; set; }

        public string TradeFieldName { get; set; }

        public bool IsCopy { get; set; }

        public bool IsEdit { get; set; }

        public bool CopyAsFavorite { get; set; }
    }
}
