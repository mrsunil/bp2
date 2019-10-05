using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Queries.Dto
{
    public class SectionBulkEditDto
    {
        public string Status { get; set; }

        public long? AllocatedSectionId { get; set; }

        public long? InvoicingStatusId { get; set; }

        public string ContractType { get; set; }

        public long PhysicalContractId { get; set; }

        public long SectionId { get; set; }

        public long? SectionOriginId { get; set; }

        public string ContractLabel { get; set; }

        public DateTime? ContractDate { get; set; }

        public long UserId { get; set; }

        public long DepartmentId { get; set; }

        public long BuyerCounterpartyId { get; set; }

        public long SellerCounterpartyId { get; set; }

        public string CounterpartyReference { get; set; }

        public long CommodityId { get; set; }

        public string CropYear { get; set; }

        public long WeightUnitId { get; set; }

        public decimal Quantity { get; set; }

        public decimal? ContractQuantity { get; set; }

        public long ContractTermId { get; set; }

        public long PortTermId { get; set; }

        public long? ArbitrationId { get; set; }

        public string CurrencyCode { get; set; }

        public long PriceUnitId { get; set; }

        public decimal? ContractValue { get; set; }

        public long PaymentTermsId { get; set; }

        public decimal? ContractPrice { get; set; }

        public int? PeriodTypeId { get; set; }

        public DateTime? DeliveryPeriodStart { get; set; }

        public DateTime? DeliveryPeriodEnd { get; set; }

        public DateTime? PositionMonth { get; set; }

        public short PositionMonthType { get; set; }

        public int MonthPositionIndex { get; set; }

        public long? PortOriginId { get; set; }

        public long? PortDestinationId { get; set; }

        public long? BusinessSectorId { get; set; }

        public short? PremiumDiscountBasis { get; set; }

        public string PremiumDiscountCurrency { get; set; }

        public short? PremiumDiscountTypeId { get; set; }

        public decimal PremiumDiscountValue { get; set; }

        public string Memorandum { get; set; }

        public DateTime? ContractIssuedDate { get; set; }

        public string OtherReference { get; set; }

        public long? VesselId { get; set; }

        public DateTime? BLDate { get; set; }

        public string BLReference { get; set; }

        public long? CharterId { get; set; }

        public bool? IsBlDateUpdatable { get; set; }

        public long? AllocatedInvoiceStatus { get; set; }

        public DateTime? ContractSentDate { get; set; }

        public DateTime? LastEmailReceivedDate { get; set; }

        public DateTime? ContractReturnedDate { get; set; }

        public bool IsCancelled { get; set; }

        public bool IsClosed { get; set; }

        public bool IsInvoiced { get; set; }
    }
}
