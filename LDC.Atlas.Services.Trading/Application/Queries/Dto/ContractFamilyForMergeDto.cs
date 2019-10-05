using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Trading.Application.Queries.Dto
{
    /// <summary>
    /// Information reagrding the contracts for trade merge
    /// </summary>
    public class ContractFamilyForMergeDto
    {
        public long SectionId { get; set; }

        public string ContractSectionCode { get; set; }

        public string ParentContract { get; set; }

        public long DepartmentId { get; set; }

        public string AllocatedContract { get; set; }

        public string CounterpartyRef { get; set; }

        public long BuyerId { get; set; }

        public long SellerId { get; set; }

        public long WeightUnitId { get; set; }

        public decimal Quantity { get; set; }

        public string PrincipalCommodity { get; set; }

        public string Part2 { get; set; }

        public string Part3 { get; set; }

        public string Part4 { get; set; }

        public string Part5 { get; set; }

        public string CurrencyCode { get; set; }

        public long PriceUnitId { get; set; }

        public decimal Price { get; set; }

        public DateTime? BLDate { get; set; }

        public string CharterCode { get; set; }

        public decimal PremiumDiscountValue { get; set; }

        public string PremiumDiscountCurrency { get; set; }

        public short? PremiumDiscountTypeId { get; set; }

        public bool ShippingPeriod { get; set; }

        public DateTime? DeliveryPeriodStart { get; set; }

        public DateTime? DeliveryPeriodEnd { get; set; }

        public long? PortOriginId { get; set; }

        public long? PortDestinationId { get; set; }

        public bool IsClosed { get; set; }

        public bool IsApproved { get; set; }

        public bool IsAllocated { get; set; }

        public bool IsInvoiced { get; set; }

        public bool HasCost { get; set; }

        public bool IsMergeAllowed { get; set; }

        public string Message { get; set; }

        public long Counterparty { get; set; }

        public long ContractTermId { get; set; }

        public long PaymentTermId { get; set; }

        public long? ArbitrationId { get; set; }
    }
}
