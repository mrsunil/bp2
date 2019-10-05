using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.PreAccounting.Entities
{
    public class SectionSearchResult
    {
      
            public int DataVersionId { get; set; }

            public string CompanyId { get; set; }

            public DateTime CreatedDateTime { get; set; }

            public string PhysicalContractCode { get; set; }

            public string ContractLabel { get; set; }

            public string ParentContractLabel { get; set; }

            public long SectionId { get; set; }

            public DateTime ContractDate { get; set; }

            public DateTime? BLDate { get; set; }

            public string TraderDisplayName { get; set; }

            public string Status { get; set; }

            public string DepartmentCode { get; set; }

            public string DepartmentDescription { get; set; }

            public decimal? Price { get; set; }

            public string PriceCode { get; set; }

            public string PriceUnitDescription { get; set; }

            public decimal? Quantity { get; set; }

            public string WeightUnitCode { get; set; }

            public string WeightUnitDescription { get; set; }

            public decimal? ContractQuantity { get; set; }

            public string CurrencyCode { get; set; }

            public string CurrencyDescription { get; set; }

            public string Commodity1 { get; set; }

            public string Commodity2 { get; set; }

            public string Commodity3 { get; set; }

            public string Commodity4 { get; set; }

            public string Commodity5 { get; set; }

            public string ContractTermCode { get; set; }

            public string ContractTermDescription { get; set; }

            public string ContractTermLocationPortCode { get; set; }

            public string ContractTermLocationDescription { get; set; }

            public string PaymentTermCode { get; set; }

            public string PaymentTermDescription { get; set; }

            public DateTime? PositionMonth { get; set; }

            public string SellerCode { get; set; }

            public string SellerDescription { get; set; }

            public string BuyerCode { get; set; }

            public string BuyerDescription { get; set; }

            public string Counterparty { get; set; }

            public DateTime? DeliveryPeriodStart { get; set; }

            public DateTime? DeliveryPeriodEnd { get; set; }

            public string CharterReference { get; set; }

            public string CharterDescription { get; set; }

            public string AllocatedContractReference { get; set; }

            public DateTime? AllocatedDateTime { get; set; }

            public bool Amended { get; set; }

            public string ContractType { get; set; }

            public string CreatedBy { get; set; }

            public long CommodityId { get; set; }

            public decimal? OriginalQuantity { get; set; }

            public decimal? ContractValue { get; set; }

            public string Memo { get; set; }

            public string CommodityDescription { get; set; }

            public string CropYear { get; set; }

            public string ArbitrationCode { get; set; }

            public string ArbitrationDescription { get; set; }

            public string PeriodType { get; set; }

            public string PositionType { get; set; }

            public string PortOfOrigin { get; set; }

            public string PortOfOriginDescription { get; set; }

            public string PortOfDestination { get; set; }

            public string PortOfDestinationDescription { get; set; }

            public long? GroupingNumber { get; set; }

            public string MainInvoiceReference { get; set; }

            public DateTime? MainInvoiceDate { get; set; }

            public decimal? PercentageInvoiced { get; set; }

            public string QuantityCodeInvoiced { get; set; }

            public decimal? InvoiceValue { get; set; }

            public DateTime? PaymentDate { get; set; }

            public string OtherReference { get; set; }

            public decimal? QuantityInvoiced { get; set; }

            public string InvoicingStatus { get; set; }

            public string AmendedBy { get; set; }

            public DateTime? AmendedOn { get; set; }

            public string VesselName { get; set; }

            public string BLReference { get; set; }

            public string CharterManager { get; set; }

            public string CounterpartyRef { get; set; }

            public DateTime? ContractIssuedOn { get; set; }

            public string ShipmentPeriod { get; set; }

            public string IsTradeClosed { get; set; }

            public string IsTradeCancelled { get; set; }

            public string ContractInvoiceType { get; set; }

            public DateTime? ContractSentDate { get; set; }

            public DateTime? ContractReturnedDate { get; set; }

            public DateTime? LastEmailReceivedDate { get; set; }
        }
    }




