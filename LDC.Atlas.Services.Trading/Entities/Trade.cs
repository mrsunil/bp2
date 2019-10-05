using LDC.Atlas.DataAccess.DapperMapper;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace LDC.Atlas.Services.Trading.Entities
{
    public class Trade<T>
        where T : class, ISection
    {
        // -- General Information

        [Column(Name = "PhysicalContractId")]
        public long ContractId { get; set; }

        [Column(Name = "PhysicalContractNumberId")]
        public long ContractNumber { get; set; }

        [Column(Name = "PhysicalContractCode")]
        public string ContractCode { get; set; }

        public ContractType Type { get; set; }

        public DateTime ContractDate { get; set; }

        public long DepartmentId { get; set; }

        [Column(Name = "Trader")]
        public long TraderId { get; set; }

        // -- Counterparty
        public string BuyerCode { get; set; }

        public string SellerCode { get; set; }

        // -- Product
        public long CommodityId { get; set; }

        [Column(Name = "ContractQuantity")]
        public decimal Quantity { get; set; }

        public long WeightUnitId { get; set; }

        public ToleranceType ToleranceType { get; set; }

        [Column(Name = "TolerancePourcentage")]
        public decimal? ToleranceValue { get; set; }

        [Column(Name = "ToleranceMax")]
        public decimal? ToleranceMin { get; set; }

        public decimal? ToleranceMax { get; set; }

        // -- Terms & Period
        [Column(Name = "PortOriginCode")]
        public string PortOfOrigin { get; set; }

        [Column(Name = "PortDestinationCode")]
        public string PortOfDestination { get; set; }

        public PositionMonthType PositionMonthType { get; set; }

        [Column(Name = "MonthPositionIndex")]
        public int PositionMonthIndex { get; set; }

        // -- Exection Information
        [Column(Name = "BLDate")]
        public DateTime? BlDate { get; set; }

        public string AllocatedTo { get; set; }

        public DateTime? AllocationDate { get; set; }

        public decimal Price { get; set; }

        // -- Status
        [Column(Name = "ContractStatusCode")]
        public ContractStatus Status { get; set; }

        public string CreatedBy { get; set; }

        [Column(Name = "CreatedDateTime")]
        public DateTime? CreationDate { get; set; }

        [Column(Name = "ModifiedBy")]
        public string LastModifiedBy { get; set; }

        public DateTime? LastModifiedDate { get; set; }

        public IEnumerable<T> Sections { get; set; }

        public T Section => Sections?.FirstOrDefault();

        public IEnumerable<Cost> Costs { get; set; }

        public string GetReference()
        {
            return (Type == ContractType.Purchase ? "P" : "S")
                + ContractNumber.ToString("00000", CultureInfo.InvariantCulture) + ".000";
        }
    }
}
