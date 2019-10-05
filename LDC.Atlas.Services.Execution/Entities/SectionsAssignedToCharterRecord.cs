using System;

namespace LDC.Atlas.Services.Execution.Entities
{
    public class SectionsAssignedToCharterRecord
    {
        public string SectionId { get; set; }

        public string ContractLabel { get; set; }

        public ContractType ContractType { get; set; }

        public string BuyerCode { get; set; }

        public string SellerCode { get; set; }

        public double Quantity { get; set; }

        public string QuantityUnit { get; set; }

        public string CommodityCode { get; set; }

        public string AllocatedTo { get; set; }

        public DateTime? BlDate { get; set; }

        public string Price { get; set; }

        public string PriceCode { get; set; }

        public string Currency { get; set; }

        public string Department { get; set; }

        public string CharterRef { get; set; }

        public string CharterAssignmentDate { get; set; }

        public string BLRef { get; set; }

        public string Counterparty { get; set; }

        public string Vessel { get; set; }

        public string PortOrigin { get; set; }

        public string PortDestination { get; set; }

        public string ShippingStatusCode { get; set; }

        public string GroupNumber { get; set; }

        public bool? RemoveSectionTrafficInfo { get; set; }

        public InvoicingStatus InvoicingStatus { get; set; }

        public DateTime? ContractBlDate { get; set; }
    }
}
