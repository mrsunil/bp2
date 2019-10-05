using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.Trading.Application.Queries.Dto;
using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Trading.Entities
{
    public class TradeFavoriteDetail
    {
        public string Name { get; set; }

        public string Description { get; set; }

        [Column(Name = "Type")]
        public ContractType ContractType { get; set; }

        public long? TraderId { get; set; }

        public long? DepartmentId { get; set; }

        public string BuyerCode { get; set; }

        public string SellerCode { get; set; }

        [Column(Name = "Counterparty")]
        public string CounterpartyReference { get; set; }

        public long CommodityId { get; set; }

        public decimal Quantity { get; set; }

        public long WeightUnitId { get; set; }

        public string PortOriginCode { get; set; }

        public string PortDestinationCode { get; set; }

        public PositionMonthType PositionMonthType { get; set; }

        public decimal Price { get; set; }

        [Column(Name = "CurrencyCode")]
        public string Currency { get; set; }

        public int CropYear { get; set; }

        [Column(Name = "PricingMethodId")]
        public PricingMethod PricingMethod { get; set; }

        public string PaymentTermCode { get; set; }

        public string ContractTermCode { get; set; }

        public string ContractTermLocationCode { get; set; }

        public long PriceUnitId { get; set; }

        public string ArbitrationCode { get; set; }

        public int? MarketSectorId { get; set; }

        public decimal ContractedValue { get; set; }

        public IEnumerable<CostDto> Costs { get; set; }

        public DateTime? DeliveryPeriodStartDate { get; set; }

        public DateTime? DeliveryPeriodEndDate { get; set; }

        public string ShippingPeriod { get; set; }

        public int PeriodTypeId { get; set; }

        public long ContractTermId { get; set; }

        public long BuyerId { get; set; }

        public long SellerId { get; set; }

        public long ArbitrationId { get; set; }

        public long PaymentTermsId { get; set; }

        public long? OriginPortId { get; set; }

        public long? DestinationPortId { get; set; }

        public long? ContractTermLocationId { get; set; }

        public string Memorandum { get; set; }

        public decimal PremiumDiscountValue { get; set; }
    }
}
