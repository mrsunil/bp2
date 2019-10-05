using LDC.Atlas.Application.Core.Entities;
using System;

namespace LDC.Atlas.Services.Execution.Application.Queries.Dto
{
    public class ContractsToCostInvoiceDto : PaginatedItem
    {
        public long CostId { get; set; }

        public long SectionId { get; set; }

        public string ContractReference { get; set; }        

        public string PrincipalCommodity { get; set; } // missing 5 fields of commodity  && to rename

        public string SupplierCode { get; set; }

        public string ContractTermCode { get; set; }

        public string CharterReference { get; set; }

        public decimal Quantity { get; set; }

        public string WeightCode { get; set; }

        public string CostTypeCode { get; set; }

        public string CostDirection { get; set; }

        public string CurrencyCode { get; set; }

        public decimal Rate { get; set; }

        public string Narrative { get; set; }

        public decimal OriginalEstimatedRate { get; set; }

        public DateTime ContractDate { get; set; }

        public string RateTypeCode { get; set; }

        public int Price { get; set; }

        public int WeightConversionFactor { get; set; }

        public decimal PriceConversionFactor { get; set; }

        public string Commodity { get; set; }

        public string Commodity2 { get; set; }

        public string Commodity3 { get; set; }

        public string Commodity4 { get; set; }

        public string Commodity5 { get; set; }

        public string Department { get; set; }

        public int DepartmentId { get; set; }

        public decimal InvoicePercent { get; set; }

        public decimal InvoicedAmount { get; set; }

        public decimal RateConversionFactor { get; set; }

        public decimal InvoicedPercentage => InvoicePercent;

        public decimal QuantityToInvoice => Quantity;
    }
}
