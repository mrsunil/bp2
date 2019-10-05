using System;

namespace LDC.Atlas.Services.Execution.Application.Queries.Dto
{
    public class AllocationMessageDto
    {
        public long PortOriginId { get; set; }

        public long PortDestinationId { get; set; }

        public string PrincipalCommodity { get; set; }

        public string Part2 { get; set; }

        public string Part3 { get; set; }

        public string Part4 { get; set; }

        public string Part5 { get; set; }

        public long? CharterId { get; set; }

        public long? ArbitrationId { get; set; }

        public long? BuyerId { get; set; }

        public DateTime ContractDate { get; set; }

        public decimal ContractedValue { get; set; }

        public short? ContractStatusCode { get; set; }

        public long? ContractTermLocationId { get; set; }

        public string CounterpartyRef { get; set; }

        public int CropYear { get; set; }

        public string CurrencyCode { get; set; }

        public DateTime DeliveryPeriodEnd { get; set; }

        public DateTime DeliveryPeriodStart { get; set; }

        public long? DepartmentId { get; set; }

        public DateTime FirstApprovalDateTime { get; set; }

        public long? MarketSectorId { get; set; }

        public string Memorandum { get; set; }

        public int MonthPositionIndex { get; set; }

        public decimal OriginalQuantity { get; set; }

        public long? PaymentTermId { get; set; }

        public int PeriodTypeId { get; set; }

        public string PhysicalContractCode { get; set; }

        public short? PositionMonthType { get; set; }

        public short? PremiumDiscountBasis { get; set; }

        public string PremiumDiscountCurrency { get; set; }

        public decimal PremiumDiscountValue { get; set; }

        public decimal Price { get; set; }

        public short? PricingMethodId { get; set; }

        public decimal Quantity { get; set; }

        public long? SellerId { get; set; }

        public bool ShippingPeriod { get; set; }

        public long? TraderId { get; set; }

        public short? Type { get; set; }
    }
}
