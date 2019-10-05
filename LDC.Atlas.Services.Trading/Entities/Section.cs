using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.Trading.Application.Queries.Dto;
using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Trading.Entities
{
    public class Section
    {
        public long SectionId { get; set; }

        public long PhysicalContractId { get; set; }

        public long? DataVersionId { get; set; }

        public string SectionNumberId { get; set; }

        public ContractStatus ContractStatusCode { get; set; }

        public string CompanyId { get; set; }

        public string ContractLabel { get; set; }

        public string ContractReference { get; set; }

        public DateTime ContractDate { get; set; }

        public ContractStatus Status { get; set; }

        public DateTime? FirstApprovalDateTime { get; set; }

        public decimal Price { get; set; }

        public DateTime? BlDate { get; set; }

        public string BLReference { get; set; }

        public string VesselCode { get; set; }

        public long? DepartmentId { get; set; }

        public string BuyerCode { get; set; }

        public string SellerCode { get; set; }

        public long? CommodityId { get; set; }

        public long? WeightUnitId { get; set; }

        public decimal Quantity { get; set; }

        public string PortOriginCode { get; set; }

        public string PortDestinationCode { get; set; }

        public long? OriginPortId { get; set; }

        public long? DestinationPortId { get; set; }

        public PositionMonthType PositionMonthType { get; set; }

        public int MonthPositionIndex { get; set; }

        [Column(Name = "AllocatedTo")]
        public long? AllocatedToId { get; set; }

        public SectionReferenceDto AllocatedTo { get; set; }

        public DateTime? AllocationDate { get; set; }

        public DateTime? PositionMonth { get; set; }

        [Column(Name = "DeliveryPeriodStart")]
        public DateTime? DeliveryPeriodStartDate { get; set; }

        [Column(Name = "DeliveryPeriodEnd")]
        public DateTime? DeliveryPeriodEndDate { get; set; }

        public string ShippingPeriod { get; set; }

        public string Charter { get; set; }

        public DateTime? CharterAssignmentDate { get; set; }

        public long SectionOriginId { get; set; }

        public decimal? OriginalQuantity { get; set; }

        public int? CropYear { get; set; }

        public int? CropYearTo { get; set; }

        public string ContractTermCode { get; set; }

        public string ContractTermLocationCode { get; set; }

        public long? ContractTermLocationId { get; set; }

        public string PeriodTypeCode { get; set; }

        public PricingMethod PricingMethodId { get; set; }

        public string PaymentTermCode { get; set; }

        public string CurrencyCode { get; set; }

        public string Currency { get; set; }

        public long? PriceUnitId { get; set; }

        public decimal ContractedValue { get; set; }

        public string ArbitrationCode { get; set; }

        public int? MarketSectorId { get; set; }

        public string ContractLabelOrigin { get; set; }

        public decimal PremiumDiscountValue { get; set; }

        public string PremiumDiscountCurrency { get; set; }

        public DiscountType? PremiumDiscountType { get; set; }

        public DiscountBasis PremiumDiscountBasis { get; set; }

        public long CharterManagerId { get; set; }

        public long? CharterId { get; set; }

        public long SectionType { get; set; }

        public string InvoiceReference { get; set; }

        public string OtherReference { get; set; }

        public int? PeriodTypeId { get; set; }

        public long InvoicingStatusId { get; set; }

        public string Counterparty { get; set; }

        [Obsolete("Use ContractTermCode")]
        public string ContractTerms { get; set; }

        [Obsolete("Use ContractTermLocationCode")]
        public string ContractTermsLocation { get; set; }

        [Obsolete("Use PortOriginCode")]
        public string PortOfOrigin { get; set; }

        [Obsolete("Use PortDestinationCode")]
        public string PortOfDestination { get; set; }

        [Obsolete("Use MonthPositionIndex")]
        public int PositionMonthIndex { get; set; }

        [Obsolete("Use ArbitrationCode")]
        public string Arbitration { get; set; }

        [Obsolete("Use PricingMethodId")]
        public PricingMethod PricingMethod { get; set; }

        [Obsolete("Use PaymentTermCode")]
        public string PaymentTerms { get; set; }

        [Obsolete("Use Counterparty")]
        public string CounterpartyReference { get; set; }

        public string Memorandum { get; set; }

        [Obsolete("Use PremiumDiscountType")]
        public DiscountType? DiscountPremiumType { get; set; }

        [Obsolete("Use PremiumDiscountBasis")]
        public DiscountBasis? DiscountPremiumBasis { get; set; }

        [Obsolete("Use PremiumDiscountCurrency")]
        public string DiscountPremiumCurrency { get; set; }

        [Obsolete("Use PremiumDiscountValue")]
        public decimal? DiscountPremiumValue { get; set; }

        [Obsolete("Use SectionNumberId")]
        public string SectionNumber { get; set; }

        public bool IsBLDateChanged { get; set; }

        public bool FinalInvoiceRequired { get; set; }

        public IEnumerable<Cost> Costs { get; set; }

        public IEnumerable<Section> ChildrenSections { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        // ---------------------------
        // PhysicalContract properties
        // ---------------------------
        public ContractType Type { get; set; }

        public long? TraderId { get; set; }

        public DateTime? LastDocumentIssuedDate { get; set; }

        public int? NumberOfContract { get; set; }

        public bool IsCommodityChanged { get; set; }

        public bool IsPortOfOriginChanged { get; set; }

        public bool IsPortOfDestinationChanged { get; set; }

        public bool IsSplitCreated { get; set; }

        public DateTime? EstimatedMaturityDate { get; set; }

        public DateTime? InvoiceDate { get; set; }

        public bool IsInterco { get; set; }

        public ContractType IntercoContractType { get; set; }

        public string IntercoCompanyId { get; set; } // internal to avoid the exposure in Swagger

        public string IntercoBuyerCode { get; set; }

        public string IntercoSellerCode { get; set; }

        public long? IntercoDepartmentId { get; set; }

        public long? IntercoTraderId { get; set; }

        public bool IsRemoveInterco { get; set; }

        public IEnumerable<Cost> IntercoCosts { get; set; }

        public decimal PaymentTermsId { get; set; }

        public decimal ContractTermId { get; set; }

        public decimal BuyerId { get; set; }

        public decimal SellerId { get; set; }

        public decimal ArbitrationId { get; set; }

        public DateTime? ContractSentDate { get; set; }

        public DateTime? LastEmailReceivedDate { get; set; }

        public DateTime? ContractReturnedDate { get; set; }

        public bool IsClosed { get; set; }

        public bool IsCancelled { get; set; }

        public long? ProvinceId { get; set; }

        public long? BranchId { get; set; }

        public ContractInvoiceType ContractInvoiceTypeId { get; set; }

    }

    public class PhysicalContract
    {
        public long PhysicalContractId { get; set; }

        public int DataVersionId { get; set; }

        public ContractType Type { get; set; }

        public DateTime ContractDate { get; set; }

        public long? TraderId { get; set; }

        public decimal ContractQuantity { get; set; }

        public int PhysicalContractNumberId { get; set; }

        public string CompanyId { get; set; }

        public string PhysicalContractCode { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }
    }

    public class ReferenceInternalMemo
    {
        public long? PhysicalContractInterCoId { get; set; }

        public long? DataVersionId { get; set; }

        public long? PhysicalContractId { get; set; }

        public string CounterpartRef { get; set; }

        public string Memorandum { get; set; }

        public long? LinkedDataVersionId { get; set; }

        public long? LinkedPhysicalContractId { get; set; }

        public string LinkedCounterpartRef { get; set; }

        public string LinkedMemorandum { get; set; }

        public int? InterCoTypeId { get; set; }
    }
}