using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.Trading.Entities;
using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Trading.Application.Queries.Dto
{
    public class TradeFavoriteDetailDto
    {
        [Column(Name = "Type")]
        public ContractType ContractType { get; set; }

        public long TraderId { get; set; }

        public long DepartmentId { get; set; }

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

        public string PeriodTypeCode { get; set; }

        public long PriceUnitId { get; set; }

        public string PriceCode { get; set; }

        public string ArbitrationCode { get; set; }

        public int MarketSectorId { get; set; }

        public int? PremiumDiscountTypeId { get; set; }

        public decimal PremiumDiscountValue { get; set; }

        public string PremiumDiscountCurrency { get; set; }

        public int PremiumDiscountBasis { get; set; }

        public decimal ContractedValue { get; set; }

        public string Memorandum { get; set; }

        public IEnumerable<CostDto> Costs { get; set; }

        public string PortOfOrigin { get; set; }

        public string PortOfDestination { get; set; }

        public DateTime? DeliveryPeriodStartDate { get; set; }

        public DateTime? DeliveryPeriodEndDate { get; set; }

        public string ContractTerms { get; set; }

        public string ContractTermsLocation { get; set; }

        public string PeriodType { get; set; }

        public string PaymentTerms { get; set; }

        public int? CropYearTo { get; set; }

        public string Arbitration { get; set; }

        public DateTime? PositionMonth { get; set; }

        public string ShippingPeriod { get; set; }

        public int PeriodTypeId { get; set; }
    }
}
