using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.Trading.Entities;
using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Trading.Application.Queries.Dto
{
    public class SectionDto
    {
        public int? DataVersionId { get; set; }

        [Column(Name = "Type")]
        public ContractType ContractType { get; set; }

        public string ContractLabel { get; set; }

        public long SectionId { get; set; }

        [Column(Name = "PhysicalContractId")]
        public long ContractId { get; set; }

        [Column(Name = "SectionNumberId")]
        public string SectionNumber { get; set; }

        [Column(Name = "ContractStatusCode")]
        public ContractStatus Status { get; set; }

        public DateTime? FirstApprovalDateTime { get; set; }

        public DateTime? ApprovalDateTime { get; set; }

        public long? LastApprovedBy { get; set; }

        public long DepartmentId { get; set; }

        public string BuyerCode { get; set; }

        public string BuyerDescription { get; set; }

        public string CharterDescription { get; set; }

        public string SellerDescription { get; set; }

        public string PaymentTermDescription { get; set; }

        public string ContractTermLocationDescription { get; set; }

        public string CurrencyDescription { get; set; }

        public string WeightUnitDescription { get; set; }

        public string PriceUnitDescription { get; set; }

        public string TraderDisplayName { get; set; }

        public string CompanyId { get; set; }

        public string ContractTermDescription { get; set; }

        public string SellerCode { get; set; }

        [Column(Name = "Counterparty")]
        public string CounterpartyReference { get; set; }

        public long CommodityId { get; set; }

        public decimal Quantity { get; set; }

        public decimal OriginalQuantity { get; set; }

        public long WeightUnitId { get; set; }

        public decimal? ToleranceMin { get; set; }

        public decimal? ToleranceMax { get; set; }

        public string PortOriginCode { get; set; }

        public string PortDestinationCode { get; set; }

        public PositionMonthType PositionMonthType { get; set; }

        [Column(Name = "MonthPositionIndex")]
        public int PositionMonthIndex { get; set; }

        public decimal Price { get; set; }

        [Column(Name = "CurrencyCode")]
        public string Currency { get; set; }

        public DateTime? BlDate { get; set; }

        [Column(Name = "AllocatedTo")]
        public long? AllocatedToId { get; set; }

        public SectionReferenceDto AllocatedTo { get; set; }

        public DateTime? AllocationDate { get; set; }

        [Column(Name = "Charter")]
        public string AssignedCharterReference { get; set; }

        public DateTime? CharterAssignmentDate { get; set; }

        [Column(Name = "CreatedDateTime")]
        public DateTime? CreationDate { get; set; }

        [Column(Name = "ModifiedBy")]
        public string LastModifiedBy { get; set; }

        [Column(Name = "ModifiedDateTime")]
        public DateTime? LastModifiedDate { get; set; }

        public TradeDto Header { get; set; }

        public int? ProductVariationId { get; set; }

        public bool FinalInvoiceRequired { get; set; }

        public int SectionOriginId { get; set; }

        public string ContractLabelOrigin { get; set; }

        public int CropYear { get; set; }

        public string PackingCode { get; set; }

        // -- Pricing
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

        [Column(Name = "MarketZoneCode")]
        public string MarketZone { get; set; }

        public int? PremiumDiscountTypeId { get; set; }

        public decimal PremiumDiscountValue { get; set; }

        public string PremiumDiscountCurrency { get; set; }

        public int PremiumDiscountBasis { get; set; }

        public decimal ContractedValue { get; set; }

        public int PacksNumber { get; set; }

        public string Memorandum { get; set; }

        public long SectionTypeId { get; set; }

        public IEnumerable<SectionDto> ChildSections { get; set; }

        public IEnumerable<CostDto> Costs { get; set; }

        public string PortOfOrigin { get; set; }

        public string PortOfDestination { get; set; }

        [Column(Name = "DeliveryPeriodStart")]
        public DateTime? DeliveryPeriodStartDate { get; set; }

        [Column(Name = "DeliveryPeriodEnd")]
        public DateTime? DeliveryPeriodEndDate { get; set; }

        public string ContractTerms { get; set; }

        public string ContractTermsLocation { get; set; }

        public string PeriodType { get; set; }

        public string PaymentTerms { get; set; }

        public int? CropYearTo { get; set; }

        public string Arbitration { get; set; }

        public DateTime? PositionMonth { get; set; }

        public int? CharterId { get; set; }

        public int? CharterStatusId { get; set; }

        public string InvoiceReference { get; set; }

        public string OtherReference { get; set; }

        public string ShippingPeriod { get; set; }

        public int PeriodTypeId { get; set; }

        public int? InvoicingStatusId { get; set; }

        public int InvoiceTypeId { get; set; }

        public int InvoicePostingStatusId { get; set; }

        public DateTime? LastDocumentIssuedDate { get; set; }

        public bool IsInterCo { get; set; }

        public DateTime? ContractSentDate { get; set; }

        public DateTime? LastEmailReceivedDate { get; set; }

        public DateTime? ContractReturnedDate { get; set; }

        public bool IsClosed { get; set; }

        public bool IsCancelled { get; set; }

        public string CurrencyCode => Currency;

        public ContractInvoiceType ContractInvoiceTypeId { get; set; }

        public DateTime? InvoiceDate { get; set; }

        public decimal? TotalInvoiceQuantity { get; set; }

        public decimal? TotalInvoiceValue { get; set; }

        public decimal? TotalInvoicePercent { get; set; }

        public string PrincipalCommodity { get; set; }

        public string Part2 { get; set; }

        public string Part3 { get; set; }

        public string Part4 { get; set; }

        public string Part5 { get; set; }

        public long Counterparty { get; set; }

        public string CharterCode { get; set; }

        public long ContractTermId { get; set; }

        public string ContractSectionCode { get; set; }

        public bool IsAllocated()
        {
            return AllocatedTo != null;
        }

        public DateTime? EstimatedMaturityDate { get; set; }
    }
}