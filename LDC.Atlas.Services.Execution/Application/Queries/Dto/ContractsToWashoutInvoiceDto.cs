using LDC.Atlas.Application.Core.Entities;
using System;

namespace LDC.Atlas.Services.Execution.Application.Queries.Dto
{
    public class ContractsToWashoutInvoiceDto : PaginatedItem
    {
        public long SectionId { get; set; }

        public int DataVersionId { get; set; }

        public string ContractReference { get; set; }

        public int ContractType { get; set; }

        public string Counterparty { get; set; }

        public string PrincipalCommodity { get; set; }

        public string ContractTermCode { get; set; }

        public string AllocatedContract { get; set; }

        public string CharterReference { get; set; }

        public string QuantityCode { get; set; }

        public decimal Quantity { get; set; }

        public string CurrencyCode { get; set; }

        public string PriceCode { get; set; }

        public decimal Price { get; set; }

        public string PaymentTermCode { get; set; }

        public decimal InvoicedQuantity { get; set; }

        public DateTime? BLDate { get; set; }

        public DateTime ContractDate { get; set; }

        public string Commodity { get; set; }

        public string Commodity2 { get; set; }

        public string Commodity3 { get; set; }

        public string Commodity4 { get; set; }

        public string Commodity5 { get; set; }
  
        public string Department { get; set; }

        public int DepartmentId { get; set; }

        public int PremiumDiscountType { get; set; }

        public int PremiumDiscountBasis { get; set; }

        public long PremiumDiscountValue { get; set; }

        public decimal WeightConversionFactor { get; set; }

        public decimal PriceConversionFactor { get; set; }
    }
}
