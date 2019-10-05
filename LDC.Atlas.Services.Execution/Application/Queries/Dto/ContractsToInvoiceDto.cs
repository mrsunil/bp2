using LDC.Atlas.Application.Core.Entities;
using System;

namespace LDC.Atlas.Services.Execution.Application.Queries.Dto
{
    public class ContractsToInvoiceDto : PaginatedItem
    {
        public int SectionId { get; set; }

        public decimal ContractQuantity { get; set; }

        public long ContractNumber { get; set; }

       public string Commodity { get; set; }

        public string QuantityCode { get; set; }

        public string Charter { get; set; }

        public string ContractTermCode { get; set; }

        public string ContractReference { get; set; }

        public string Counterparty { get; set; }

        public string CurrencyCode { get; set; }

        public string AllocationContract { get; set; }

        public decimal InvoicedQuantity { get; set; }

        public decimal UninvoicedQuantity { get; set; }

        public decimal QuantityToInvoice { get; set; }

        public int QuantityUnitId { get; set; }

        public string ContractTypeCode { get; set; }

        public decimal Price { get; set; }

        public int PriceUnitId { get; set; }

        public decimal PriceConversionFactor { get; set; }

        public DateTime BLDate { get; set; }

        public DateTime ArrivalDate { get; set; }

        public DateTime ContractDate { get; set; }

        public decimal WeightConversionFactor { get; set; }

        public string PaymentTermCode { get; set; }

        public int AllocatedQuantity { get; set; }

        public int PremiumDiscountType { get; set; }

        public int PremiumDiscountBasis { get; set; }

        public decimal PremiumDiscountValue { get; set; }

        public string PriceCode { get; set; }

        public string Commodity2 { get; set; }

        public string Commodity3 { get; set; }

        public string Commodity4 { get; set; }

        public string Commodity5 { get; set; }

        public string BusinessSector { get; set; }

        public int DepartmentId { get; set; }

        public string Department { get; set; }
    }
}
