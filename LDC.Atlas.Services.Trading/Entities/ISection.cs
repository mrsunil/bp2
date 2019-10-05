using System;
using System.Collections.Generic;

namespace LDC.Atlas.Services.Trading.Entities
{
    public interface ISection
    {
        long? AllocatedToId { get; set; }

        SectionReference AllocatedTo { get; set; } // TODO: change type

        DateTime? AllocationDate { get; set; }

        string Arbitration { get; set; }

        string AssignedCharterReference { get; set; }

        DateTime? BlDate { get; set; }

        string BuyerCode { get; set; }

        DateTime? CharterAssignmentDate { get; set; }

        IEnumerable<SectionDeprecated> ChildSections { get; set; }

        long CommodityId { get; set; }

        long ContractId { get; set; }

        string ContractLabel { get; set; }

        string ContractLabelOrigin { get; set; }

        string ContractTerms { get; set; }

        string ContractTermsLocation { get; set; }

        ContractType ContractType { get; set; }

        IEnumerable<Cost> Costs { get; set; }

        string CreatedBy { get; set; }

        DateTime? CreationDate { get; set; }

        int? CropYear { get; set; }

        string Currency { get; set; }

        DateTime DeliveryPeriodEndDate { get; set; }

        DateTime DeliveryPeriodStartDate { get; set; }

        long? DepartmentId { get; set; }

        bool FinalInvoiceRequired { get; set; }

        DateTime? FirstApprovalTime { get; set; }

        Trade<ISection> Header { get; set; }

        string LastModifiedBy { get; set; }

        DateTime? LastModifiedDate { get; set; }

        int MarketSectorId { get; set; }

        decimal OriginalQuantity { get; set; }

        string PaymentTerms { get; set; }

        string PeriodType { get; set; }

        int PeriodTypeId { get; set; }

        string PortOfDestination { get; set; }

        string PortOfOrigin { get; set; }

        int PositionMonthIndex { get; set; }

        PositionMonthType PositionMonthType { get; set; }

        decimal Price { get; set; }

        long PriceUnitId { get; set; }

        PricingMethod PricingMethod { get; set; }

        decimal Quantity { get; set; }

        long WeightUnitId { get; set; }

        long SectionId { get; set; }

        string SectionNumber { get; set; }

        int SectionOriginId { get; set; }

        string SellerCode { get; set; }

        ContractStatus Status { get; set; }

        decimal PremiumDiscount { get; set; }

        decimal ContractedValue { get; set; }

        string CounterpartyReference { get; set; }

        string Memorandum { get; set; }

        long SectionTypeId { get; set; }

        string GetReference();

        bool IsAllocated();
    }
}