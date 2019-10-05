namespace LDC.Atlas.Services.PreAccounting.Entities
{
    public class VATRecord
    {
        public string VATCode { get; set; }

        public decimal NominalIn { get; set; }

        public decimal NominalOut { get; set; }
    }
}
