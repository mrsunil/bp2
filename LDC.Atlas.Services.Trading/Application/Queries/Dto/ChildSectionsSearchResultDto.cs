using LDC.Atlas.Services.Trading.Entities;
using System;

namespace LDC.Atlas.Services.Trading.Application.Queries.Dto
{
    public class ChildSectionsSearchResultDto
    {
        public int SectionOriginId { get; set; }

        public int SectionId { get; set; }

        public string ContractLabel { get; set; }

        public string Status { get; set; }

        public DateTime? BlDate { get; set; }

        public string AllocatedTo { get; set; }

        public string AssignedCharterReference { get; set; }

        public string Department { get; set; }

        public string DepartmentCode { get; set; }

        public string CounterpartyReference { get; set; }

        public string Counterparty { get; set; }

        public string ContractTerm { get; set; }

        public string ContractTermsLocation { get; set; }

        public string CommodityCode { get; set; }

        public string CommodityOrigin { get; set; }

        public string CommodityGrade { get; set; }

        public string CommodityLvl4 { get; set; }

        public string CommodityLvl5 { get; set; }

        public string WeightUnit { get; set; }

        public decimal Quantity { get; set; }

        public string Currency { get; set; }

        public string PriceUnit { get; set; }

        public decimal Price { get; set; }

        public string PaymentTerm { get; set; }

        public DateTime? DeliveryPeriodStartDate { get; set; }

        public int PositionMonthIndex { get; set; }

        public DateTime? ContractDate { get; set; }

        public string PricingMethod { get; set; }

        public string LastModifiedBy { get; set; }

        public long PhysicalContractId { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public ContractType ContractType { get; set; }

        public long ContractId { get; set; }

        public string SectionNumber { get; set; }

        public DateTime? FirstApprovalDateTime { get; set; }

        public long DepartmentId { get; set; }

        public string BuyerCode { get; set; }

        public string SellerCode { get; set; }

        public long CommodityId { get; set; }

        public decimal OriginalQuantity { get; set; }

        public long WeightUnitId { get; set; }

        public string PortOriginCode { get; set; }

        public string PortDestinationCode { get; set; }

        public PositionMonthType PositionMonthType { get; set; }

        public DateTime? AllocationDate { get; set; }

        public DateTime? CharterAssignmentDate { get; set; }

        public DateTime? CreationDate { get; set; }

        public DateTime? LastModifiedDate { get; set; }

        public int? CropYear { get; set; }

        public string PackingCode { get; set; }

        public string PaymentTermCode { get; set; }

        public string ContractTermCode { get; set; }

        public string PeriodTypeCode { get; set; }

        public long PriceUnitId { get; set; }

        public string PriceCode { get; set; }

        public string ArbitrationCode { get; set; }

        public int? PremiumDiscountTypeId { get; set; }

        public decimal PremiumDiscountValue { get; set; }

        public string PremiumDiscountCurrency { get; set; }

        public int PremiumDiscountBasis { get; set; }

        public decimal ContractedValue { get; set; }

        public long SectionTypeId { get; set; }

        public string PortOfOrigin { get; set; }

        public string PortOfDestination { get; set; }

        public DateTime? DeliveryPeriodEndDate { get; set; }

        public string ContractTerms { get; set; }

        public string PeriodType { get; set; }

        public string PaymentTerms { get; set; }

        public int? CropYearTo { get; set; }

        public string Arbitration { get; set; }

        public DateTime? PositionMonth { get; set; }

        public int? CharterId { get; set; }

        public string InvoiceReference { get; set; }

        public string OtherReference { get; set; }

        public string ShippingPeriod { get; set; }

        public int PeriodTypeId { get; set; }

        public int? InvoicingStatusId { get; set; }

        public int InvoiceTypeId { get; set; }

        public DateTime? LastDocumentIssuedDate { get; set; }

        public decimal? ContractValue { get; set; }

        public string Memo { get; set; }

        public string CommodityDescription { get; set; }

        public string ArbitrationDescription { get; set; }

        public string PositionType { get; set; }

        public string PortOfOriginDescription { get; set; }

        public string PortOfDestinationDescription { get; set; }

        public long? GroupingNumber { get; set; }

        public string MainInvoiceReference { get; set; }

        public DateTime? MainInvoiceDate { get; set; }

        public decimal? PercentageInvoiced { get; set; }

        public string QuantityCodeInvoiced { get; set; }

        public decimal? InvoiceValue { get; set; }

        public DateTime? PaymentDate { get; set; }

        public decimal? QuantityInvoiced { get; set; }

        public string InvoicingStatus { get; set; }

        public string AmendedBy { get; set; }

        public DateTime? AmendedOn { get; set; }

        public string VesselName { get; set; }

        public string BLReference { get; set; }

        public string CharterManager { get; set; }

        public string CounterpartyRef { get; set; }

        public DateTime? ContractIssuedOn { get; set; }

        public string ContractTypeCode { get; set; }

        public int AllocatedSectionId { get; set; }

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

        public bool IsAllocated()
        {
            return AllocatedTo != null;
        }
    }
}
