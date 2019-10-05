using LDC.Atlas.DataAccess.DapperMapper;
using LDC.Atlas.Services.Trading.Entities;
using System;
using System.Collections.Generic;
using System.Linq;

namespace LDC.Atlas.Services.Trading.Application.Queries.Dto
{
    public class TradeDto
    {
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
        public string PortOriginCode { get; set; }

        public string PortDestinationCode { get; set; }

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

        [Column(Name = "ModifiedDateTime")]
        public DateTime? LastModifiedDate { get; set; }

        public IEnumerable<SectionDto> Sections { get; set; }

        public SectionDto Section => Sections?.FirstOrDefault();

        public IEnumerable<CostDto> Costs { get; set; }

        public string PortOfOrigin { get; set; }

        public string PortOfDestination { get; set; }

        public string OtherReference { get; set; }
    }
}
