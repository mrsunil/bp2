using LDC.Atlas.DataAccess.DapperMapper;
using System;
using System.Collections.Generic;
using System.Globalization;

namespace LDC.Atlas.Services.Trading.Entities
{
    [Obsolete("Use Section")]
    public class SectionDeprecated : ISection
    {
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

        [Column(Name = "FirstApprovalDateTime")]
        public DateTime? FirstApprovalTime { get; set; }

        public long? DepartmentId { get; set; }

        public string BuyerCode { get; set; }

        public string SellerCode { get; set; }

        [Column(Name = "Counterparty")]
        public string CounterpartyReference { get; set; }

        public long CommodityId { get; set; }

        public decimal Quantity { get; set; }

        public decimal OriginalQuantity { get; set; }

        public long WeightUnitId { get; set; }

        [Column(Name = "PortOriginCode")]
        public string PortOfOrigin { get; set; }

        [Column(Name = "PortDestinationCode")]
        public string PortOfDestination { get; set; }

        [Column(Name = "DeliveryPeriodStart")]
        public DateTime DeliveryPeriodStartDate { get; set; }

        [Column(Name = "DeliveryPeriodEnd")]
        public DateTime DeliveryPeriodEndDate { get; set; }

        public PositionMonthType PositionMonthType { get; set; }

        [Column(Name = "MonthPositionIndex")]
        public int PositionMonthIndex { get; set; }

        public decimal Price { get; set; }

        [Column(Name = "CurrencyCode")]
        public string Currency { get; set; }

        [Column(Name = "BLDate")]
        public DateTime? BlDate { get; set; }

        [Column(Name = "AllocatedTo")]
        public long? AllocatedToId { get; set; }

        public SectionReference AllocatedTo { get; set; } // TODO: change type

        public DateTime? AllocationDate { get; set; }

        [Column(Name = "Charter")]
        public string AssignedCharterReference { get; set; }

        public DateTime? CharterAssignmentDate { get; set; }

        public string CreatedBy { get; set; }

        [Column(Name = "CreatedDateTime")]
        public DateTime? CreationDate { get; set; }

        [Column(Name = "ModifiedBy")]
        public string LastModifiedBy { get; set; }

        [Column(Name = "ModifiedDateTime")]
        public DateTime? LastModifiedDate { get; set; }

        public Trade<ISection> Header { get; set; }

        public bool FinalInvoiceRequired { get; set; }

        public int SectionOriginId { get; set; }

        public string ContractLabelOrigin { get; set; }

        public int? CropYear { get; set; }

        public int? CropYearTo { get; set; }

        // -- Pricing
        [Column(Name = "PricingMethodId")]
        public PricingMethod PricingMethod { get; set; }

        [Column(Name = "PaymentTermCode")]
        public string PaymentTerms { get; set; }

        [Column(Name = "ContractTermCode")]
        public string ContractTerms { get; set; }

        [Column(Name = "ContractTermLocationCode")]
        public string ContractTermsLocation { get; set; }

        [Column(Name = "PeriodTypeCode")]
        public string PeriodType { get; set; }

        public int PeriodTypeId { get; set; }

        public long PriceUnitId { get; set; }

        public long ArbitrationId { get; set; }

        [Column(Name = "ArbitrationCode")]
        public string Arbitration { get; set; }

        public int MarketSectorId { get; set; }

        public decimal PremiumDiscount { get; set; }

        public decimal ContractedValue { get; set; }

        public string Memorandum { get; set; }

        public DateTime? ContractDate { get; set; }

        public IEnumerable<SectionDeprecated> ChildSections { get; set; }

        public long SectionTypeId { get; set; }

        public IEnumerable<Cost> Costs { get; set; }

        public DateTime? PositionMonth { get; set; }

        public string OtherReference { get; set; }

        public string GetReference()
        {
            return (Header?.Type == ContractType.Purchase ? "P" : "S")
                + Header?.ContractNumber.ToString("00000", CultureInfo.InvariantCulture)
                + SectionNumber.ToString();
        }

        public bool IsAllocated()
        {
            return AllocatedTo != null;
        }

        public string VesselCode { get; set; }

        public long? ProvinceId { get; set; }

        public long? BranchId { get; set; }

        public DateTime? EstimatedMaturityDate { get; set; }
    }
}
