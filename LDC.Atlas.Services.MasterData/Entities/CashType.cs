namespace LDC.Atlas.Services.MasterData.Entities
{
    public class CashType
    {
        public long CashTypeId { get; set; }

        public string Description { get; set; }

        public int CostDirectionId { get; set; }

        public int TransactionDocumentTypeId { get; set; }

        public string Name { get; set; }
    }
}
