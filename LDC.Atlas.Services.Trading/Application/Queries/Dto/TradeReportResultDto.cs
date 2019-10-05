using LDC.Atlas.Application.Core.Entities;
using System;

namespace LDC.Atlas.Services.Trading.Application.Queries.Dto
{
    public class TradeReportResultDto : PaginatedItem
    {
        public string ContractSectionCode { get; set; }

        public string ContractType { get; set; }

        public string CounterParty { get; set; }

        public string Cmy { get; set; }

        public string Cmy2 { get; set; }

        public string Cmy3 { get; set; }

        public string Cmy4 { get; set; }

        public string Cmy5 { get; set; }

        public decimal? Quantity { get; set; }

        public string QuantityCode { get; set; }

        public string CharterReference { get; set; }

        public DateTime? BLDate { get; set; }

        public string AllocatedTo { get; set; }

        public string ContractTerms { get; set; }

        public string ContractTermsPort { get; set; }

        public string PriceCode { get; set; }

        public string Currency { get; set; }

        public decimal? Price { get; set; }

        public string PaymentTerm { get; set; }

        public DateTime? ShippingPeriodFrom { get; set; }

        public DateTime? ShippingPeriodTo { get; set; }

        public decimal? ContractValue { get; set; }

        public bool Amended { get; set; }

        public string ApprovalStatus { get; set; }

        public string ApprovedBy { get; set; }

        public DateTime? ApprovedDate { get; set; }

        public string ArbitrationCode { get; set; }

        public string BLReference { get; set; }

        public string BuyerCode { get; set; }

        public DateTime? CharterAssignedOn { get; set; }

        public string CharterManager { get; set; }

        public string CommodityDescription { get; set; }

        public DateTime ContractDate { get; set; }

        public string ContractTermsAllocatedTo { get; set; }

        public string CounterPartyName { get; set; }

        public string CounterPartyReferenceAllocatedTo { get; set; }

        public string CreatedBy { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public int CropYear { get; set; }

        public string CurrencyCode { get; set; }

        public string DepartmentName { get; set; }

        public int DepartmentId { get; set; }

        public decimal PremiumDiscountValue { get; set; }

        public string PremiumDiscountCurrency { get; set; }

        public string PremiumDiscountType { get; set; }

        public string EstimatedMaturityDate { get; set; }

        public decimal GroupNumber { get; set; }

        public DateTime? InvoicedOn { get; set; }

        public decimal InvoicedValue { get; set; }

        public string DocumentReference { get; set; }

        public string MarketSector { get; set; }

        public string TradeStatus { get; set; }

        public string Parent { get; set; }

        public string PortOfDestination { get; set; }

        public string PortOfOrigin { get; set; }

        public string PricingMethod { get; set; }

        public string InvoicedQuantityCode { get; set; }

        public string SellerCode { get; set; }

        public string TraderCode { get; set; }

        public string Vessel { get; set; }

        public int? DataVersionId { get; set; }

        public long SectionId { get; set; }

        public decimal InvoicePercent { get; set; }

        public DateTime? AllocatedDateTime { get; set; }

        public string PeriodType { get; set; }

        public DateTime? PositionMonth { get; set; }

        public int PositionMonthType { get; set; }

        public string CompanyId { get; set; }

        public string CompanyName { get; set; }

        public DateTime? FreezeDate { get; set; }

        public string DatabaseType { get; set; }

        public decimal InvoicedQuantity { get; set; }

        public string ExecutedStatus { get; set; }

        public string AmendedBy { get; set; }

        public DateTime? AmendedOn { get; set; }

        public string Province { get; set; }

        public string BranchCode { get; set; }
    }
}
