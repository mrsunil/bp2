namespace LDC.Atlas.Services.PreAccounting.Entities
{
    public class InvoiceLineRecord
    {
        public int? SectionID { get; set; }

        public int? CostID { get; set; }

        public int? InvoiceID { get; set; }

        public int InvoiceIndex { get; set; }

        public int LineType { get; set; }

        public string VATCode { get; set; }

        public decimal LineQuantity { get; set; }

        public decimal Price { get; set; }

        public decimal InvoiceLinePrice { get; set; }

        public decimal InvoiceLineVAT { get; set; }

        public decimal InvoiceLineTotalPrice { get; set; }

        public string Department { get; set; }
    }
}
