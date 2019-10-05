using LDC.Atlas.Services.Execution.Entities;
using System;

namespace LDC.Atlas.Services.Execution.Application.Queries.Dto
{
    public class SectionAssignedToCharterDto
    {
        public string SectionId { get; set; }

        public string ContractLabel { get; set; }

        public ContractType ContractType { get; set; }

        public string BuyerCode { get; set; }

        public string SellerCode { get; set; }

        public double Quantity { get; set; }

        public long WeightUnitId { get; set; }

        public long CommodityId { get; set; }

        public long DepartmentId { get; set; }

        public string AllocatedTo { get; set; }

        public DateTime? BlDate { get; set; }

        public DateTime? ContractBlDate { get; set; }

        public string Price { get; set; }

        public long PriceUnitId { get; set; }

        public string Currency { get; set; }

        public string CharterRef { get; set; }

        public DateTime? AssignmentDate { get; set; }

        public string Counterparty { get; set; }

        public string InvoiceRef { get; set; }

        public long PricingMethodId { get; set; }

        public ContractStatus ContractStatusCode { get; set; }

        public string CreatedBy { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public DateTime? ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public string PaymentTermCode { get; set; }

        public string Vessel { get; set; }

        public string GroupNumber { get; set; }

        public string PortOrigin { get; set; }

        public string PortDestination { get; set; }

        public string BlRef { get; set; }

        public string ShipmentPeriod { get; set; }

        public InvoicingStatus InvoicingStatus { get; set; }

        public string AllocatedToSectionId { get; set; }

        public DateTime? AllocatedDateTime { get; set; }

        public string AmendedBy { get; set; }

        public DateTime? AmendedOn { get; set; }

        public string ArbitrationCode { get; set; }

        public string ArbitrationDescription { get; set; }

        public string BuyerDescription { get; set; }

        public string Commodity1 { get; set; }

        public string Commodity2 { get; set; }

        public string Commodity3 { get; set; }

        public string Commodity4 { get; set; }

        public string Commodity5 { get; set; }

        public string CommodityDescription { get; set; }

        public string CompanyId { get; set; }

        public DateTime? ContractIssuedOn { get; set; }

        public double ContractQuantity { get; set; }

        public string ContractTermCode { get; set; }

        public string ContractTermDescription { get; set; }

        public string ContractTermLocationPortCode { get; set; }

        public string ContractTermLocationDescription { get; set; }

        public decimal? ContractValue { get; set; }

        public string CounterpartyRef { get; set; }

        public DateTime ContractDate { get; set; }

        public int? CropYear { get; set; }

        public string CurrencyDescription { get; set; }

        public int DataVersionId { get; set; }

        public DateTime? DeliveryPeriodStart { get; set; }

        public DateTime? DeliveryPeriodEnd { get; set; }

        public string DepartmentCode { get; set; }

        public string DepartmentDescription { get; set; }

        public long? GroupingNumber { get; set; }

        public string DisplayContractType { get; set; }

        public string DisplayInvoicingStatus { get; set; }

        public string OtherReference { get; set; }

        public string ParentContractLabel { get; set; }

        public DateTime? PaymentDate { get; set; }

        public string PaymentTermDescription { get; set; }

        public decimal? PercentageInvoiced { get; set; }

        public decimal? InvoiceValue { get; set; }

        public string MainInvoiceReference { get; set; }

        public DateTime? MainInvoiceDate { get; set; }

        public string Memo { get; set; }

        public string PeriodType { get; set; }

        public string PhysicalContractCode { get; set; }

        public string PortOfOrigin { get; set; }

        public string PortOfOriginDescription { get; set; }

        public string PortOfDestination { get; set; }

        public string PortOfDestinationDescription { get; set; }

        public string PositionType { get; set; }

        public DateTime? PositionMonth { get; set; }

        public decimal? OriginalQuantity { get; set; }

        public string PriceCode { get; set; }

        public string PriceUnitDescription { get; set; }

        public string QuantityCodeInvoiced { get; set; }

        public decimal? QuantityInvoiced { get; set; }

        public string SellerDescription { get; set; }

        public string TraderDisplayName { get; set; }

        public string VesselName { get; set; }

        public string WeightUnitCode { get; set; }

        public string WeightUnitDescription { get; set; }

        public string PrincipalCommodity { get; set; }

        public string Part2 { get; set; }

        public string Part3 { get; set; }

        public string WeightCode { get; set; }

    }
}
