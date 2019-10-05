using System;

namespace LDC.Atlas.Services.PreAccounting.Entities
{
    public class Cost
    {
         public int CostId { get; set; }

         public int SectionId { get; set; }

         public string ContractLabel { get; set; }

         public string CostTypeCode { get; set; }

         public string SupplierCode { get; set; }

         public string Currency { get; set; }

         public string RateType { get; set; }

         public decimal Rate { get; set; }

         public string PricingMethod { get; set; }

         public int CostDirection { get; set; }

         public decimal OriginalEstimatePMTValue { get; set; }

         public decimal OriginalEstimateFullValue { get; set; }

         public decimal CalculatedFullValue { get; set; }

        public InvoiceStatus InvoiceStatus { get; set; }

        public string CreatedBy { get; set; }

        public DateTime CreationDate { get; set; }

         public string LastModifiedBy { get; set; }

         public DateTime LastModifiedDate { get; set; }

         public decimal AmountInvoiced { get; set; }

         public string Charter { get; set; }

         public decimal Quantity { get; set; }
    }
}