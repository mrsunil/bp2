using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Entities
{
    public class SectionToUpdate
    {
        public long SectionId { get; set; }

        public short? ContractStatusCode { get; set; }

        public long DepartmentId { get; set; }

        public long BuyerCounterpartyId { get; set; }

        public long SellerCounterpartyId { get; set; }

        public string CounterpartyReference { get; set; }

        public long CommodityId { get; set; }

        public int? CropYearFrom { get; set; }

        public int? CropYearTo { get; set; }

        public long WeightUnitId { get; set; }

        public decimal Quantity { get; set; }

        public long ContractTermId { get; set; }

        public long PortTermId { get; set; }

        public long? ArbitrationId { get; set; }

        public string CurrencyCode { get; set; }

        public long PriceUnitId { get; set; }

        public decimal? ContractPrice { get; set; }

        public decimal? ContractValue { get; set; }

        public long PaymentTermsId { get; set; }

        public short? PremiumDiscountBasis { get; set; }

        public string PremiumDiscountCurrency { get; set; }

        public short? PremiumDiscountTypeId { get; set; }

        public decimal? PremiumDiscountValue { get; set; }

        public int PeriodTypeId { get; set; }

        public DateTime? DeliveryPeriodStart { get; set; }

        public DateTime? DeliveryPeriodEnd { get; set; }

        public short PositionMonthType { get; set; }

        public int? MonthPositionIndex { get; set; }

        public long? PortOriginId { get; set; }

        public long? PortDestinationId { get; set; }

        public long? BusinessSectorId { get; set; }

        public string Memorandum { get; set; }

        public long? VesselId { get; set; }

        public DateTime? BLDate { get; set; }

        public string BLReference { get; set; }

        public DateTime? ContractIssuedDate { get; set; }

        public string OtherReference { get; set; }

        public bool? IsBlDateUpdatable { get; set; }

        public DateTime ContractDate { get; set; }

        public DateTime? ContractSentDate { get; set; }

        public DateTime? LastEmailReceivedDate { get; set; }

        public DateTime? ContractReturnedDate { get; set; }

        public short? InvoicingStatusId { get; set; }
    }
}
